// DeleteButton.tsx
import * as React from "react";
import {Trash2} from "lucide-react";

export type DeleteButtonProps = {
    /** Dipanggil saat tombol diklik. Biasanya akan memicu konfirmasi + submit delete. */
    handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Nonaktifkan tombol saat proses delete berlangsung. */
    disabled?: boolean;
    /** ClassName tambahan (opsional). */
    className?: string;
    /** Title tooltip (opsional). */
    title?: string;
};

export default function DeleteButton({
                                         handleDelete,
                                         disabled = false,
                                         className = "",
                                         title = "Hapus",
                                     }: DeleteButtonProps) {
    const stopRow = (e: React.SyntheticEvent) => {
        e.stopPropagation();

        const ne = e.nativeEvent as any;
        if (ne?.stopImmediatePropagation) ne.stopImmediatePropagation();
    };

    return (
        <button
            type="button"
            title={title}
            aria-label="Delete"
            disabled={disabled}
            onMouseDown={stopRow}
            onClick={(e) => {
                stopRow(e);
                handleDelete(e);
            }}
            className={[
                "inline-flex items-center px-4 py-2 rounded-lg transition-colors",
                "text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20",
                "hover:bg-pink-100 dark:hover:bg-pink-900/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className,
            ].join(" ")}
        >
           <Trash2 className="size-4 mr-1" />
            Hapus
        </button>
    );
}
