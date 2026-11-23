export default function RootBootFallback() {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Menghubungkan ke server…</p>
            </div>
        </div>
    );
}
