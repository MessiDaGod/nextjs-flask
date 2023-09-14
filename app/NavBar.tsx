import Link from 'next/link';
import s from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">

            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/" className={s.link}>
                Home
              </Link>
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
          </div>
        </div>
      </div>
    </nav>
  );
}
