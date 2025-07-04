import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import symbolLogo from '../assets/symbol-logo-W.png';
import styles from './Splash.module.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <img src={symbolLogo} alt="감귤마켓 로고" className={styles.logo} />
    </div>
  );
}

export default Splash;
