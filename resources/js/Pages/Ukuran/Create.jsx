import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import SubJudulHeader from '@/Components/layouts/SubJudulHeader';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import toastr from 'toastr';

export default function Create(props) {
    console.log(props)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const { data, setData, post, errors, processing } = useForm({
        barang_id: props.id,
        ukuran: '',
        harga_dasar: '',
        harga_jual: '',
        diskon: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post('/ukuran-barang', {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Data Berhasil diinput', 'Sukses!')
                setData({
                    barang_id: '',
                    harga_dasar: '',
                    harga_jual: '',
                    diskon: '',
                    ukuran: '',
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
                        subJudul="Kategori"
                        linkSubJudul="/kategori"
                        subSubJudul="Create"
                    />
                    <div className="bg-white shadow-lg rounded-lg p-2 md:p-6 border border-gray-200 mb-16">
                        <div className="overflow-x-auto p-2">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="barang_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Produk</label>
                                    <input type="text" readOnly onChange={(e) => setData('barang_id', e.target.value)} id="barang_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.barang_id} />
                                    {errors.barang_id && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.barang_id}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="ukuran" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ukuran</label>
                                    <input type="text" onChange={(e) => setData('ukuran', e.target.value)} id="ukuran" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    {errors.ukuran && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.ukuran}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="harga_dasar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Harga Dasar</label>
                                    <NumericFormat
                                        id="harga_dasar"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data.harga_dasar}
                                        onValueChange={(values) => setData('harga_dasar', values.value)}
                                        thousandSeparator={true}
                                        prefix={''}
                                    />
                                    {errors.harga_dasar && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.harga_dasar}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="harga_jual" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Harga Jual</label>
                                    <NumericFormat
                                        id="harga_jual"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data.harga_jual}
                                        onValueChange={(values) => setData('harga_jual', values.value)}
                                        thousandSeparator={true}
                                        prefix={''}
                                    />
                                    {errors.harga_jual && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.harga_jual}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="diskon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Diskon</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                            %
                                        </span>
                                        <input type="number" maxLength="2" onChange={(e) => setData('diskon', e.target.value)} id="diskon" className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    {errors.diskon && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.diskon}</p>}
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
