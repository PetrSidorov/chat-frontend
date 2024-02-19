import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatMain from "./pages/Chat/ChatMain";
import AuthProvider from "./context/AuthProvider";
import AvatarProvider from "./context/AvatarProvider";
import ResizeProvider from "./context/ResizeProvider";
import ActiveConvoProvider from "./context/AllConvoContext";
// import NavigationProvider from "./context/NavigationContext";

function App() {
  return (
    <BrowserRouter>
      {/* <AvatarProvider> */}
      <AuthProvider>
        <ResizeProvider>
          <ActiveConvoProvider>
            <Routes>
              <Route path="/" element={<Login />}></Route>

              <Route path="/settings" element={<ChatMain />}></Route>

              <Route path="/friends" element={<ChatMain />}></Route>
              <Route path="/messages" element={<ChatMain />}></Route>

              <Route path="/messages" element={<ChatMain />}></Route>
              <Route path="/settings" element={<ChatMain />}></Route>
            </Routes>
          </ActiveConvoProvider>
        </ResizeProvider>
      </AuthProvider>
      {/* </AvatarProvider> */}
    </BrowserRouter>
  );
}

export default App;
