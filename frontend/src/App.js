import { Routes, Route  } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from './Pages/Loading/Loading';
import ProtectRoute from './Pages/ProtectRoute/ProtectRoute';
import AdminProtectRoute from './Admin/AdminPage/AdminProtectRoute/AdminProtectRoute';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

 
 

const Login = lazy(() => import('./Auth/Login/Login'));
const Register = lazy(() => import('./Auth/Register/Register'));
const VerifyEmail = lazy(() => import('./Auth/VerifyEmail/VerifyEmail'));
const ForgotPassword = lazy(() => import('./Auth/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./Auth/ResetPassword/ResetPassword'));
const UserHome = lazy(() => import('./Users/UserHome/UserHome'));
const AdminHome = lazy(() => import('./Admin/AdminHome/AdminHome'));
const ManageUsers = lazy(() => import('./Admin/AdminPage/ManageUsers/ManageUsers'));
const Logout = lazy(() => import('./Pages/Logout/Logout'));

function App() {
  

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/emailVerify/:token" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:id/:token" element={<ResetPassword />} />
          <Route path="/userHome" element={<ProtectRoute Component={UserHome} />} />  
          <Route path="/adminHome" element={<AdminProtectRoute Component={AdminHome} />} /> 
          <Route path="/manageUsers" element={<AdminProtectRoute Component={ManageUsers} />} /> 
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;