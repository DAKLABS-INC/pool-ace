import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = "pk_test_c3F1YXJlLW1heWZseS05NS5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      variables: {
        colorPrimary: 'hsl(262.1 83.3% 57.8%)',
        colorBackground: 'hsl(224 71.4% 4.1%)',
        colorInputBackground: 'hsl(224 71.4% 4.1%)',
        colorInputText: 'hsl(210 20% 98%)',
        colorText: 'hsl(210 20% 98%)',
      },
      elements: {
        card: 'bg-card',
        modalBackdrop: 'bg-background/80',
      }
    }}
  >
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <App />
    </ThemeProvider>
  </ClerkProvider>
);
