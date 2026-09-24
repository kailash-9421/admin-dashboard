import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Frontend assignment dashboard"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
