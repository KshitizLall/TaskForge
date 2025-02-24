import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { router } from "./routes/Router";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E9EDFF] to-[#F2E5FF]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

        <Routes>
          {router.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element ? <route.element /> : null}
            />
          ))}
        </Routes>

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
  )
}

export default App