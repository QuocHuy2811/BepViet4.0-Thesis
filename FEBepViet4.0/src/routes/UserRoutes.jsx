
import AccountPage from '../pages/user/AccountPage.jsx';
import Blog from '../pages/user/Blog.jsx';
import Explore from '../pages/user/Explore.jsx';
import Home from '../pages/user/Home.jsx';
import PostRecipe from '../pages/user/PostRecipe.jsx';
import Profile from '../pages/user/Profile.jsx';
import RecipeDetail from '../pages/user/RecipeDetail.jsx';
import SmartChef from '../pages/user/SmartChef.jsx';
import Layout from '../Layouts/UserLayout/Layout.jsx';

const userRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'explore', element: <Explore /> },
      { path: 'blog', element: <Blog /> },
      { path: 'smart-chef', element: <SmartChef /> },
      { path: 'post', element: <PostRecipe /> },
      { path: 'profile', element: <Profile /> },
      { path: 'recipe/:id', element: <RecipeDetail /> },
      { path: 'account', element: <AccountPage /> },
    ]
  }
];

export default userRoutes;