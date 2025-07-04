import { useEffect } from 'react';
import styles from './Splash.module.css';
import { useNavigate } from 'react-router-dom';

export default function Splash() {

  const navigate = useNavigate();

  useEffect(() => {

    const user = localStorage.getItem('user');
    let userInfo = null;
    
    if(user) {
      try {
        userInfo = JSON.parse(user);
      } catch(e) {}
    }
    
    const timeoutId = setTimeout(() => {
      if(!userInfo?.token) {
        navigate('/login', {replace: true});
      } else {
        navigate('/home', {replace: true});
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles["splash-icon"]} />
    </div>
  )
}