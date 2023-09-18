import Navbar from "./NavBar";
import "./globals.css";
import MainContainer from "./MainContainer";
import localFont from 'next/font/local'

const materialSymbols = localFont({
  variable: '--font-family-symbols',
  style: 'normal',
  src: '../node_modules/material-symbols/material-symbols-rounded.woff2',
  display: 'block',
  weight: '100 700',
})

const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "100vw",
  height: "calc(100% - 3.5rem)",
};

export const metadata = {
  title: "Flask",
  description: "Flask and Nextjs app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${materialSymbols.variable}`}>
      <body>
        <Navbar />
        <div style={containerStyle}>
          <MainContainer />
          {children}
        </div>
      </body>
    </html>
  );
}
