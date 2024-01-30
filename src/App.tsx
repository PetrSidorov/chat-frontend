import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatMain from "./pages/Chat/ChatMain";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          {/* <ActiveConvoProvider> */}
          <Route path="/settings" element={<ChatMain />}></Route>
          <Route path="/friends" element={<ChatMain />}></Route>
          <Route path="/messages" element={<ChatMain />}></Route>

          <Route path="/messages" element={<ChatMain />}></Route>
          <Route path="/settings" element={<ChatMain />}></Route>
          {/* </ActiveConvoProvider> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
