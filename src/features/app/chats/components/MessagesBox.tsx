import {ChatMessage, MessageService} from "@/features/app/chats/types/chat.types";
import {formatMessageTime} from "@/utils/utils";
import MessageContent from "@/features/app/chats/components/MessageContent";
import React from "react";

export type MessagesBoxProps = {
    messages: ChatMessage[];
    messagesCount: number;

    messagesLoading: boolean;
    hasMoreMessages: boolean;
    messagesError?: string | Error | null;

    loadMessages: () => void;

    messagesContainerRef: React.RefObject<HTMLDivElement | null>;
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;

    messageService: MessageService;
}

export default function MessagesBox({messages,
                                        messagesCount,
                                        messagesLoading,
                                        hasMoreMessages,
                                        messagesError,
                                        loadMessages,
                                        messagesContainerRef,
                                        handleScroll,
                                        messageService}: MessagesBoxProps) {
    return (
        <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Percakapan
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {messagesCount} pesan
                    {hasMoreMessages && ' (scroll ke atas untuk memuat lebih banyak)'}
                </p>
            </div>

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
                onScroll={handleScroll}
            >
                {/* Loading indicator for older messages */}
                {messagesLoading && hasMoreMessages && (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-blue-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span className="font-medium">Memuat pesan lama...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages Error */}
                {messagesError && (
                    <div className="text-center py-4">
                        {/*<p className="text-red-600 dark:text-red-400 text-sm">{messagesError}</p>*/}
                        <button
                            onClick={() => loadMessages()}
                            className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                            Coba lagi
                        </button>
                    </div>
                )}

                {/* Messages List */}
                {messages.length === 0 && !messagesLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Belum ada pesan</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${messageService.getMessageType(message.direction) === 'OUT' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    messageService.getMessageType(message.direction) === 'OUT'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                            >
                                <MessageContent
                                    content={messageService.getMessageContent(message)}
                                    type={message.type}
                                    media={messageService.getMessageMedia(message)}
                                    className="text-sm"
                                />
                                <p
                                    className={`text-xs mt-1 ${
                                        messageService.getMessageType(message.direction) === 'OUT'
                                            ? 'text-blue-100'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {formatMessageTime(message.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}
