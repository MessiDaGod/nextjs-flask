'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import cn from 'classnames';
import { useTheme } from '../ThemeContext';
import { usePathname, useRouter } from 'next/navigation';


export default function TopBar() {
  const scrollDetectorRef = useRef(null);
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const {theme} = useTheme();

  return (
    <>
      <div ref={scrollDetectorRef} className="scroll-detector-ref" />
      <nav
        className={cn(
          'fixed top-0 bg-[#d9dddc] duration-300 backdrop-filter backdrop-blur-lg backdrop-saturate-200 transition-shadow items-center w-full flex justify-between bg-wash dark:bg-wash-dark dark:bg-opacity-95 lg:pe-5 z-40 dark:border-b dark:border-custom-bottom dark:bg-[#292e31]',
          // {'shadow-nav dark:shadow-nav-dark': isScrolled || isMenuOpen}
        )}>
        <div className="flex items-center justify-end w-full overflow-hidden">
          <div className="flex items-center">
            <Link href={'/'}>
              <img
                className="cursor-pointer"
                src={`/Logo.jpg`}
                alt="Logo"
                width="50"
                height="40"
              />
            </Link>

          </div>

          {/* Profile image and menu container */}
          <div className="flex ml-auto items-center mr-[10px]">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => {
                setIsHovered(true)
              }}
              onMouseLeave={() => {
                setIsHovered(false)
              }}
              onClick={() => setIsHovered(!isHovered)}>



            </div>
          </div>
          {/* <div className="flex items-center justify-end">
            <NotificationsPopup />
          </div> */}
        </div>
      </nav>
    </>
  )
}
