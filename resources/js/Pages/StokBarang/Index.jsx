import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import ModalStok from '@/Components/modal/ModalStok';
import { Head, Link, router } from '@inertiajs/react';
import { TextInput } from 'flowbite-react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
import toastr from 'toastr';

export default function Index(props) {
    console.log(props)
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState((props.barang || []).map((item, index) => ({
        no: index + 1,
        ...item,
    })));

    const handleInfoClick = (id) => {
        const selectedData = props.barang.find(item => item.id === id);

        if (selectedData) {
            setModalData(selectedData);
            setOpenModal(true);
        }
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = (props.barang || []).map((item, index) => ({
            no: index + 1,
            ...item,
        })).filter(item =>
            item.id.toLowerCase().includes(searchValue) ||
            item.nama_barang.toLowerCase().includes(searchValue)
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
            name: 'Nama Barang',
            selector: row => row.barang_ukuran.barang.nama_barang + " (" + row.barang_ukuran.ukuran + ")",
            sortable: true,
            width: '25%'
        },
        {
            name: 'Stok',
            selector: row => row.stok,
            sortable: true,
            width: '15%'
        },
        {
            name: 'Tanggal',
            selector: row => new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(new Date(row.created_at)),
            sortable: true,
            width: '22%'
        }

    ];

    const ExpandedComponent = ({ data }) => (
        <div className="p-4">
            <div className="flex justify-start">
                <button onClick={() => handleDelete(data.id)} type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-3 py-2.5 text-center m-1">
                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Ketika dihapus tidak dapat kembali',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/barang/${id}`, {
                    onSuccess: () => {
                        toastr.success('Data Berhasil Dihapus', 'Sukses!');
                        router.get(route('barang.index'));
                    },
                    onError: () => {
                        toastr.error('Terjadi kesalahan', 'Gagal!');
                    },
                });
            }
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto mb-16">
                    <JudulHeader
                        judul={props.title}
                        subJudul="Stok"
                        className="text-lg md:text-2xl mb-4"
                    />
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
                                    expandableRows
                                    expandableRowsComponent={ExpandedComponent}
                                />
                            </div>
                        </div>
                    </div>
                </main>
                <ModalStok openModal={openModal} setOpenModal={setOpenModal} modalData={modalData} />
            </div>
            <CustomFooter />
        </div>
    );
}
