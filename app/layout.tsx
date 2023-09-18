import Navbar from "./NavBar";
import "./globals.css";
import { Inter } from "next/font/google";

const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "100vw",
  height: "calc(100% - 3.5rem)"
};

const leftColumnStyle: React.CSSProperties = {
  overflow: "auto",
  resize: "horizontal",
  backgroundColor: "#e0e0e0",
  width: "20%",
  marginRight: "5px",
  height: "100%"
};

const middleColumnContainerStyle: React.CSSProperties = {
  padding: "0 5px 0 0",
  height: "100%"
};

const middleColumnStyle: React.CSSProperties = {
  flex: "1",
  backgroundColor: "#c0c0c0",
  resize: "horizontal",
  cursor: "ew-resize",
  overflow: "auto",
  height: "100%"
};

const rightColumnStyle: React.CSSProperties = {
  flex: "0.4",
  backgroundColor: "#a0a0a0",
  overflow: "auto",
  marginRight: "5px",
  height: "100%"
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
    <html lang="en">
      <body>
        <Navbar />
        <div style={containerStyle}>
          <div style={leftColumnStyle}>Left Column</div>
          <div style={middleColumnStyle}>Middle Column</div>
          <div style={rightColumnStyle}>Right Column</div>
          {children}
        </div>
      </body>
    </html>
  );
}
