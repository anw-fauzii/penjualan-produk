import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import { useState } from 'react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex max-h-screen bg-gray-100 overflow-hidden">
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 flex-col">
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <JudulHeader judul="Anwar" subJudul="Fauzi" />
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">

                        <p className="mt-4 text-gray-700">
                            {/* You can add more content here inside the box */}
                            Welcome to the dashboard. This box provides a nice container for your content.
                        </p>
                    </div>
                </main>
            </div>

            <CustomFooter />
        </div>
    );
}
