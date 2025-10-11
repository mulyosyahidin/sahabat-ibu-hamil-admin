import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {formatDate} from "@/utils/utils";
import {getChatStatusBadge} from "@/utils/ui";
import {ChatData} from "@/features/app/chats/types/chat.types";

type PanelKey = "user" | "status" | "device" | "stats" | "time";

export function ChatDetailAccordion({chatData}: { chatData: ChatData }) {
    const [open, setOpen] = useState<PanelKey>("user");

    const toggle = (key: PanelKey) => setOpen((prev) => (prev === key ? key : key));

    const {chat, device, stats} = chatData;

    return (
        <div className="p-6 space-y-3">
            <Panel
                title="Informasi Pengguna"
                open={open === "user"}
                onClick={() => toggle("user")}
            >
                <div className="space-y-3">
                    <Field label="Nama" value={chat.name || "Belum diisi"} />
                    <Field mono label="No. WhatsApp" value={chat.wa_number} />
                    {chat.age ? <Field label="Usia" value={`${chat.age} tahun`} /> : null}
                </div>
            </Panel>

            <Panel
                title="Status Chat"
                open={open === "status"}
                onClick={() => toggle("status")}
            >
                <div className="space-y-3">
                    <Field
                        label="Status Saat Ini"
                        value={getChatStatusBadge(chat.current_stack)}
                        raw
                    />
                </div>
            </Panel>

            <Panel
                title="Device"
                open={open === "device"}
                onClick={() => toggle("device")}
            >
                <div className="space-y-3">
                    <Field label="Nama Device" value={device?.name ?? "-"} />
                    <Field mono label="Kode Device" value={device?.code ?? "-"} />
                    <Field label="Nomor Telepon" value={device?.phone_number ?? <i className="text-gray-500">Tidak ada</i>} raw />
                </div>
            </Panel>

            <Panel
                title="Statistik Pesan"
                open={open === "stats"}
                onClick={() => toggle("stats")}
            >
                <div className="space-y-3">
                    <Field label="Total Pesan" value={stats.message_count} strong />
                    <Field label="Pesan Masuk" value={stats.message_in_count} />
                    <Field label="Pesan Keluar" value={stats.message_out_count} />
                </div>
            </Panel>

            <Panel
                title="Waktu"
                open={open === "time"}
                onClick={() => toggle("time")}
            >
                <div className="space-y-3">
                    <Field label="Terakhir Aktif" value={formatDate(chat.last_active_at)} />
                    <Field label="Dibuat" value={formatDate(chat.created_at)} />
                </div>
            </Panel>
        </div>
    );
}

function Panel({
                   title,
                   open,
                   onClick,
                   children,
               }: {
    title: string;
    open: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
                type="button"
                onClick={onClick}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                aria-expanded={open}
            >
                <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
                <ChevronDown
                    className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                />
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
}

function Field({
                   label,
                   value,
                   mono,
                   strong,
                   raw = false,
               }: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
    strong?: boolean;
    raw?: boolean;
}) {
    return (
        <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd
                className={[
                    "mt-1 text-sm",
                    raw ? "" : "text-gray-900 dark:text-white",
                    mono ? "font-mono" : "",
                    strong ? "font-semibold" : "",
                ].join(" ")}
            >
                {value}
            </dd>
        </div>
    );
}
