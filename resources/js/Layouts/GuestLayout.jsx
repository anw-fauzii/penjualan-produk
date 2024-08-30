import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div>
                <Link href="/">
                    <img src="/storage/logo-samping.png" className="max-w-xs" alt="" />
                </Link>
            </div>

            <div className="w-11/12 max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
                {children}
            </div>
        </div>

    );
}
