import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatMain from "./pages/Chat/ChatMain";
import AuthProvider from "./context/AuthContext";
// import ActiveConvoProvider from "./context/ActiveConvoContext";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          {/* <ActiveConvoProvider> */}
          <Route path="/chat" element={<ChatMain />}></Route>
          {/* </ActiveConvoProvider> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
