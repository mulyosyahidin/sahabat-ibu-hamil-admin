import React from "react";
import {useParams} from "react-router";
import {useChatByIdQuery} from "@/features/app/chats/queries/chat.query";
import { ErrorLoadingState, ShowSkeleton, Breadcrumb, BackButton } from "@/components/ui";
import {ChatDetailAccordion} from "@/features/app/chats/components/ChatDetailAccordion";
import MessagesBox from "@/features/app/chats/components/MessagesBox";
import {useChatMessagesInfiniteQuery} from "@/features/app/chats/queries/chatMessages.query";
import {ChatMessage, MessageService} from "@/features/app/chats/types/chat.types";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";

export default function ChatShowPage() {
  const { chatId: chatIdParam } = useParams();
  const chatId = chatIdParam ?? "";

  const {
    data: chatData,
    isLoading: isChatLoading,
    error: chatError,
  } = useChatByIdQuery(chatId);

  const {
    data: messagesPages,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: messagesError,
  } = useChatMessagesInfiniteQuery(chatId, 10);

  const messages: ChatMessage[] = useMemo(() => {
    const items = messagesPages?.pages.flatMap((p) => p.messages) ?? [];
    return items
      .slice()
      .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  }, [messagesPages]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const initialAutoScrolledRef = useRef(false);
  const loadingOlderRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const nearBottomRef = useRef(true);

  const [isDelayingOlder, setIsDelayingOlder] = useState(false);
  const delayTimerRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const markNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) {
      nearBottomRef.current = true;
      return;
    }
    const threshold = 80;
    nearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      markNearBottom();

      if (
        el.scrollTop <= 0 &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isDelayingOlder
      ) {
        setIsDelayingOlder(true);

        if (delayTimerRef.current != null) return;

        delayTimerRef.current = window.setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            prevScrollHeightRef.current = container.scrollHeight;
          }

          loadingOlderRef.current = true;
          fetchNextPage();
          setIsDelayingOlder(false);

          if (delayTimerRef.current != null) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
          }
        }, 2000);
      }
    },
    [
      hasNextPage,
      isFetchingNextPage,
      isDelayingOlder,
      fetchNextPage,
      markNearBottom,
    ]
  );

  useEffect(() => {
    return () => {
      if (delayTimerRef.current != null) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    if (!initialAutoScrolledRef.current && messages.length > 0) {
      scrollToBottom();
      initialAutoScrolledRef.current = true;
      return;
    }

    if (loadingOlderRef.current) {
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      loadingOlderRef.current = false;
      return;
    }

    if (nearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const messageService: MessageService = {
    getMessageType: (direction) => (direction === "OUT" ? "OUT" : "IN"),
    getMessageContent: (m) => m.body,
    getMessageMedia: (m) => m.media,
  };

  if (isChatLoading) {
    return <ShowSkeleton />;
  }

  if (!chatData || chatError) {
    return <ErrorLoadingState />;
  }

  const chat = chatData.chat;

  return (
  <div className="p-6 min-h-[100dvh] md:h-screen flex flex-col">
    {/* Header */}
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: "App", href: "/app/dashboard" },
            { label: "Chats", href: "/app/chats" },
            { label: chat.name },
          ]}
        />
        <BackButton to="/app/chats" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Chat</h1>
    </div>

    {/* Body */}
    <div className="flex-1 flex flex-col md:flex-row md:space-x-6 gap-6 md:gap-0 min-h-0">
      {/* Chat Content */}
      <div className="w-full md:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col min-h-0">
        <MessagesBox
          messages={messages}
          messagesCount={chatData.stats.message_count}
          messagesLoading={isFetchingNextPage || isDelayingOlder}
          hasMoreMessages={hasNextPage}
          messagesError={messagesError as Error | null}
          loadMessages={fetchNextPage}
          messagesContainerRef={messagesContainerRef}
          handleScroll={handleScroll}
          messageService={messageService}
        />
      </div>

      {/* Chat Detail – tampil juga di HP, responsive */}
      <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Detail Chat</h2>
        </div>

        {/* Biar panel detail bisa discroll kalau kontennya panjang */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatDetailAccordion chatData={chatData} />
        </div>
      </div>
    </div>
  </div>
);

}

