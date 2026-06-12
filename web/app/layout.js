import "./globals.css";

export const metadata = {
  title: "SusurGalur — Pokok Keluarga Malaysia",
  description:
    "Salasilah keluarga yang faham budaya kita: panggilan Melayu, nasab, dan keselamatan data sebagai amanah.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>
        <header className="site-header">
          <a href="/" className="brand">Susur<span>Galur</span></a>
          <nav>
            <a href="/semak">Semak Pertalian</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          Data keluarga adalah amanah — kami penjaga, bukan pemilik.
        </footer>
      </body>
    </html>
  );
}
