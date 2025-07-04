import { Navigate, useLocation } from "react-router-dom"

const RequireLogin = ({children}) => {

  const location = useLocation();
  const user = localStorage.getItem('user');
  let userInfo = null;
  
  if(user) {
    try {
      userInfo = JSON.parse(user);
    } catch(e) {}
  }

  if(!userInfo?.token) {
    return <Navigate to="/login/email" state={{from: location}} replace />
  }

  return children;
}

export default RequireLogin;