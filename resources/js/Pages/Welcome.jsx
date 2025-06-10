import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="font-sans antialiased dark:bg-black dark:text-white/50">
                <div className="h-screen bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                    <img
                        id="background"
                        className="absolute h-full w-full object-cover"
                        src="https://app.clttoolbox.com.au/images/login-bg.jpg"
                        alt="Laravel background"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/40 animate-blur-in"></div>
                    <div className="relative h-full flex flex-col">
                        <header className="py-4 px-10">
                            <nav className="flex justify-end animate-fade-in">
                                {auth?.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-md px-3 py-2 ring-1 ring-transparent transition hover:text-gray-100 focus:outline-none focus-visible:ring-[#FF2D20] text-gray-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : null}
                            </nav>
                        </header>

                        <div className="flex-1 flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                            <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                                <div className="grid grid-cols-2 items-center gap-4 py-10 lg:grid-cols-3">
                                    <div className="flex lg:justify-center lg:col-start-2">
                                        <img
                                            src="https://app.clttoolbox.com.au/images/logos/logo_color_white.png"
                                            alt="Logo"
                                            className="animate-fade-in"
                                        />
                                    </div>
                                </div>

                                {!auth?.user && (
                                    <div className="flex flex-col items-center gap-2 mt-6 animate-fade-in">
                                        <Link
                                            href="/login"
                                            className="text-xl rounded-md py-2 text-gray-200 ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-xl rounded-md py-2 text-gray-200 ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}

                                <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                                    Laravel + Inertia + React App
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
