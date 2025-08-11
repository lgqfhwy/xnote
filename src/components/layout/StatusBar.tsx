'use client'

export function StatusBar() {
  return (
    <footer
      role="status"
      className="flex h-6 items-center justify-between border-t border-gray-200 bg-gray-50 px-4 text-xs text-gray-600"
    >
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <span>Line 1, Col 1</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Markdown</span>
        <span>UTF-8</span>
      </div>
    </footer>
  )
}
