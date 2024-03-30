import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveConvoProvider>
          <ResizeProvider>
            <Routes>
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<AuthGuard />}>
                <Route path="/" element={<MainLayout />}>
                  <Route path="messages" element={<ConvosList />} />
                  <Route path="search" element={<FriendsTab />} />
                  <Route path="settings" element={<SettingsTab />} />
                </Route>
              </Route>
            </Routes>
          </ResizeProvider>
        </ActiveConvoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
