import { Head } from "@inertiajs/react";

export default function limaTigaTiga() {
    return (
        <>
            <Head title="503 - Layanan Tidak Tersedia" />
            <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
                <div className="text-center max-w-screen-sm">
                    <h1 className="mb-4 text-8xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
                        503
                    </h1>
                    <p className="mb-4 text-2xl tracking-tight font-bold text-gray-900 dark:text-white md:text-4xl">
                        Layanan Tidak Tersedia.
                    </p>
                    <p className="mb-6 text-lg font-light text-gray-500 dark:text-gray-400">
                        Saat ini server sedang sibuk atau sedang dalam perbaikan.
                    </p>
                    <a href="/" className="relative inline-block text-sm font-medium text-white bg-blue-600 rounded-lg px-5 py-3 transition-transform duration-200 hover:scale-105 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
                        Kembali ke Beranda
                    </a>
                    <div className="mt-8">
                        <p className="text-gray-500 dark:text-gray-400">Jika masalah ini terus terjadi, <a href="/help" className="text-blue-600 underline hover:text-blue-800">hubungi tim dukungan kami</a>.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
