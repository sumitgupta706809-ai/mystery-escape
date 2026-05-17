import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Landing from "@/pages/Landing";
import Game from "@/pages/Game";
import NotFound from "@/pages/not-found";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Landing} />
        <Route path="/game" component={Game} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence onExitComplete={() => setShowApp(true)}>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      {showApp && <Router />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppContent />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
