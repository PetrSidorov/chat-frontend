import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatMain from "./pages/Chat/ChatMain";
import AuthProvider from "./context/AuthProvider";
import AvatarProvider from "./context/AvatarProvider";
// import NavigationProvider from "./context/NavigationContext";

function App() {
  return (
    <BrowserRouter>
      {/* <AvatarProvider> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />}></Route>

          <Route path="/settings" element={<ChatMain />}></Route>
          <Route path="/friends" element={<ChatMain />}></Route>
          <Route path="/messages" element={<ChatMain />}></Route>

          <Route path="/messages" element={<ChatMain />}></Route>
          <Route path="/settings" element={<ChatMain />}></Route>
        </Routes>
      </AuthProvider>
      {/* </AvatarProvider> */}
    </BrowserRouter>
  );
}

export default App;
