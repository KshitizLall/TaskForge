import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { router } from "./routes/Router";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-300 to-stone-400">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="pt-5">
        <Routes>
          {router.map((route) => {
            // If the route is protected and has an element
            if (route.protected && route.element) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedRoute element={route.element} />}
                />
              );
            }

            // Regular non-protected route
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
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}

export default App;
