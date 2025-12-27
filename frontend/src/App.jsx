import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import navbarRoutes from "./components/NavbarRoutes";
import ScrollToTop from "./components/ScrollToTop";
import Price from "./pages/Price";
import About from "./pages/About";
import DevelopersSection from "./pages/Developers";
import Documentation from "./pages/Documentation";
import TermsOfService from "./pages/Term";

function App() {
  const location = useLocation();
  const showNavbar = navbarRoutes.includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Price />} />
          <Route path="/about" element={<About />} />
          <Route path="/developers" element={<DevelopersSection />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/term" element={<TermsOfService />} />
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <ScrollToTop />
    <App />
  </Router>
);

export default AppWrapper;
