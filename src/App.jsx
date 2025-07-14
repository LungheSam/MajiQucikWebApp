import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuyWater from './pages/BuyWater';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verifiy';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Menu from './pages/Menu';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/buy"
            element={
              <PrivateRoute>
                <BuyWater />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🚪 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-new" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
