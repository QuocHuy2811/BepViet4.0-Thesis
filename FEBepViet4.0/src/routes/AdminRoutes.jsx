
import LayoutAdmin from '../Layouts/AdminLayout/LayoutAdmin.jsx';
import Home from '../pages/admin/Home.jsx';
import Users from '../pages/admin/Users.jsx';
import Posts from '../pages/admin/Posts.jsx';
import Report from '../pages/admin/Report.jsx';
import Categories from '../pages/admin/Categories.jsx';
import Setting from '../pages/admin/Setting.jsx';
import PostDetail from '../pages/admin/PostDetail.jsx';
import AddCategory from '../pages/admin/AddCategory.jsx';
import Comments from '../pages/admin/Comments.jsx';
import Recipes from '../pages/admin/Recipes.jsx';
import RecipeDetail from '../pages/admin/RecipeDetail.jsx';
import EditCategory from '../pages/admin/EditCategory.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import ProtectRoute from '../pages/admin/ProtectRoute.jsx';
import { useRoutes } from 'react-router-dom';

const AdminRoutes = () => useRoutes([
    {
        path: '/admin',
        element: (
            <ProtectRoute>
                <LayoutAdmin />
            </ProtectRoute>
        )   
        ,
        children: [
            { index: true, element: <Home /> },
            { path: 'quan-ly-nguoi-dung', element: <Users /> },
            { path: 'quan-ly-bai-dang', element: <Posts /> },
            { path: 'bao-cao', element: <Report /> },
            { path: 'quan-ly-danh-muc', element: <Categories /> },
            { path: 'cai-dat', element: <Setting /> },
            { path: 'xem-chi-tiet-bai-dang/:id', element: <PostDetail /> },
            { path: 'them-danh-muc', element: <AddCategory /> },
            { path: 'quan-ly-binh-luan', element: <Comments /> },
            { path: 'quan-ly-cong-thuc', element: <Recipes /> },
            { path: 'xem-chi-tiet-cong-thuc/:id', element: <RecipeDetail /> },
            { path: 'sua-danh-muc/:slug', element: <EditCategory /> },
           
        ]
    },
      { path: '/admin/dang-nhap', element: <AdminLogin /> },
]);

export default AdminRoutes;
