import { Link } from 'react-router-dom';
import style from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div>
        <span>
          Created by
        </span>
        <Link target="_blank" to="https://shirefmohammed-267a4.web.app/">
          Shiref Mohammed
        </Link>
      </div>
    </footer>
  )
}

export default Footer
