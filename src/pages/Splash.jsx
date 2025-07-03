import { useEffect } from 'react';
import styles from './Splash.module.css';
import { useNavigate } from 'react-router-dom';

export default function Splash() {

  const navigate = useNavigate();

  useEffect(() => {
    console.log('index');
    const timeoutId = setTimeout(() => {
      const token = localStorage.getItem('token');
      if(!token) {
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