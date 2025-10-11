import {Outlet} from "react-router";
import {Heart} from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-900">
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left Grid - Children */}
                <div className="flex items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </div>

                {/* Right Grid - Ornament */}
                <div className="hidden lg:flex items-center justify-center bg-brand-950 dark:bg-white/5 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            {/* Grid Pattern */}
                            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" className="text-white"/>
                            </svg>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {/* Main WhatsApp Icon */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-500/30">
                                <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                                </svg>
                            </div>

                            {/* Floating Dots */}
                            <div className="absolute -top-4 -right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-2 h-2 bg-green-300 rounded-full animate-pulse delay-300"></div>
                            <div className="absolute top-8 -left-8 w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse delay-700"></div>
                        </div>

                        {/* API Text Elements */}
                        <div className="absolute top-1/4 left-8 text-white/30 font-mono text-sm transform -rotate-12">
                            <div className="mb-2">{"{ SAHABAT }"}</div>
                            <div className="text-xs">IBU</div>
                        </div>

                        <div className="absolute bottom-1/4 right-8 text-white/30 font-mono text-sm transform rotate-12">
                            <div className="mb-1 ml-1"><Heart /></div>
                            <div className="text-xs">HAMIL</div>
                        </div>

                        {/* Message Bubbles */}
                        <div className="absolute top-1/3 right-12 bg-green-500/20 backdrop-blur-sm rounded-2xl p-3 border border-green-500/30 transform rotate-3">
                            <div className="w-16 h-2 bg-green-400/50 rounded mb-1"></div>
                            <div className="w-12 h-2 bg-green-400/30 rounded"></div>
                        </div>

                        <div className="absolute bottom-1/3 left-12 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 transform -rotate-3">
                            <div className="w-14 h-2 bg-white/50 rounded mb-1"></div>
                            <div className="w-10 h-2 bg-white/30 rounded"></div>
                        </div>

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                            <path
                                d="M100,100 Q200,50 300,150"
                                stroke="rgba(34, 197, 94, 0.2)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                                className="animate-pulse"
                            />
                            <path
                                d="M80,300 Q200,350 320,250"
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="3,3"
                                className="animate-pulse delay-500"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
