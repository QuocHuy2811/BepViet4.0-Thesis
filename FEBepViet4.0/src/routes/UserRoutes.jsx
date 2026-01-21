import { useRoutes } from 'react-router-dom';
import AccountPage from '../pages/user/AccountPage.jsx';
import Blog from '../pages/user/Blog.jsx';
import Explore from '../pages/user/Explore.jsx';
import Home from '../pages/user/Home.jsx';
import PostRecipe from '../pages/user/PostRecipe.jsx';
import Profile from '../pages/user/Profile.jsx';
import RecipeDetail from '../pages/user/RecipeDetail.jsx';
import SmartChef from '../pages/user/SmartChef.jsx';
import Layout from '../Layouts/UserLayout/Layout.jsx';
import UserLogin from '../pages/user/UserLogin.jsx';
import UserSignup from '../pages/user/UserSignup.jsx';
import ForgetPassword from '../pages/user/ForgetPassword.jsx';
import ResetPassword from '../pages/user/ResetPassword.jsx';

const UserRoutes = ({token,setUser}) => useRoutes([
  {
    path: '/',
    element: <Layout token={token} setUser={setUser} />,
    children: [
      { index: true, element: <Home /> },
      { path: 'explore', element: <Explore /> },
      { path: 'blog', element: <Blog /> },
      { path: 'smart-chef', element: <SmartChef /> },
      { path: 'post', element: <PostRecipe /> },
      { path: 'profile', element: <Profile /> },
      { path: 'recipe/:id', element: <RecipeDetail /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'login', element: <UserLogin token={token} setUser={setUser}/> },
      { path: 'signup', element: <UserSignup/> },
      { path: 'forget-password', element: <ForgetPassword/> },
      { path: 'reset-password/:token', element: <ResetPassword/> },
    ]
  }
]);

export default UserRoutes;