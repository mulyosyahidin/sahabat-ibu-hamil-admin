import { Link } from "react-router-dom";
import { SquarePen } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type EditButtonProps = {
    to: string;
    className?: string;
};

export const EditButton = ({ to, className }: EditButtonProps) => {
    const base =
        "inline-flex items-center px-3 py-2 bg-pink-600 hover:bg-pink-700 " +
        "text-white font-medium rounded-lg transition-colors shrink-0";

    return (
        <Link to={to} className={twMerge(base, clsx(className))}>
            <SquarePen className="size-4 mr-1" />
            Edit
        </Link>
    );
};
