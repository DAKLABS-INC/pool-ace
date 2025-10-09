import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = "pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <App />
    </ThemeProvider>
  </ClerkProvider>
);
