import {Link} from "react-router";
import {Plus} from "lucide-react";

export default function EmptyDevicesState() {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Belum ada perangkat
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Mulai dengan menambahkan perangkat WhatsApp pertama Anda.
            </p>
            <Link
                to="/app/devices/create"
                className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
            >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Perangkat
            </Link>
        </div>
    );
}
