import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";

import "./App.css";

function Navbar() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >
        JobPortal
      </Link>

      <div className="nav-links">

        <Link to="/">
          Jobs
        </Link>

        {user?.role === "recruiter" && (
          <>
            <Link to="/post-job">
              Post Job
            </Link>

            <Link to="/applications">
              Applicants
            </Link>
          </>
        )}

        {user?.role === "jobseeker" && (
          <Link to="/applications">
            My Applications
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="logout"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Jobs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/post-job"
          element={<PostJob />}
        />

        <Route
          path="/applications"
          element={<Applications />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;