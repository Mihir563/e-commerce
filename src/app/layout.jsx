"use client";

import { Provider } from "react-redux";
import { store } from "../store/store"; // Ensure the path is correct
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}

