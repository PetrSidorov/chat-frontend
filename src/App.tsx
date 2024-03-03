import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import ActiveConvoProvider from "./context/AllConvoContext";
import AuthProvider from "./context/AuthProvider";
import ResizeProvider from "./context/ResizeProvider";
import ChatMain from "./pages/Chat/ChatMain";
import Login from "./pages/Login/Login";
import StartScreen from "./pages/StartScreen/StartScreen";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveConvoProvider>
          <ResizeProvider>
            <Routes>
              <Route element={<AuthGuard />}>
                <Route path="/" element={<StartScreen />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/settings" element={<ChatMain />}></Route>
                <Route path="/friends" element={<ChatMain />}></Route>
                <Route path="/messages" element={<ChatMain />}></Route>
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
