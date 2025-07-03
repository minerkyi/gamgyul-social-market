import { Navigate, useLocation } from "react-router-dom"

const RequireLogin = ({children}) => {

  const location = useLocation();
  const token = localStorage.getItem('token');

  if(!token) {
    return <Navigate to="/login/email" state={{from: location}} replace />
  }

  return children;
}

export default RequireLogin;
