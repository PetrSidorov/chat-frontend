import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import ActiveConvoProvider from "./context/AllConvoContext";
import AuthProvider from "./context/AuthProvider";
import ResizeProvider from "./context/ResizeProvider";
import MainLayout from "./pages/Chat/MainLayout";
import FriendsTab from "./pages/Chat/sidebar/FriendsTab";
import SettingsTab from "./pages/Chat/sidebar/SettingsTab";
import ConvosList from "./pages/Chat/sidebar/convos/ConvosList";
import LoginForm from "./pages/Login/LoginForm";
import Register from "./pages/Login/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveConvoProvider>
          <ResizeProvider>
            <Routes>
              {/* <Route path="/login" element={<Login />}></Route> */}
              <Route path="/login" element={<LoginForm />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route element={<AuthGuard />}>
                <Route path="/" element={<MainLayout />}>
                  <Route path="messages" element={<ConvosList />} />
                  <Route path="search" element={<FriendsTab />} />
                  <Route path="settings" element={<SettingsTab />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Route>
            </Routes>
          </ResizeProvider>
        </ActiveConvoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
