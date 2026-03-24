import { AuthProvider } from '@/components/auth-provider'
import Sidebar from '@/components/sidebar'

export const dynamic = 'force-dynamic'

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-surface-alt">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden w-full pt-16 pb-20 md:pt-4 md:pb-4">
          <div className="p-4 md:p-8 max-w-7xl mx-auto mt-2 md:mt-0">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
