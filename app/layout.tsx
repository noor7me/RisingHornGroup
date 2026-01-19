import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "RisingHorn Group",
  description: "International trading company registered in the United States with operations in the United Arab Emirates (UAE), focused on import, export, and distribution of food and consumer products."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <Navbar />
        </div>
        <main className="container">{children}</main>
        <div className="container">
          <Footer />
        </div>
      </body>
    </html>
  );
}
