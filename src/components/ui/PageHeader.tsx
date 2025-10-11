import {Link} from "react-router";
import {Plus} from "lucide-react";

export interface PageHeaderProps {
    title: string;
    description?: string;
    navigateTo?: string;
}

export default function PageHeader({title, description, navigateTo}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                </p>
            </div>

            {navigateTo && (
                <Link
                    to={navigateTo}
                    className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus />
                    Tambah Data
                </Link>
            )}
        </div>
    )
}
