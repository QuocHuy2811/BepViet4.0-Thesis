import { BrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useState } from "react";

function App() {
  const [user,setUser]=useState(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <UserRoutes token={user} setUser={setUser}/>
      <AdminRoutes />
    </BrowserRouter>
  );
}



export default App;
