'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatusBar } from '@/components/layout/StatusBar'
import { Editor } from '@/components/Editor'

// Disable static generation for this page since it uses authentication
export const dynamic = 'force-dynamic'

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(250)

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isVisible={sidebarVisible}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
        />

        <main role="main" className="flex flex-1 flex-col bg-white">
          <div className="flex-1 overflow-auto p-6">
            <div className="h-full max-w-none">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Welcome to XNote
              </h1>
              <p className="mb-6 text-lg text-gray-600">
                The ultimate Markdown editor with real-time sync and
                collaboration.
              </p>

              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  You are successfully authenticated and accessing the protected
                  route. This page is protected by middleware - you can only see
                  this when logged in.
                </p>
              </div>

              <div className="flex-1">
                <Editor
                  className="h-full"
                  initialContent="<h1>Start writing your Markdown here...</h1><p>Type some text to see the WYSIWYG editor in action!</p>"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <StatusBar />
    </div>
  )
}
