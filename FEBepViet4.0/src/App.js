import { BrowserRouter, useRoutes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const AppRoutes = () => {
  // Gộp 2 danh sách route lại với nhau
  const routing = useRoutes([...UserRoutes, ...AdminRoutes]);
  return routing;
};
function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}



export default App;
