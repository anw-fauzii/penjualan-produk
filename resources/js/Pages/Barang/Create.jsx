import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import SubJudulHeader from '@/Components/layouts/SubJudulHeader';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';
import toastr from 'toastr';

export default function Create(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const { data, setData, post, errors, processing } = useForm({
        nama_barang: '',
        kategori_id: '',
        supplier_id: '',
        unit: '',
        foto: '',
    })

    const handleKategoriChange = (selectedOption) => {
        setSelectedKategori(selectedOption);
        setData('kategori_id', selectedOption ? selectedOption.id : '');
    };

    const handleSupplierChange = (selectedOption) => {
        setSelectedSupplier(selectedOption);
        setData('supplier_id', selectedOption ? selectedOption.id : '');
    };

    const submit = (e) => {
        e.preventDefault()
        post('/barang', {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Data Berhasil diinput', 'Sukses!')
                setData({
                    nama_barang: '',
                    kategori_id: {
                        selected: ''
                    },
                    supplier_id: {
                        selected: ''
                    },
                    unit: {
                        selected: ''
                    },
                    foto: '',
                })
            },
            onError: () => {
                toastr.error('Silahkan Periksa Kembali Inputan Anda', 'Error!')
            }
        }, data)
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto mb-16">
                    <SubJudulHeader
                        judul={props.title}
                        subJudul="Barang"
                        linkSubJudul="/barang"
                        subSubJudul="Create"
                    />
                    <div className="bg-white shadow-lg rounded-lg p-2 md:p-6 border border-gray-200 mb-16">
                        <div className="overflow-x-auto p-2">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="nama_barang" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Produk</label>
                                    <input type="text" onChange={(e) => setData('nama_barang', e.target.value)} id="nama_barang" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.nama_barang} />
                                    {errors.nama_barang && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.nama_barang}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilih Unit Seragam</label>
                                    <select id="unit" onChange={(e) => setData('unit', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={""} selected disabled>-- Silahkan Pilih Unit --</option>
                                        <option value={"PG"}>Play Group (PG)</option>
                                        <option value={"TK"}>Taman Kanak-Kanak (TK)</option>
                                        <option value={"SD"}>Sekolah Dasar (SD)</option>
                                    </select>
                                    {errors.unit && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.unit}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="kategori_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori</label>
                                    <Select
                                        options={props.kategori}
                                        getOptionLabel={(option) => `${option.id} - ${option.nama_kategori}`}
                                        getOptionValue={(option) => option.id}
                                        value={selectedKategori}
                                        onChange={handleKategoriChange}
                                    />
                                    {errors.kategori_id && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.kategori_id}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="supplier_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier</label>
                                    <Select
                                        options={props.supplier}
                                        getOptionLabel={(option) => `${option.id} - ${option.nama_supplier}`}
                                        getOptionValue={(option) => option.id}
                                        value={selectedSupplier}
                                        onChange={handleSupplierChange}
                                    />
                                    {errors.supplier_id && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.supplier_id}</p>}
                                </div>
                                <div className='mb-4'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="user_avatar">Upload Foto</label>
                                    <input type="file" onChange={(e) => setData('foto', e.target.files[0])} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" />
                                </div>
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <CustomFooter />
        </div>
    );
}
