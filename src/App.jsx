import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./UserApp";
import AdminApp from "./AdminApp";
import Home from "./Home"; // <-- Import màn hình chọn

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chọn: vào Admin hoặc User */}
        <Route path="/" element={<Home />} />

        {/* Vùng quản trị Admin */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Vùng User */}
        <Route path="/user/*" element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
