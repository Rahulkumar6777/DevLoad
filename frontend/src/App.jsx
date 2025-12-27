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

function App() {
  const location = useLocation();
  const showNavbar = navbarRoutes.includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <ScrollToTop/>
    <App />
  </Router>
);

export default AppWrapper;
