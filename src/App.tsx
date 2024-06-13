import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AuthGuard from "./components/AuthGuard";
import ActiveConvoProvider from "./context/AllConvoProvider";
import AuthProvider from "./context/AuthProvider";
import ResizeProvider from "./context/ResizeProvider";
import MainLayout from "./pages/Chat/MainLayout";
import FriendsTab from "./pages/Chat/sidebar/FriendsTab";
import SettingsTab from "./pages/Chat/sidebar/SettingsTab";
import ConvosList from "./pages/Chat/sidebar/convos/ConvosList";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import MessageProvider from "./context/MessageProvider";
const queryClient = new QueryClient();

function App() {
  // TODO: it would be cool to implment portals here for learning purposes
  // if it makes sense of course
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <AuthProvider>
          <ActiveConvoProvider>
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
          </ActiveConvoProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
