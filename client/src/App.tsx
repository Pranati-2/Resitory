import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PathPreview from "@/pages/PathPreview";
import MyPaths from "@/pages/MyPaths";
import About from "@/pages/About";
import { AuthProvider } from './contexts/AuthContext'; // Step 1: Import AuthProvider

// Router component remains the same
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/path/:id" component={PathPreview} />
      <Route path="/mypaths" component={MyPaths} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    // Step 2: Wrap with AuthProvider
    <AuthProvider> 
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {/* 
            The example in the prompt suggested moving Header/Footer here.
            However, the current App.tsx structure doesn't have a global Header/Footer
            at this level. They are typically part of individual page components or
            a layout component that would wrap <Router />.
            For this task, I will strictly follow wrapping the existing content of App.tsx
            as it is. If Header/Footer need access to AuthContext and are rendered
            inside <Router />'s components, they will get it.
          */}
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
