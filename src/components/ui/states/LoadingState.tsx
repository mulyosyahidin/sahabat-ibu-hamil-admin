export default function LoadingState() {
    return (
        <div className="p-12">
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
            </div>
        </div>
    )
}
