import React from 'react';

interface WhatsAppLogoProps {
    width?: number;
    height?: number;
    className?: string;
    showText?: boolean;
}

const WhatsAppLogo: React.FC<WhatsAppLogoProps> = ({
                                                       width = 150,
                                                       height = 40,
                                                       className = "",
                                                       showText = true
                                                   }) => {
    if (!showText) {
        // Icon only version
        return (
            <svg
                width={32}
                height={32}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <path
                    d="M16 2C8.268 2 2 8.268 2 16c0 2.85.846 5.506 2.297 7.728L2.5 29.5l5.772-1.797C10.494 29.154 13.15 30 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"
                    className="fill-pink-500 dark:fill-pink-400"
                />
                <path
                    d="M25.314 22.594c-.297.836-1.477 1.547-2.422 1.75-.633.133-1.461.242-4.242-.906-2.977-1.227-4.922-4.203-5.07-4.398-.149-.195-1.219-1.617-1.219-3.086 0-1.469.773-2.195 1.047-2.492.274-.297.598-.371.797-.371.199 0 .398.004.574.011.184.008.43-.07.672.512.242.582.828 2.016.898 2.164.07.148.117.32.024.515-.094.195-.14.32-.281.492-.14.172-.297.383-.422.515-.14.148-.285.308-.122.605.164.297.726 1.195 1.559 1.934 1.07.95 1.973 1.242 2.254 1.383.281.14.445.117.609-.07.164-.188.703-.82.89-1.102.188-.281.375-.234.633-.14.258.093 1.641.773 1.922.914.281.14.469.211.539.328.07.117.07.676-.227 1.512z"
                    className="fill-white"
                />
            </svg>
        );
    }

    // Full logo with text
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 150 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* WhatsApp Icon */}
            <circle
                cx="20"
                cy="20"
                r="18"
                className="fill-pink-500 dark:fill-pink-400"
            />
            <path
                d="M31.314 27.594c-.297.836-1.477 1.547-2.422 1.75-.633.133-1.461.242-4.242-.906-2.977-1.227-4.922-4.203-5.07-4.398-.149-.195-1.219-1.617-1.219-3.086 0-1.469.773-2.195 1.047-2.492.274-.297.598-.371.797-.371.199 0 .398.004.574.011.184.008.43-.07.672.512.242.582.828 2.016.898 2.164.07.148.117.32.024.515-.094.195-.14.32-.281.492-.14.172-.297.383-.422.515-.14.148-.285.308-.122.605.164.297.726 1.195 1.559 1.934 1.07.95 1.973 1.242 2.254 1.383.281.14.445.117.609-.07.164-.188.703-.82.89-1.102.188-.281.375-.234.633-.14.258.093 1.641.773 1.922.914.281.14.469.211.539.328.07.117.07.676-.227 1.512z"
                className="fill-white"
            />
            
            <text
                x="45"
                y="16"
                className="fill-gray-900 dark:fill-white font-bold text-sm"
                fontSize="14"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                Sahabat Hamil
            </text>
            <text
                x="45"
                y="30"
                className="fill-gray-600 dark:fill-gray-300 text-xs"
                fontSize="10"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                Chat Bot
            </text>
        </svg>
    );
};

export default WhatsAppLogo;
