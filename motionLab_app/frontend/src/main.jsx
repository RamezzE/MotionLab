import React from "react";
import ReactDOM from "react-dom/client";

import { GlobalProvider } from "./context/GlobalProvider";

import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
