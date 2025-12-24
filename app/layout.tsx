import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "RisingHorn Group",
  description: "International trading company focused on food and consumer products for Somali and East African markets."
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
