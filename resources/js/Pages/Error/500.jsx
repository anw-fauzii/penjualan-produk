import { Head } from "@inertiajs/react";

export default function limaRatus() {
    return (
        <>
            <Head title="500 - Kesalahan Server" />
            <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
                <div className="text-center max-w-screen-sm">
                    <h1 className="mb-4 text-8xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
                        500
                    </h1>
                    <p className="mb-4 text-2xl tracking-tight font-bold text-gray-900 dark:text-white md:text-4xl">
                        Kesalahan Server Internal.
                    </p>
                    <p className="mb-6 text-lg font-light text-gray-500 dark:text-gray-400">
                        Terjadi kesalahan di server kami. Mohon coba lagi nanti.
                    </p>
                </div>
            </section>
        </>
    );
}
