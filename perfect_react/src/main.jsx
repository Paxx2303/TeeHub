  // src/main.jsx
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import { Provider } from "react-redux";
  import { store } from "./store/store.js";        // <-- LƯU Ý: named import
  import AppRoutes from "./routes";
  import "./index.css";
  import CartAuthSync from "@/components/CartSync/CartAuthSync";

  ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <BrowserRouter>
        <CartAuthSync />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
