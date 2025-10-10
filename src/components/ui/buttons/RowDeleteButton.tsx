import {Trash2} from "lucide-react";
import React from "react";

type RowBtnProps = {
    id: string | number;
    title?: string;
    message?: string;
    onRequestDelete: (id: string | number,title?: string, message?: string) => void;
};

export default function RowDeleteButton({ id, title, message, onRequestDelete }: RowBtnProps) {
    function stopRow(e: React.SyntheticEvent) {
        e.stopPropagation();
    }

    return (
        <button
            type="button"
            onMouseDown={stopRow}
            onClick={(e) => { stopRow(e); onRequestDelete(id, title, message); }}
            aria-label="Delete device"
            className="btn-icon btn-icon-delete"
        >
            <Trash2 className="h-4 w-4" aria-hidden />
            <span className="sr-only">Delete</span>
        </button>
    );
}

