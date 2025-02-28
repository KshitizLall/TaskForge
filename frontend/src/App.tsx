import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { router } from "./routes/Router";

function App() {
  return (
    <div className="min-h-screen font-quicksand">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div>
        <Routes>
          {router.map((route) => {
            if (route.protected && route.element) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedRoute element={route.element} />}
                />
              );
            }
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element ? <route.element /> : null}
              />
            );
          })}
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}

export default App;
