import * as React from "react";

type BaseTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
    /** Warna sukses */
    success?: boolean;
    /** Warna error */
    error?: boolean;
    /** Teks hint kecil di bawah textarea */
    hint?: string;
};

const TextareaField = React.forwardRef<HTMLTextAreaElement, BaseTextareaProps>(function Textarea(
    {
        className = "",
        disabled = false,
        success = false,
        error = false,
        hint,
        rows = 4,
        ...rest
    },
    ref
) {
    let areaClasses =
        `min-h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs ` +
        `placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ` +
        `bg-transparent text-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ` +
        `${className}`;

    if (disabled) {
        areaClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed ` +
            `dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        areaClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 ` +
            `dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (success) {
        areaClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 ` +
            `dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
        areaClasses += ` border-gray-300 focus:border-primary-300 focus:ring-primary-500/20 ` +
            `dark:border-gray-700 dark:focus:border-primary-800`;
    }

    return (
        <div className="relative">
      <textarea
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={areaClasses}
          aria-invalid={error || undefined}
          {...rest}
      />

            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error ? "text-error-500" : success ? "text-success-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
});

export default TextareaField;
