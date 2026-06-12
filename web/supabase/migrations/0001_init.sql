-- ============================================================
-- SusurGalur — 0001_init.sql
-- Core schema + Row-Level Security (one DB, hard walls per tree
-- — app plan §8b). Apply with: supabase db push
--
-- Design rules baked in:
--   * every row carries tree_id; every tree_id is indexed
--   * kinship labels are NEVER stored — structure only
--   * soft delete only (deleted_at) — no DELETE policies exist
--   * no IC numbers anywhere (v1 decision)
-- ============================================================

-- ---------- profiles (one per auth user) ----------
create table public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at  timestamptz not null default now()
);

-- ---------- trees ----------
create table public.trees (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_by  uuid not null references auth.users(id),
  plan        text not null default 'percuma' check (plan in ('percuma','keluarga')),
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- ---------- memberships (who belongs to which tree, with role) ----------
-- Roles (app plan §8b): penjaga > penyunting > penyumbang > pemerhati
create table public.memberships (
  tree_id    uuid not null references public.trees(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'pemerhati'
             check (role in ('penjaga','penyunting','penyumbang','pemerhati')),
  created_at timestamptz not null default now(),
  primary key (tree_id, user_id)
);
create index idx_memberships_user on public.memberships(user_id);

-- ---------- persons ----------
create table public.persons (
  id            uuid primary key default gen_random_uuid(),
  tree_id       uuid not null references public.trees(id) on delete cascade,
  given_name    text not null,
  sex           text check (sex in ('M','F')),
  birth_year    int,
  death_year    int,
  place_origin  text,
  education     text,
  education_field text,
  notes         text,            -- catatan / anecdotes (verification triggers, §8c)
  photo_path    text,            -- storage path; served via signed expiring URLs
  claimed_by    uuid references auth.users(id),  -- profile claiming (§8b)
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz      -- soft delete only (§8d)
);
create index idx_persons_tree on public.persons(tree_id);

-- ---------- parent-child edges ----------
create table public.parent_child_edges (
  id           uuid primary key default gen_random_uuid(),
  tree_id      uuid not null references public.trees(id) on delete cascade,
  parent_id    uuid not null references public.persons(id) on delete cascade,
  child_id     uuid not null references public.persons(id) on delete cascade,
  basis        text not null default 'biological'
               check (basis in ('biological','angkat','tiri','susuan')),
  verification text not null default 'belum'
               check (verification in ('disahkan','belum','dipertikai')),  -- §8c
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  unique (parent_id, child_id)
);
create index idx_edges_tree   on public.parent_child_edges(tree_id);
create index idx_edges_child  on public.parent_child_edges(child_id);
create index idx_edges_parent on public.parent_child_edges(parent_id);

-- ---------- unions (marriages — polygamy = multiple rows per person) ----------
create table public.unions (
  id          uuid primary key default gen_random_uuid(),
  tree_id     uuid not null references public.trees(id) on delete cascade,
  status      text not null default 'active' check (status in ('active','cerai','kematian')),
  nikah_year  int,
  cerai_year  int,
  verification text not null default 'belum'
               check (verification in ('disahkan','belum','dipertikai')),
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index idx_unions_tree on public.unions(tree_id);

create table public.union_partners (
  union_id  uuid not null references public.unions(id) on delete cascade,
  person_id uuid not null references public.persons(id) on delete cascade,
  primary key (union_id, person_id)
);
create index idx_union_partners_person on public.union_partners(person_id);

-- ---------- audit log (the "siapa tengok salasilah kita" feature + breach trail) ----------
create table public.audit_log (
  id         bigint generated always as identity primary key,
  tree_id    uuid not null references public.trees(id) on delete cascade,
  actor      uuid references auth.users(id),
  action     text not null,           -- e.g. person.create, edge.soft_delete
  entity     text,                    -- table + id
  detail     jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_tree_time on public.audit_log(tree_id, created_at desc);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.trees              enable row level security;
alter table public.memberships        enable row level security;
alter table public.persons            enable row level security;
alter table public.parent_child_edges enable row level security;
alter table public.unions             enable row level security;
alter table public.union_partners     enable row level security;
alter table public.audit_log          enable row level security;

-- Helper functions (SECURITY DEFINER avoids policy recursion on memberships).
create or replace function public.is_tree_member(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships m where m.tree_id = t and m.user_id = auth.uid());
$$;

create or replace function public.tree_role(t uuid)
returns text language sql stable security definer set search_path = public as $$
  select m.role from memberships m where m.tree_id = t and m.user_id = auth.uid();
$$;

create or replace function public.can_edit(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.tree_role(t) in ('penjaga','penyunting'), false);
$$;

-- profiles: you see and manage only your own
create policy profiles_select on public.profiles for select using (user_id = auth.uid());
create policy profiles_insert on public.profiles for insert with check (user_id = auth.uid());
create policy profiles_update on public.profiles for update using (user_id = auth.uid());

-- trees: members read; any signed-in user creates (becoming penjaga via trigger below);
-- only penjaga updates. NO delete policy — soft delete via update.
create policy trees_select on public.trees for select using (public.is_tree_member(id));
create policy trees_insert on public.trees for insert with check (created_by = auth.uid());
create policy trees_update on public.trees for update using (public.tree_role(id) = 'penjaga');

-- memberships: members see their tree's roster; penjaga manages it
create policy memberships_select on public.memberships for select using (public.is_tree_member(tree_id));
create policy memberships_insert on public.memberships for insert with check (public.tree_role(tree_id) = 'penjaga');
create policy memberships_update on public.memberships for update using (public.tree_role(tree_id) = 'penjaga');
create policy memberships_delete on public.memberships for delete using (
  public.tree_role(tree_id) = 'penjaga' or user_id = auth.uid()  -- you may leave a tree
);

-- persons / edges / unions: members read; penjaga+penyunting write. No DELETE policies.
create policy persons_select on public.persons for select using (public.is_tree_member(tree_id));
create policy persons_insert on public.persons for insert with check (public.can_edit(tree_id));
create policy persons_update on public.persons for update using (public.can_edit(tree_id));

create policy edges_select on public.parent_child_edges for select using (public.is_tree_member(tree_id));
create policy edges_insert on public.parent_child_edges for insert with check (public.can_edit(tree_id));
create policy edges_update on public.parent_child_edges for update using (public.can_edit(tree_id));

create policy unions_select on public.unions for select using (public.is_tree_member(tree_id));
create policy unions_insert on public.unions for insert with check (public.can_edit(tree_id));
create policy unions_update on public.unions for update using (public.can_edit(tree_id));

create policy union_partners_select on public.union_partners for select using (
  exists (select 1 from public.unions u where u.id = union_id and public.is_tree_member(u.tree_id))
);
create policy union_partners_insert on public.union_partners for insert with check (
  exists (select 1 from public.unions u where u.id = union_id and public.can_edit(u.tree_id))
);

-- audit log: members write (their own actions), only penjaga reads
create policy audit_insert on public.audit_log for insert with check (
  public.is_tree_member(tree_id) and actor = auth.uid()
);
create policy audit_select on public.audit_log for select using (public.tree_role(tree_id) = 'penjaga');

-- ---------- creator automatically becomes penjaga ----------
create or replace function public.handle_new_tree()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into memberships (tree_id, user_id, role) values (new.id, new.created_by, 'penjaga');
  return new;
end;
$$;
create trigger on_tree_created after insert on public.trees
  for each row execute function public.handle_new_tree();

-- ---------- updated_at maintenance ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger persons_touch before update on public.persons
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Later migrations (don't build now, just reserved):
--   0002 invites (expiring single-tree links)  ·  0003 endorsements +
--   deletion quarantine (§8c/§8d)  ·  0004 bridges between trees (§8b)
--   0005 media metadata + voice notes
-- ============================================================
