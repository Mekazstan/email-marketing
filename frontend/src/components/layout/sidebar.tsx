"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/helpers';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'chart-pie' },
  { name: 'Prospects', href: '/prospects', icon: 'users' },
  { name: 'Emails', href: '/emails', icon: 'mail' },
  { name: 'Calls', href: '/calls', icon: 'phone' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
      <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-2 space-y-1 bg-white">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
            >
              <svg 
                className={cn(
                  pathname === item.href 
                    ? 'text-gray-500' 
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-5 w-5'
                )}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Simple icon placeholder - replace with actual icons in production */}
                <rect x="3" y="3" width="14" height="14" rx="2" />
              </svg>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
