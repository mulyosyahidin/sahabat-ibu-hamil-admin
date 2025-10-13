import {MessageCircleQuestion} from "lucide-react";

export default function EmptyConsultationsState() {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <MessageCircleQuestion className="size-8 text-pink-600 fill-pink-100" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum ada konsultasi
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Belum ada konsultasi yang diajukan oleh user.
            </p>
        </div>
    );
}
