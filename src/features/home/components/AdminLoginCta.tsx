import { Link } from "react-router";
import { LogIn } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type AdminLoginCtaProps = {
    className?: string;
};

export default function AdminLoginCta({ className }: AdminLoginCtaProps) {
    const base =
        "group inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white";
    const effects =
        "shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:transform-none";
    const gradient =
        "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 " +
        "dark:from-pink-400 dark:to-pink-500 dark:hover:from-pink-500 dark:hover:to-pink-600";
    const focusRing =
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 dark:focus-visible:ring-offset-gray-900";

    const classes = twMerge(clsx(base, effects, gradient, focusRing, className));

    return (
        <Link to="/login" className={classes}>
            <LogIn
                className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110"
                aria-hidden
            />
            <span>Admin Login</span>
        </Link>
    );
}
