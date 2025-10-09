import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {Cpu, LogIn, MessageCircleQuestion, MessageSquare, ShieldCheck} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AdminLoginCta from "@/features/home/components/AdminLoginCta";
import FeatureCard from "@/features/home/components/FeatureCard";

export default function HomePage() {
    useDocumentTitle('Sahabat Ibu Hamil Admin Portal');

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                            Sahabat Ibu Hamil
                        </h1>
                        <div className="w-24 md:w-46 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="flex justify-center">
                        <AdminLoginCta />
                    </div>

                    {/* Features Preview */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Device Management"
                            description="Kelola device bot WhatsApp yang terhubung"
                            icon={Cpu}
                            color="indigo"
                        />
                        <FeatureCard
                            title="Chat Management"
                            description="Pantau chat user dengan bot WhatsApp"
                            icon={MessageSquare}
                            color="blue"
                        />
                        <FeatureCard
                            title="Konsultasi Management"
                            description="Jawab konsultasi dari user yang menggunakan bot"
                            icon={MessageCircleQuestion}
                            color="green"
                        />
                    </div>
                </div>
            </div>

            <ThemeSwitcher />
        </>
    );
}