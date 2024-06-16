import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthGuard from "./components/AuthGuard";
import AuthProvider from "./context/AuthProvider";
import MessageProvider from "./context/MessageProvider";
import ResizeProvider from "./context/ResizeProvider";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import MainLayout from "./pages/Chat/MainLayout";
import FriendsTab from "./pages/Chat/sidebar/FriendsTab";
import SettingsTab from "./pages/Chat/sidebar/SettingsTab";
import ConvosList from "./pages/Chat/sidebar/convos/ConvosList";
const queryClient = new QueryClient({
  // TODO: I use websockets for the most part,
  // but not sure if it's a good idea, research needed
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  // TODO: it would be cool to implment portals here for learning purposes
  // if it makes sense of course
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <AuthProvider>
          <MessageProvider>
            <ResizeProvider>
              <Routes>
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<AuthGuard />}>
                  <Route
                    path="*"
                    element={<Navigate to="/messages" replace />}
                  />
                  <Route path="/" element={<MainLayout />}>
                    <Route path="messages" element={<ConvosList />} />
                    <Route path="search" element={<FriendsTab />} />
                    <Route path="settings" element={<SettingsTab />} />
                  </Route>
                </Route>
              </Routes>
            </ResizeProvider>
          </MessageProvider>
          {/* </ActiveConvoProvider> */}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
