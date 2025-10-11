import React from 'react';
import {MessageType} from "@/features/app/chats/types/chat.types";

interface MessageContentProps {
    content: string;
    type: MessageType | string;
    media?: {
        url: string;
        type?: string;
        filename?: string;
        videoId?: string;
    } | null;
    className?: string;
}

export const MessageContent: React.FC<MessageContentProps> = ({content, type, media, className = ''}) => {
    const formatContent = (text: string): React.ReactNode[] => {
        // Split by line breaks first
        const lines = text.split('\\n');

        return lines.map((line, lineIndex) => {
            // Process each line for bold formatting
            const parts = line.split(/(\*[^*]+\*)/g);

            const formattedLine = parts.map((part, partIndex) => {
                // Check if this part is bold text (wrapped in *)
                if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                    const boldText = part.slice(1, -1); // Remove the * characters
                    return (
                        <strong key={`${lineIndex}-${partIndex}`} className="font-semibold">
                            {boldText}
                        </strong>
                    );
                }

                // Return regular text
                return part;
            });

            // Return each line with proper line break
            return (
                <React.Fragment key={lineIndex}>
                    {formattedLine}
                    {lineIndex < lines.length - 1 && <br/>}
                </React.Fragment>
            );
        });
    };

    const renderMedia = () => {
        if (!media || !media.url) return null;

        switch (type) {
            case MessageType.IMAGE:
                console.log('Rendering image with URL: ', media.url);
                return (
                    <div className="mb-3">
                        <img
                            src={media.url}
                            alt="Message image"
                            className="max-w-full h-auto rounded-lg shadow-sm"
                            onError={(e) => {
                                console.error('Failed to load image:', media.url);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        {/* Caption for image */}
                        {content && (
                            <div className="mt-2 text-sm">
                                {formatContent(content)}
                            </div>
                        )}
                    </div>
                );

            case MessageType.VIDEO:
                console.log('Rendering video with URL: ', media.url);
                return (
                    <div className="mb-3">
                        {media.videoId && (
                            <>
                                <YouTubePlayerCompact
                                    videoId={media.videoId}
                                    title="Preview YouTube"
                                />
                                {content && (
                                    <div className="mt-2 text-sm text-white-700">
                                        {formatContent(content)}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );

            default:
                console.log('Unknown message type: ', type);
                return type;
        }
    };

    return (
        <div className={`whitespace-pre-wrap ${className}`}>
            {/* Render media based on type */}
            {renderMedia()}

            {/* Render formatted text content only for TEXT type */}
            {type === MessageType.TEXT && content && formatContent(content)}
        </div>
    );
};

type YouTubePlayerCompactProps = {
    videoId: string;
    title?: string;
    widthPx?: number; // default 224px (w-56)
};

function YouTubePlayerCompact({
                                  videoId,
                                  title = "YouTube video",
                                  widthPx = 224,
                              }: YouTubePlayerCompactProps) {
    const heightPx = Math.round((widthPx * 9) / 16);

    return (
        <div
            className="inline-block align-top"
            style={{width: widthPx, height: heightPx}}
        >
            <div className="relative w-full h-full">
                <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-md shadow-sm"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default MessageContent;
