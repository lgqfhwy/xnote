'use client'

interface TopBarProps {
  onToggleSidebar: () => void
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header
      role="banner"
      className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex space-x-4">
          <button className="rounded px-3 py-1 text-sm hover:bg-gray-100">
            File
          </button>
          <button className="rounded px-3 py-1 text-sm hover:bg-gray-100">
            Edit
          </button>
          <button className="rounded px-3 py-1 text-sm hover:bg-gray-100">
            View
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <button className="flex items-center space-x-2 rounded px-3 py-1 hover:bg-gray-100">
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
          <span className="text-sm">User</span>
        </button>
      </div>
    </header>
  )
}
