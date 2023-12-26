import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import AuthProvider from "./context/AuthContext";
// import ActiveConvoProvider from "./context/ActiveConvoContext";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          {/* <ActiveConvoProvider> */}
          <Route path="/chat" element={<Chat />}></Route>
          {/* </ActiveConvoProvider> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
