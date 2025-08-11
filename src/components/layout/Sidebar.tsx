'use client'

import { useState } from 'react'

interface SidebarProps {
  isVisible: boolean
  width: number
  onWidthChange: (width: number) => void
}

export function Sidebar({ isVisible, width, onWidthChange }: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(200, Math.min(600, e.clientX))
      onWidthChange(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  // Add event listeners when resizing starts
  if (typeof window !== 'undefined') {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }

  if (!isVisible) return null

  return (
    <aside
      role="navigation"
      className="relative flex-shrink-0 border-r border-gray-200 bg-gray-50"
      style={{ width: `${width}px` }}
    >
      <div className="h-full p-4">
        <h3 className="mb-4 font-semibold text-gray-900">Explorer</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Files will appear here</div>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize transition-colors hover:bg-blue-500"
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: isResizing ? '#3b82f6' : 'transparent' }}
      />
    </aside>
  )
}
