import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';

import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import VerifySuccess from '@pages/VerifySuccess';
import SignUp from '@pages/SignUp';
import SignIn from '@pages/SignIn';
import Diary from '@pages/Diary';
import FoodSearch from '@pages/FoodSearch';
import FoodDetails from '@pages/FoodDetails';
import Profile from '@pages/Profile';
import Dashboard from '@pages/Dashboard';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    protected: false,
    component: SignUp,
    layout: AuthLayout,
  },
  {
    path: '/verify-success',
    name: 'VerifySuccess',
    protected: false,
    component: VerifySuccess,
    layout: AuthLayout,
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    protected: false,
    component: SignIn,
    layout: AuthLayout,
  },
  {
    path: '/diary',
    name: 'Diary',
    protected: true,
    component: Diary,
    layout: MainLayout,
  },
  {
    path: '/search',
    name: 'FoodSearch',
    protected: true,
    component: FoodSearch,
    layout: MainLayout,
  },
  {
    path: '/food/:foodType/:foodName',
    name: 'FoodDetails',
    protected: true,
    component: FoodDetails,
    layout: MainLayout,
  },
  {
    path: '/profile',
    name: 'Profile',
    protected: true,
    component: Profile,
    layout: MainLayout,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    protected: true,
    component: Dashboard,
    layout: MainLayout,
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
