import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const location = useLocation()
  const { bruker, loggUt } = useAuth()

  const erAdmin = bruker?.rolle === 'admin'
  const erLærer = bruker?.rolle === 'lærer'
  const erElev = bruker?.rolle === 'elev'

  const navigation = [
    { name: 'Matteboka', to: '/' },
    ...(erElev || erLærer || erAdmin ? [{ name: 'Profil', to: '/profil' }] : []),
    ...(erLærer || erAdmin ? [{ name: 'Elever', to: '/elever' }] : []),
    ...(erAdmin ? [{ name: 'Adminpanel', to: '/admin' }] : []),
    ...(!bruker ? [{ name: 'Logg inn', to: '/login' }] : []),
  ]

  return (
    <Disclosure as="nav" className="bg-gray-900 text-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LightBulbIcon className="h-6 w-6 text-yellow-400" />
              <h1 className="text-xl font-bold">Matteboka</h1>
            </div>

            {/* Mobilmeny knapp */}
            <div className="md:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-200 hover:text-white">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>

            {/* Desktopmeny */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={classNames(
                    location.pathname === item.to
                      ? 'text-white font-semibold'
                      : 'text-gray-300 hover:text-white',
                    'px-3 py-2 rounded-md text-sm'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {bruker && (
                <button
                  onClick={loggUt}
                  className="text-sm text-red-300 hover:text-white border border-red-300 px-3 py-1 rounded"
                >
                  Logg ut
                </button>
              )}
            </div>
          </div>

          {/* Mobilmeny innhold */}
          <Disclosure.Panel className="md:hidden px-4 pb-3 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={classNames(
                  location.pathname === item.to
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white',
                  'block px-3 py-2 rounded-md text-base'
                )}
              >
                {item.name}
              </Link>
            ))}

            {bruker && (
              <button
                onClick={loggUt}
                className="block w-full text-left text-red-400 hover:text-white px-3 py-2 rounded-md text-base"
              >
                Logg ut
              </button>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
