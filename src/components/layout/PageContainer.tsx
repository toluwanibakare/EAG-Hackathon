interface PageContainerProps {
  children: React.ReactNode
  className?: string
  padded?: boolean
}

export function PageContainer({ children, className = '', padded = true }: PageContainerProps) {
  return (
    <main
      className={`min-h-screen bg-[#F7F8FB] dark:bg-[#0B1320] pb-20 ${padded ? 'px-4' : ''} overscroll-none transition-colors ${className}`}
      style={padded ? { paddingTop: 'calc(56px + env(safe-area-inset-top, 0px))' } : undefined}
    >
      <div className="max-w-lg mx-auto w-full">{children}</div>
    </main>
  )
}
