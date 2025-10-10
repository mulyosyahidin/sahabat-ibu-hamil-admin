import {Link} from "react-router";

export interface BreadcrumbProps {
    items: {
        label: string;
        href?: string;
    }[];
}

export default function Breadcrumb({items}: BreadcrumbProps) {
    const lastIndex = items.length - 1;

    return (
        <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                {items.map((item, idx) => {
                    const isLast = idx === lastIndex;
                    return (
                        <li key={`${item.label}-${idx}`} className="flex items-center">
                            {isLast || !item.href ? (
                                <span
                                    aria-current={isLast ? "page" : undefined}
                                    className={isLast ? "text-gray-700 dark:text-gray-300" : ""}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.href}
                                    className="hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {item.label}
                                </Link>
                            )}

                            {idx < lastIndex && <span className="mx-2 select-none">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
