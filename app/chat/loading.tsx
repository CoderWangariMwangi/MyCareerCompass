export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="pt-20 pb-4">
        <div className="container mx-auto px-4 h-[calc(100vh-6rem)]">
          <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading AI Chat...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
