import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import { Head, Link, router } from '@inertiajs/react';
import { TextInput } from 'flowbite-react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { NumericFormat } from 'react-number-format';

export default function LabaRugi(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState((props.barang || []).map((item, index) => ({
        no: index + 1, // Menambahkan nomor urut
        ...item, // Menyalin sisa data
    })));

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = (props.barang || []).map((item, index) => ({
            no: index + 1,
            ...item,
        })).filter(item =>
            item.barang.nama_barang.toLowerCase().includes(searchValue) ||
            item.id.toLowerCase().includes(searchValue)
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            name: 'No',
            selector: row => row.no,
            sortable: true,
            width: '8%',
        },
        {
            name: 'Kode',
            selector: row => row.id,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Nama barang',
            selector: row => row.barang.nama_barang + " (" + row.ukuran + ")",
            sortable: true,
            width: '17%',
        },
        {
            name: 'Stok Tersedia',
            selector: row => row.stok,
            sortable: true,
            width: '10%',
        },
        {
            name: 'Penjualan',
            selector: row => (row.harga_jual * row.stok),
            format: row => (
                <NumericFormat
                    value={row.harga_jual * row.stok}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            sortable: true,
            width: '15%'
        },
        {
            name: 'HPP',
            selector: row => (row.harga_dasar * row.stok),
            format: row => (
                <NumericFormat
                    value={row.harga_dasar * row.stok}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            sortable: true,
            width: '15%'
        },
        {
            name: 'Laba Rugi',
            selector: row => (row.harga_jual * row.stok) - (row.harga_dasar * row.stok),
            format: row => (
                <NumericFormat
                    value={(row.harga_jual * row.stok) - (row.harga_dasar * row.stok)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            sortable: true,
            width: '15%'
        }

    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto mb-16">
                    <JudulHeader
                        judul={props.title}
                        subJudul="LabaRugi"
                        className="text-lg md:text-2xl mb-4" // Smaller text size on mobile
                    />
                    <div className="grid lg:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Penjualan</h2>
                                <p className="text-xl font-bold text-red-700">
                                    <NumericFormat
                                        value={props.total_penjualan}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'Rp. '}
                                    />
                                </p>
                            </div>
                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667" />
                            </svg>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Hasil Pokok Penjualan</h2>
                                <p className="text-xl font-bold text-red-700">
                                    <NumericFormat
                                        value={props.total_hpp}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'Rp. '}
                                    />
                                </p>
                            </div>
                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5" />
                            </svg>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Laba - Rugi</h2>
                                <p className="text-xl font-bold text-red-700">
                                    <NumericFormat
                                        value={props.total_penjualan - props.total_hpp}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'Rp. '}
                                    />
                                </p>
                            </div>

                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200 relative">
                        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex items-center w-full md:w-auto">
                                <TextInput
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Cari Barang..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    pagination
                                    fixedHeader
                                    fixedHeaderScrollHeight="500px"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <CustomFooter />
        </div>
    );
}
