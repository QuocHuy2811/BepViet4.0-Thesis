import { BrowserRouter, useRoutes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useState } from "react";

// const AppRoutes = () => {

//   const routing = useRoutes([...UserRoutes, ...AdminRoutes]);
//   return routing;
// };
function App() {
  const [user,setUser]=useState(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <UserRoutes token={user} setUser={setUser}/>
      <AdminRoutes />
      {/* <AppRoutes/> */}
    </BrowserRouter>
  );
}



export default App;
