"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, Table, Users, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/upload", label: "Upload Attendance", icon: Upload },
    { href: "/dashboard/records", label: "Attendance Records", icon: Table },
    { href: "/dashboard/students", label: "Manage Students", icon: Users },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm fixed left-0 top-0 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold p-6 border-b text-blue-700">
            Attendance System
          </h2>
          <nav className="mt-4 space-y-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-r-full transition-all ${
                  pathname === href
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
