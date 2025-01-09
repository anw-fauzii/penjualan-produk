import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import ModalDetail from '@/Components/modal/ModalDetail';
import ModalFilterATK from '@/Components/modal/ModalFilterATK';
import { Head, Link, router } from '@inertiajs/react';
import { Badge, Button, TextInput } from 'flowbite-react';
import { useEffect } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { NumericFormat } from 'react-number-format';

export default function Penjualan(props) {
    const [showPrintButton, setShowPrintButton] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [modalData, setModalData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    console.log(props.pesanan)
    const [filteredData, setFilteredData] = useState(() => {
        
        const pesananData = props.pesanan ? Object.entries(props.pesanan) : [];
    
        return pesananData.map(([key, item], index) => ({
            no: index + 1,  // Menambahkan nomor urut
            barang_ukuran_id: item.barang_ukuran_id,
            ukuran:item.ukuran,
            harga:item.harga,
            subtotal:item.subtotal,
            nama_barang: item.nama_barang,
            kuantitas: item.kuantitas,
        }));
    });
    

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
    
        // Mengonversi objek menjadi array menggunakan Object.values
        const pesananArray = Object.values(props.pesanan || {});
    
        const filtered = pesananArray.map((item, index) => ({
            no: index + 1,
            barang_ukuran_id: item.barang_ukuran_id,
            ukuran:item.ukuran,
            harga:item.harga,
            subtotal:item.subtotal,
            nama_barang: item.nama_barang,
            kuantitas: item.kuantitas,
        })).filter(item =>
            item.barang_ukuran_id.toLowerCase().includes(searchValue) ||
            item.nama_barang.toLowerCase().includes(searchValue)
        );
    
        setFilteredData(filtered);
    };
    
    

    const columns = [
        {
            name: 'No',
            selector: row => row.no,
            sortable: true,
            width: '7%',
        },
        {
            name: 'Kode',
            selector: row => row.barang_ukuran_id,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Nama Barang',
            selector: row => row.nama_barang + ' ('+ row.ukuran + ')',
            sortable: true,
            width: '30%',
        },
        {
            name: 'Terjual',
            selector: row => row.kuantitas,
            sortable: true,
            width: '8%',
        },
        {
            name: 'Harga Satuan',
            selector: row => (
                <NumericFormat
                    value={row.harga}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            sortable: true,
            width: '15%',
        },
        {
            name: 'Total Harga',
            selector: row => (
                <NumericFormat
                    value={row.subtotal}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            sortable: true,
            width: '25%',
        },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const getQueryParams = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const mulai = queryParams.get('mulai');
        const akhir = queryParams.get('akhir');
        return { mulai, akhir };
    };

    // Fungsi untuk mengunduh PDF
    const downloadPdf = () => {
        const { mulai, akhir } = getQueryParams();  // Ambil query params menggunakan fungsi utilitas
        if (mulai && akhir) {
            const url = `/laporan-pdf?mulai=${encodeURIComponent(mulai)}&akhir=${encodeURIComponent(akhir)}`;
            window.open(url, '_blank');
        } else {
            console.error('Mulai dan Akhir tanggal tidak ditemukan');
        }
    };

    // Memeriksa query parameters di useEffect
    useEffect(() => {
        const { mulai, akhir } = getQueryParams();

        if (mulai && akhir) {
            setShowPrintButton(true);
        } else {
            setShowPrintButton(false);
        }
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} roleUser={props.roleUser} />

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
                            <div className='flex'>
                                <button onClick={() => setOpenFilterModal(true)} type="button" className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    <svg className="w-5 h-5 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z" />
                                    </svg>
                                    <span className='flex'>Filter Data </span>
                                </button>
                                {showPrintButton && (
                                    <button onClick={downloadPdf} type="button" className="flex text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                        <svg class="w-5 h-5 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
                                        </svg>
                                        <span className='flex'>Download </span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center w-full md:w-auto">
                                <TextInput
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Cari Pesanan..."
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
                <ModalDetail openModal={openModal} setOpenModal={setOpenModal} modalData={modalData} />
                <ModalFilterATK openFilterModal={openFilterModal} setOpenFilterModal={setOpenFilterModal} hariIni={props.hariIni} />
            </div>
            <CustomFooter />
        </div>
    );
}
