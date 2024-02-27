import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import StartScreen from "./pages/StartScreen/StartScreen";
import ChatMain from "./pages/Chat/ChatMain";
import AuthProvider from "./context/AuthProvider";
import AvatarProvider from "./context/AvatarProvider";
import ResizeProvider from "./context/ResizeProvider";
import ActiveConvoProvider from "./context/AllConvoContext";
import AuthGuard from "./components/AuthGuard";
// import NavigationProvider from "./context/NavigationContext";

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
              </Route>
            </Routes>
          </ResizeProvider>
        </ActiveConvoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
