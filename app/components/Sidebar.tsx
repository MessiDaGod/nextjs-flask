import React, {useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {setIsMenuOpen} from '@/app/features/nflBetsSlice'
import Link from 'next/link'
import cn from 'classnames'
import sidebarData from '@/public/sidebar.json'
import {IconArrowSmall} from '@/components/Icon/IconArrowSmall'
import {RootState} from '@/app/store/store'
import iconMap from '@/components/Icon/iconMap'
import {useUserClient} from '@/hooks/useUserClient'
import {supabase} from '@/utils/supabase/supabase'
import {superUserEmails} from '@/app/utils'

export default function Sidebar({user, sidebar}) {
  const isMenuOpen = useSelector((state: RootState) => state.nflBets.isMenuOpen)
  const dispatch = useDispatch()
  const subMenuRefs = useRef([])
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const [subMenuHeight, setSubMenuHeight] = useState({})
  const subMenuRef = useRef(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) {
        setData(sidebarData)
        return

      }

      const userid = user.id
      try {
        const {data: userData, error} = await supabase.from('user_menus').select('menu_json').eq('userid', userid).single()

        if (error) {
          if (error.code !== 'PGRST116') console.error('Error fetching user menus:', error.message)

          const {data: upsertData, error: upsertError} = await supabase
            .from('user_menus')
            .upsert({userid: userid, menu_json: JSON.stringify(sidebarData)}, {onConflict: 'userid'})
            .select('*')
            .single()

          setData(sidebar) // Fallback to default sidebar JSON
          return
        }

        if (userData && userData.menu_json) {
          setData(JSON.parse(userData.menu_json)) // Parse JSON data
        } else {
          setData(sidebar) // Fallback to default sidebar JSON
        }
      } catch (err) {
        console.error('Unexpected error fetching data:', err)
        setData(sidebar) // Fallback to default sidebar JSON
      }
    }

    fetchData()
  }, [user?.id])


  const handleSubLinkClick = () => {
    dispatch(setIsMenuOpen(false))
  }

  const toggleSubMenu = (title, subMenuRef) => {
    setOpenSubMenu(openSubMenu === title ? null : title)
    if (subMenuRef.current) {
      const fullHeight = subMenuRef.current.scrollHeight + 40
      setSubMenuHeight((prev) => ({
        ...prev,
        [title]: openSubMenu === title ? '0px' : `${fullHeight}px`,
      }))
    }
  }

  const sidebarItems = data // sidebar ? JSON.parse((sidebar)) : sidebarData

  if (!subMenuRefs.current.length && sidebarItems) {
    subMenuRefs.current = sidebarItems.adminLinks.map(() => React.createRef())
  }

  if (!sidebarItems) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 w-64 h-full bg-white dark:bg-[#0d1117] shadow-lg transition-transform transform z-[21] overflow-y-auto mt-12',
        {
          '-translate-x-full': !isMenuOpen,
          'translate-x-0': isMenuOpen,
        }
      )}
      onMouseLeave={handleSubLinkClick}
    >
      <nav className="p-4 space-y-2">
        <ul className="space-y-1 overflow-auto">
          {sidebarItems.links.map((link, index: number) => {
            const subMenuRef = subMenuRefs.current[index]
            const IconComponent = link.icon ? iconMap[link.icon] : null

            return (
              <li key={link.href} className="relative">
                {/* Link without subLinks */}
                {!link.subLinks && (
                  <Link
                    className="flex items-center space-x-3 p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-md"
                    href={link.href}
                    onClick={handleSubLinkClick}>
                    {IconComponent && <IconComponent className="text-gray-600 dark:text-gray-400" />}
                    <span className="font-bold">{link.title}</span>
                  </Link>
                )}

                {/* Links with subLinks */}
                {link.subLinks && (
                  <>
                    <div
                      className="flex items-center justify-between p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700 transition rounded-md cursor-pointer"
                      onClick={() => toggleSubMenu(link.title, subMenuRef)}>
                      {IconComponent && <IconComponent className="text-gray-600 dark:text-gray-400" />}
                      <span>{link.title}</span>
                      <IconArrowSmall displayDirection={openSubMenu === link.title ? 'down' : 'up'} className="ml-auto" />
                    </div>
                    <ul
                      ref={subMenuRef}
                      style={{
                        maxHeight: subMenuHeight[link.title] || '0px',
                        transition: 'max-height 0.5s ease-in-out',
                      }}
                      className="overflow-hidden">
                      {link.subLinks.map((subLink) => {
                        return (
                          <li key={subLink.href} className="w-full">
                            <Link
                              className="block w-full items-center space-x-3 py-2 pl-8 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition"
                              href={subLink.href}
                              onClick={handleSubLinkClick}>
                              {subLink.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
              </li>
            )
          })}

          {user && superUserEmails.includes(user.email) && (
            <>
              {sidebarItems.adminLinks.map((link) => {
                const IconComponent = link.icon ? iconMap[link.icon] : null

                return (
                  <li key={link.href} className="relative">
                    {/* Link without subLinks */}
                    {!link.subLinks && (
                      <Link
                        className="flex items-center space-x-3 p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-md"
                        href={link.href}
                        onClick={handleSubLinkClick}>
                        {IconComponent && <IconComponent className="text-gray-600 dark:text-gray-400" />}
                        <span className="font-bold">{link.title}</span>
                      </Link>
                    )}

                    {/* Links with subLinks */}
                    {link.subLinks && (
                      <>
                        <div
                          className="flex items-center justify-between p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-md cursor-pointer"
                          onClick={() => toggleSubMenu(link.title, subMenuRef)}>
                          {IconComponent && <IconComponent className="text-gray-600 dark:text-gray-400" />}
                          <span>{link.title}</span>
                          <IconArrowSmall
                            displayDirection={openSubMenu === link.title ? 'down' : 'up'}
                            className="ml-auto"
                          />
                        </div>

                        <ul
                          ref={subMenuRef}
                          style={{
                            maxHeight: subMenuHeight[link.title] || '0px',
                            transition: 'max-height 0.5s ease-in-out',
                          }}
                          className="overflow-hidden pl-8">
                          {link.subLinks.map((subLink) => {
                            return (
                              <li key={subLink.href} className="py-1">
                                <Link
                                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all block"
                                  href={subLink.href}
                                  onClick={handleSubLinkClick}>
                                  {subLink.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    )}
                  </li>
                )
              })}
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}
