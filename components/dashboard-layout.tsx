"use client"

import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="md:mr-64 min-h-screen">
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </header>

          {/* Content */}
          {children}
        </div>
      </main>
    </div>
  )
}
