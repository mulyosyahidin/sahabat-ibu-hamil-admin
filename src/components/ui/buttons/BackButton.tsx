import {ArrowLeft} from "lucide-react";
import {Link} from "react-router";

export const BackButton = ({ to }: { to: string }) => {
    return (
        <Link
            to={to}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <ArrowLeft className="size-4 mr-1" />
            Kembali
        </Link>
    )
}
