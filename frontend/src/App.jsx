import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import Announcements from "./pages/Announcements";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <AppRoutes />
          
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
