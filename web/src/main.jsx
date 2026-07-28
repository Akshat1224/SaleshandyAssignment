import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastProvider } from "@heroui/react";
import "./theme.css";
import App from "./App.jsx";
import Submit from "./pages/Submit.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Wall from "./pages/Wall.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Submit /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/wall", element: <Wall /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider placement="bottom-right" />
    <RouterProvider router={router} />
  </StrictMode>
);
