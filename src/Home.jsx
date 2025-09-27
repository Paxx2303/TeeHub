import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Chọn khu vực truy cập</h1>
      <div style={{ marginTop: "20px" }}>
        <Link to="/user">
          <button style={{ marginRight: "20px", padding: "10px 20px" }}>
            Vào User
          </button>
        </Link>
        <Link to="/admin">
          <button style={{ padding: "10px 20px" }}>
            Vào Admin
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
