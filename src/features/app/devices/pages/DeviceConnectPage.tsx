import {Link, useFetcher, useParams} from "react-router";
import {useDeviceQuery} from "@/features/app/devices/queries/device.query";
import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {BackButton, Breadcrumb, EmptyContentState, ErrorLoadingState} from "@/components/ui";
import {useEffect, useMemo, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {DeviceStatus} from "@/features/app/devices/types/device.types";
import QRCode from 'qrcode';
import {RefreshCw} from "lucide-react";

const socketBaseUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;

export default function DeviceConnectPage() {
    const {deviceId} = useParams();

    const {data: device, isLoading, error} = useDeviceQuery(deviceId!);
    useDocumentTitle(device?.name ?? "Detail Perangkat");

    const requestFetcher = useFetcher<{ ok?: boolean; message?: string }>();
    const { submit } = requestFetcher;
    const stableOptions = useMemo(() => ({
        transports: ['websocket'],
    }), []);
    const socketRef = useRef<Socket | null>(null);

    const didInitRef = useRef(false);
    const didRequestConnectRef = useRef(false);

    const [whatsappConnectionStatus, setWhatsappConnectionStatus] = useState<'connecting' | 'requested' | 'scanning' | 'closed' | 'connected' | 'scan-success' | 'disconnected'>('connecting');
    const [whatsappConnectionMessage, setWhatsappConnectionMessage] = useState<string>('');
    const [userInfo, setUserInfo] = useState<{ id?: string, name?: string, phone?: string } | null>(null);

    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

    useEffect(() => {
        if (!device) return;

        if (device.status === DeviceStatus.Connected) {
            setTimeout(() => {
                setWhatsappConnectionStatus('connected');
            }, 2000)
        }

        if (didInitRef.current) return;
        didInitRef.current = true;

        const deviceCode = device.code;
        const socket = io(socketBaseUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected, joining device room:', deviceCode);

            socket.emit('join-device-room', { deviceCode });
        });

        socket.on('device-room-joined', () => {
            console.log('Joined device room, requesting connection for device:', deviceCode);

            if (!didRequestConnectRef.current && device.status !== DeviceStatus.Connected) {
                didRequestConnectRef.current = true;
                
                submit(null, {
                    method: 'post',
                    action: `/app/devices/${device.code}/connect/request`,
                });
            }
        });

        socket.on('connection-requested', (data) => {
            console.log('Connection requested:', data);

            setWhatsappConnectionStatus('requested');
            setWhatsappConnectionMessage(data.message);
        });

        socket.on('qr-updated', (data: { deviceCode: string; qr: string }) => {
            console.log('QR code updated:', data);

            QRCode.toDataURL(data.qr, { width: 256, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } })
                .then((url) => {
                    setQrCodeImage(url);
                    setWhatsappConnectionStatus('scanning');
                })
                .catch((err) => console.error('Error generating QR code:', err));
        });

        socket.on('device-connected', (data) => {
            console.log('Device connected:', data);

            setWhatsappConnectionStatus('connected');
            setWhatsappConnectionMessage(data.message);
            setUserInfo(data.user);
        });

        socket.on('device-disconnected', (data) => {
            console.log('Device disconnected:', data);

            setWhatsappConnectionStatus('disconnected');
            setWhatsappConnectionMessage(data.message);
        });

        socket.on('connection-status', (data) => {
            console.log('Connection status update:', data);

            if (data.status === 'time-out' || data.status === 'connection-lost') {
                setWhatsappConnectionStatus('closed');
                setWhatsappConnectionMessage(data.message);
            } else if (data.status === 'scan-success') {
                setWhatsappConnectionStatus('scan-success');
                setWhatsappConnectionMessage(data.message);
            }
        });

        return () => {
            didInitRef.current = false;
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [
        device?.code,
        device?.status,
        submit,
        stableOptions,
    ]);

    const handleReconnectRequest = () => {
        if (device) {
            submit(null, {
                method: 'post',
                action: `/app/devices/${device.code}/connect/request`,
            });
        }
    }

    if (isLoading) return <EmptyContentState/>;
    if (!device || error) return <ErrorLoadingState/>;

    if (!device) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Device WhatsApp tidak ditemukan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Kesalahan terjadi saat mencoba menghubungkan perangkat WhatsApp Anda. Silakan kembali ke halaman perangkat dan coba lagi.
                    </p>
                    <Link
                        to="/app/devices"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Kembali ke WhatsApp Devices
                    </Link>
                </div>
            </div>
        );
    }

    return (
       <>
           <div className="p-6">
               {/* Start Header */}
               <div className="mb-6">
                   <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                           <Breadcrumb
                               items={[
                                   { label: "App", href: "/app/dashboard" },
                                   { label: "Devices", href: "/app/devices" },
                                   { label: device.name, href: `/app/devices/${device.id}` },
                                   { label: "Hubungkan" },
                               ]}
                           />
                       </div>
                       <BackButton to={`/app/devices/${device.id}`} />
                   </div>
                   <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                       Hubungkan Device WhatsApp
                   </h1>
                   <p className="text-gray-600 dark:text-gray-400 mt-1">
                       Scan QR Code untuk menghubungkan perangkat WhatsApp
                   </p>
               </div>
           </div>

           <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
               <div className="p-6">

                   {error}

                   {error && ErrorState(error)}
                   {!error && (
                       <>
                           {whatsappConnectionStatus === 'connecting' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Menghubungkan ke server...
                                       </h3>
                                       <p className="text-gray-600 dark:text-gray-400">
                                           Mohon tunggu sebentar
                                       </p>
                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'requested' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Menunggu QR Code...
                                       </h3>
                                       <p className="text-gray-600 dark:text-gray-400">
                                           {whatsappConnectionMessage}
                                       </p>
                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'scanning' && qrCodeImage && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="bg-white rounded-lg shadow-lg mx-auto inline-block">
                                           <img
                                               src={qrCodeImage}
                                               alt="QR Code for device connection"
                                               className="mx-auto"
                                           />
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Scan QR Code dengan WhatsApp
                                       </h3>
                                       <div className="text-gray-600 dark:text-gray-400 space-y-2">
                                           <p>1. Buka WhatsApp di ponsel Anda</p>
                                           <p>2. Ketuk Menu atau Settings dan pilih WhatsApp Web</p>
                                           <p>3. Arahkan ponsel ke layar untuk memindai kode</p>
                                       </div>
                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'closed' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                           <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                           </svg>
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Koneksi Gagal
                                       </h3>
                                       <p className="text-gray-600 dark:text-gray-400">
                                           {whatsappConnectionMessage}
                                       </p>

                                       <button
                                           type="button"
                                           onClick={handleReconnectRequest}
                                           disabled={isLoading}
                                           className={[
                                               "inline-flex items-center px-4 py-2 rounded-lg transition-colors",
                                               "text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20",
                                               "hover:bg-pink-100 dark:hover:bg-pink-900/30",
                                               "disabled:opacity-50 disabled:cursor-not-allowed",
                                           ].join(" ")}
                                           aria-label="Coba lagi menghubungkan WhatsApp"
                                       >
                                          <RefreshCw className="size-5 mr-2" />

                                           {isLoading ? "Memulai koneksi baru..." : "Coba lagi"}
                                       </button>

                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'connected' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                           <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                           </svg>
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Device Berhasil Terhubung!
                                       </h3>
                                       <div className="text-gray-600 dark:text-gray-400 space-y-2">

                                           <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                               <p className="font-medium text-gray-900 dark:text-white mb-2">Informasi Akun:</p>

                                               {/* Display device name */}
                                               {device.name && (
                                                   <p className="text-gray-700 dark:text-gray-300">
                                                       <span className="font-medium">Nama:</span> {device.name}
                                                   </p>
                                               )}

                                               {/* Display phone number - prioritize userInfo if device.phone_number is null */}
                                               {device.phone_number ? (
                                                   <p className="text-gray-700 dark:text-gray-300">
                                                       <span className="font-medium">Nomor:</span> {device.phone_number}
                                                   </p>
                                               ) : userInfo?.phone && (
                                                   <p className="text-gray-700 dark:text-gray-300">
                                                       <span className="font-medium">Nomor:</span> {userInfo.phone}
                                                   </p>
                                               )}

                                               {/* Display device ID - prioritize userInfo if device.device_id is null */}
                                               {device.device_id ? (
                                                   <p className="text-sm text-gray-500 dark:text-gray-400">
                                                       <span className="font-medium">ID:</span> {device.device_id}
                                                   </p>
                                               ) : userInfo?.id && (
                                                   <p className="text-sm text-gray-500 dark:text-gray-400">
                                                       <span className="font-medium">ID:</span> {userInfo.id}
                                                   </p>
                                               )}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'scan-success' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                                           <svg className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                           </svg>
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Menghubungkan...
                                       </h3>
                                       <p className="text-gray-600 dark:text-gray-400">
                                           {whatsappConnectionMessage}
                                       </p>
                                   </div>
                               </div>
                           )}

                           {whatsappConnectionStatus === 'disconnected' && (
                               <div className="text-center">
                                   <div className="space-y-4">
                                       <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                           <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                           </svg>
                                       </div>
                                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                           Device Terputus
                                       </h3>
                                       <p className="text-gray-600 dark:text-gray-400">
                                           {whatsappConnectionMessage}
                                       </p>
                                   </div>
                               </div>
                           )}
                       </>
                   )}

               </div>
           </div>
       </>
    )
}

function ErrorState(error: string) {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    )
}
