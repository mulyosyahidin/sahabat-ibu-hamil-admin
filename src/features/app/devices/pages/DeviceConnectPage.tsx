import {Link, useFetcher, useParams} from "react-router";
import {useDeviceQuery} from "@/features/app/devices/queries/device.query";
import {useDocumentTitle} from "@/lib/useDocumentTitle";
import { ErrorLoadingState, EmptyContentState, Breadcrumb, BackButton } from "@/components/ui";
import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {DeviceStatus} from "@/features/app/devices/types/device.types";
import QRCode from 'qrcode';

const socketBaseUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;

export default function DeviceConnectPage() {
    const {deviceId} = useParams();

    const {data: device, isLoading, error} = useDeviceQuery(deviceId!);
    useDocumentTitle(device?.name ?? "Detail Perangkat");

    const requestFetcher = useFetcher<{ ok?: boolean; message?: string }>();
    const socketRef = useRef<Socket | null>(null);

    const [whatsappConnectionStatus, setWhatsappConnectionStatus] = useState<'connecting' | 'requested' | 'scanning' | 'closed' | 'connected' | 'scan-success' | 'disconnected'>('connecting');
    const [whatsappConnectionMessage, setWhatsappConnectionMessage] = useState<string>('');
    const [userInfo, setUserInfo] = useState<{ id?: string, name?: string, phone?: string } | null>(null);

    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

    useEffect(() => {
        if (!device) return;

        if (device.status == DeviceStatus.Connected) {
            setWhatsappConnectionStatus('connected');

            return;
        }

        console.log('Initializing socket connection to', socketBaseUrl);

        const deviceCode = device.code;

        try {
            const socket = io(socketBaseUrl, {
                transports: ["websocket"],
            });

            socketRef.current = socket;

            socketRef.current.on('connect', () => {
                console.log('Socket connected');

                socketRef.current?.emit('join-device-room', {
                    deviceCode
                });
            });

            socketRef.current.on('device-room-joined', async () => {
                console.log('Joined to room');

                if (device.status != DeviceStatus.Connected) {
                    requestFetcher.submit(null, {
                        method: "post",
                        action: `/app/devices/${device.code}/connect/request`,
                    });
                }
            });

            socketRef.current.on('connection-requested', (data: {
                deviceCode: string,
                status: string,
                message: string,
                timestamp: string
            }) => {
                console.log('Connection requested');

                setWhatsappConnectionStatus('requested');
                setWhatsappConnectionMessage(data.message);
            });

            socketRef.current.on('qr-updated', (data: { deviceCode: string, qr: string, timestamp: string }) => {
                console.log('QR Code received');

                QRCode.toDataURL(data.qr, {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                })
                    .then((url: string) => {
                        setQrCodeImage(url);
                        setWhatsappConnectionStatus('scanning');
                    })
                    .catch((err: Error) => {
                        console.error('Error generating QR code:', err);
                    });
            });

            socketRef.current.on('device-connected', (data: {
                deviceCode: string,
                message: string,
                timestamp: string,
                user: { id: string, name: string, phone: string }
            }) => {
                setWhatsappConnectionStatus('connected');
                setWhatsappConnectionMessage(data.message);
                setUserInfo(data.user);
            });

            socketRef.current.on('device-disconnected', (data: {
                deviceCode: string,
                message: string,
                reason: string,
                timestamp: string,
                user: { id: string, name: string, phone: string }
            }) => {
                setWhatsappConnectionStatus('disconnected');
                setWhatsappConnectionMessage(data.message);
            });

            socketRef.current.on('connection-status', (data: { deviceCode: string, status: string, message: string, timestamp: string }) => {
                console.log('connection-status', data);

                if (data.status === 'time-out' || data.status == 'connection-lost') {
                    setWhatsappConnectionStatus('closed');
                    setWhatsappConnectionMessage(data.message);

                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                }
                else if (data.status === 'scan-success') {
                    setWhatsappConnectionStatus('scan-success');
                    setWhatsappConnectionMessage(data.message);
                }
            });
        } catch (error) {
            console.error('Socket initialization error:', error);
        }
    }, [device, requestFetcher]);

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
                                           Sedang Menghubungkan...
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
