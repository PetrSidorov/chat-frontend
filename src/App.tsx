import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import ActiveConvoProvider from "./context/AllConvoContext";
import AuthProvider from "./context/AuthProvider";
import ResizeProvider from "./context/ResizeProvider";
import ChatMain from "./pages/Chat/ChatMain";
import Login from "./pages/Login/Login";
import StartScreen from "./pages/StartScreen/StartScreen";
import Register from "./pages/Login/Register";
import MainLayout from "./pages/Chat/MainLayout";
import ConvosList from "./pages/Chat/sidebar/convos/ConvosList";
import FriendsTab from "./pages/Chat/sidebar/FriendsTab";
import SettingsTab from "./pages/Chat/sidebar/SettingsTab";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveConvoProvider>
          <ResizeProvider>
            <Routes>
              <Route element={<AuthGuard />}>
                <Route path="/login" element={<Login />}></Route>
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
