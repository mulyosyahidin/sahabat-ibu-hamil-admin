import clsx from "clsx";
import {twMerge} from "tailwind-merge";
import {LucideIcon} from "lucide-react";

type FeatureCardProps = {
    title: string;
    description: string;
    ariaLabel?: string;
    icon: LucideIcon;
    color?: "indigo" | "blue" | "green" | "pink" | "violet" | "emerald";
    className?: string;
};

export default function FeatureCard({
                                        title,
                                        description,
                                        ariaLabel,
                                        icon: Icon,
                                        color = "indigo",
                                        className,
                                    }: FeatureCardProps) {
    const shell = twMerge(
        clsx(
            "group p-6 rounded-2xl shadow-lg transition-all duration-300 ring-1 ring-transparent",
            "bg-white dark:bg-gray-800",
            "hover:ring-gray-200 dark:hover:ring-gray-700",
            "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl",
            className
        )
    );

    const colorBg: Record<string, string> = {
        indigo:
            "bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800",
        blue:
            "bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800",
        green:
            "bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800",
        pink:
            "bg-pink-100 dark:bg-pink-900 group-hover:bg-pink-200 dark:group-hover:bg-pink-800",
        violet:
            "bg-violet-100 dark:bg-violet-900 group-hover:bg-violet-200 dark:group-hover:bg-violet-800",
        emerald:
            "bg-emerald-100 dark:bg-emerald-900 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800",
    };

    const colorText: Record<string, string> = {
        indigo: "text-indigo-600 dark:text-indigo-300",
        blue: "text-blue-600 dark:text-blue-300",
        green: "text-green-600 dark:text-green-300",
        pink: "text-pink-600 dark:text-pink-300",
        violet: "text-violet-600 dark:text-violet-300",
        emerald: "text-emerald-600 dark:text-emerald-300",
    };

    const iconWrap = twMerge(
        clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:scale-105",
            colorBg[color]
        )
    );

    const iconCls = twMerge(
        clsx("w-6 h-6 transition-transform duration-300 group-hover:scale-110", colorText[color])
    );

    const Content = (
        <>
            <div className={iconWrap}>
                <Icon className={iconCls} aria-hidden/>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        </>
    );

    return (
        <button
            type="button"
            aria-label={ariaLabel ?? `Buka ${title}`}
            className={twMerge(
                shell,
                "text-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-700"
            )}
        >
            {Content}
        </button>
    );
}
