import "./globals.css";

export const metadata = {
  title: "Nedostaješ mi Tamara",
  description: "Mala stranica za Tamaru."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6b81"
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
