import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  const isActivePath = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'chart-bar' },
    { name: 'Prospects', path: '/prospects', icon: 'users' },
    { name: 'Emails', path: '/emails', icon: 'mail' },
    { name: 'Calls', path: '/calls', icon: 'phone' },
    { name: 'Analytics', path: '/analytics', icon: 'chart-pie' },
    { name: 'Settings', path: '/settings', icon: 'cog' },
  ];
  
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen hidden md:block">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold">
          AI Outreach
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`
                  flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white
                  ${isActivePath(item.path) ? 'bg-gray-900 text-white' : ''}
                `}
              >
                <span className="mr-3">{/* Icon would go here */}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
