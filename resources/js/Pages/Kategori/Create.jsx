import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import SubJudulHeader from '@/Components/layouts/SubJudulHeader';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toastr from 'toastr';

export default function Create(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { data, setData, post, errors, processing } = useForm({
        nama_kategori: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post('/kategori', {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Data Berhasil diinput', 'Sukses!')
                setData({
                    nama_kategori: '',
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

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <SubJudulHeader
                        judul={props.title}
                        subJudul="Kategori"
                        linkSubJudul="/kategori"
                        subSubJudul="Create"
                    />
                    <div className="bg-white shadow-lg rounded-lg p-2 md:p-6 border border-gray-200">
                        <div className="overflow-x-auto p-2">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label for="nama_kategori" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Kategori</label>
                                    <input type="text" onChange={(e) => setData('nama_kategori', e.target.value)} id="nama_kategori" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.nama_kategori} />
                                    {errors.nama_kategori && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.nama_kategori}</p>}
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
