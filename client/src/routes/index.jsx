import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';

import NotFound from '@pages/NotFound';
import SignUp from '@pages/SignUp';
import SignIn from '@pages/SignIn';
import Diary from '@pages/Diary';
import FoodSearch from '@pages/FoodSearch';
import FoodDetails from '@pages/FoodDetails';
import Profile from '@pages/Profile';
import Dashboard from '@pages/Dashboard';
import AdminLayout from '@layouts/AdminLayout';
import Admin from '@pages/Admin';
import ResetPassword from '@pages/ResetPassword';
import LandingPage from '@pages/LandingPage';
import LandingPageLayout from '@layouts/LandingPageLayout';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    protected: false,
    isAdmin: false,
    component: LandingPage,
    layout: LandingPageLayout,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    protected: false,
    isAdmin: false,
    component: SignUp,
    layout: AuthLayout,
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    protected: false,
    isAdmin: false,
    component: SignIn,
    layout: AuthLayout,
  },
  {
    path: '/diary',
    name: 'Diary',
    protected: true,
    isAdmin: false,
    component: Diary,
    layout: MainLayout,
  },
  {
    path: '/search',
    name: 'FoodSearch',
    protected: true,
    isAdmin: false,
    component: FoodSearch,
    layout: MainLayout,
  },
  {
    path: '/food/:foodType/:foodName',
    name: 'FoodDetails',
    protected: true,
    isAdmin: false,
    component: FoodDetails,
    layout: MainLayout,
  },
  {
    path: '/profile',
    name: 'Profile',
    protected: true,
    isAdmin: false,
    component: Profile,
    layout: MainLayout,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    protected: true,
    isAdmin: false,
    component: Dashboard,
    layout: MainLayout,
  },
  {
    path: '/admin',
    name: 'Admin',
    protected: true,
    isAdmin: true,
    component: Admin,
    layout: AdminLayout,
  },
  {
    path: '/:token/reset-password',
    name: 'ResetPassword',
    protected: false,
    isAdmin: false,
    component: ResetPassword,
    layout: AuthLayout,
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false, isAdmin: false },
];

export default routes;
