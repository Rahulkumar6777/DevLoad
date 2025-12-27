import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import navbarRoutes from "./components/NavbarRoutes";

function App() {
  const location = useLocation();
  const showNavbar = navbarRoutes.includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar />}
      <div>
        <Routes>
          <Routes path="/" element={Home} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
