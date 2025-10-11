import {Link} from "react-router";
import {SquarePen} from "lucide-react";

export const EditButton = ({to}: { to: string }) => {
    return (
        <Link
            to={to}
            className="inline-flex items-center px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
        >
            <SquarePen className="size-4 mr-1" />
            Edit
        </Link>
    )
}
