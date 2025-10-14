import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type BackButtonProps = {
    to: string;
    className?: string;
};

export const BackButton = ({ to, className }: BackButtonProps) => {
    const base =
        "inline-flex items-center px-3 py-2 text-sm font-medium " +
        "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 " +
        "border border-gray-300 dark:border-gray-600 rounded-lg " +
        "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shrink-0";

    return (
        <Link to={to} className={twMerge(base, clsx(className))}>
            <ArrowLeft className="size-4 mr-1" />
            Kembali
        </Link>
    );
};
