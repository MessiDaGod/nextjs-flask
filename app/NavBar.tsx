import Link from 'next/link';
import s from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only white">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between">
          <div className="flex items-center">
            <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/">
                <img src="/Logo.jpg" alt="Home" className={`${s.icon}`} aria-label="Home" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
