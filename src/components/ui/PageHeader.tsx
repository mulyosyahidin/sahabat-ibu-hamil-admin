import {Link} from "react-router";
import {Plus} from "lucide-react";

export interface PageHeaderProps {
    title: string;
    description?: string;
    navigateTo?: string;
}

export default function PageHeader({title, description, navigateTo}: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 break-words">
                    {description}
                </p>
            </div>

            {navigateTo && (
                <Link
                    to={navigateTo}
                    className="inline-flex items-center gap-2 self-start sm:self-auto shrink-0 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus />
                    Tambah Data
                </Link>
            )}
        </div>

    )
}
