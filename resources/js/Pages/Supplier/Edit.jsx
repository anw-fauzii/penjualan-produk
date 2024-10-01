import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import SubJudulHeader from '@/Components/layouts/SubJudulHeader';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toastr from 'toastr';

export default function Edit(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { data, setData, post, errors, processing } = useForm({
        nama_supplier: props.supplier.nama_supplier || '',
        penanggung_jawab: props.supplier.penanggung_jawab || '',
        alamat: props.supplier.alamat || '',
        telepon: props.supplier.telepon || '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(`/edit-supplier/${props.supplier.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Data Berhasil diinput', 'Sukses!')
                setData({
                    nama_supplier: '',
                    penanggung_jawab: '',
                    alamat: '',
                    telepon: ''
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
                        subJudul="Supplier"
                        linkSubJudul="/supplier"
                        subSubJudul="Edit"
                    />
                    <div className="bg-white shadow-lg rounded-lg p-2 md:p-6 border border-gray-200">
                        <div className="overflow-x-auto p-2">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label for="nama_supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Supplier</label>
                                    <input type="text" onChange={(e) => setData('nama_supplier', e.target.value)} id="nama_supplier" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.nama_supplier} />
                                    {errors.nama_supplier && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.nama_supplier}</p>}
                                </div>
                                <div className="mb-4">
                                    <label for="penanggung_jawab" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Penanggung Jawab</label>
                                    <input type="text" onChange={(e) => setData('penanggung_jawab', e.target.value)} id="penanggung_jawab" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.penanggung_jawab} />
                                    {errors.penanggung_jawab && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.penanggung_jawab}</p>}
                                </div>
                                <div className="mb-4">
                                    <label for="alamat" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat</label>
                                    <input type="text" onChange={(e) => setData('alamat', e.target.value)} id="alamat" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.alamat} />
                                    {errors.alamat && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.alamat}</p>}
                                </div>
                                <div className="mb-4">
                                    <label for="telepon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telepon</label>
                                    <input type="text" onChange={(e) => setData('telepon', e.target.value)} id="telepon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.telepon} />
                                    {errors.telepon && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.telepon}</p>}
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
