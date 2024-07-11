import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";

import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
import NotFound from "./components/layout/NotFound";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container my-4">
          <Routes>
            {userRoutes}
            {adminRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <div className="position-fixed" style={{ bottom: '150px', right: '15px', zIndex: 999999 }}>
          <a href="https://m.me/205480972642216" target="_blank" rel="noopener noreferrer">
            <img src="/images/messenger.png" alt="Messenger" className="img-fluid rounded-circle shadow" style={{ width: '40px', height: '40px' }} />
          </a>
        </div>
      </div>
    </Router>
  );
}

export default App;
