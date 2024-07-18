import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {


  const {data: authData, isLoading, isError, error} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/auth/me')

        console.log('authData is here: ', res.data)
        return res.data
      } catch (error) {
        console.error(error);
        return null
      }
    },
    retry: false
  })

  if(isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return (
    <>
    <div className="flex max-w-7xl mx-auto">
      {authData && <Sidebar />}
      <Routes>
        <Route path="/" element={authData ? <HomePage /> : <Navigate to='/login'/> } />
        <Route path="/login" element={!authData ? <LoginPage /> : <Navigate to='/'/>  } />
        <Route path="/signup" element={!authData ? <SignupPage /> : <Navigate to='/login'/>} />
        <Route path="/notifications" element={authData ? <NotificationPage /> : <Navigate to='/login'/>} />
        <Route path="/profile/:username" element={authData ? <ProfilePage /> : <Navigate to='/login'/>} />
      </Routes>
      {authData && <RightPanel />}
      <Toaster />
    </div>
    </>
  );
}

export default App;
