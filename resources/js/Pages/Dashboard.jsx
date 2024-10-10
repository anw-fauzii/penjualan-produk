import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import { Head } from '@inertiajs/react';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

export default function Dashboard(props) {
    const { hargaDasar, hargaJual, laba } = props;

    const categories = hargaJual.map(item => item.day_name);
    const dataJual = hargaJual.map(item => parseFloat(item.total_sales));
    const dataDasar = hargaDasar.map(item => parseFloat(item.total_sales));
    const dataLaba = laba.map(item => parseFloat(item.total_sales));

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Penjualan Harian'
        },
        xAxis: {
            categories: categories,
            title: {
                text: 'Hari'
            }
        },
        yAxis: {
            title: {
                text: 'Jumlah Penjualan'
            }
        },
        series: [
            {
                name: 'Harga Jual',
                data: dataJual
            },
            {
                name: 'Harga Dasar',
                data: dataDasar
            },
            {
                name: 'Laba Lugi',
                data: dataLaba
            }
        ]
    };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex max-h-screen bg-gray-100 overflow-hidden">
            <Head title="Dashboard" />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} roleUser={props.roleUser} />
            <div className="flex flex-1 flex-col mb-11">
                <CustomNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <JudulHeader judul="Dashboard" subJudul="Dashboard" />
                    <div className="grid lg:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Supplier</h2>
                                <p className="text-xl font-bold text-red-700">
                                    {props.supplier}
                                </p>
                            </div>
                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5.535 7.677c.313-.98.687-2.023.926-2.677H17.46c.253.63.646 1.64.977 2.61.166.487.312.953.416 1.347.11.42.148.675.148.779 0 .18-.032.355-.09.515-.06.161-.144.3-.243.412-.1.111-.21.192-.324.245a.809.809 0 0 1-.686 0 1.004 1.004 0 0 1-.324-.245c-.1-.112-.183-.25-.242-.412a1.473 1.473 0 0 1-.091-.515 1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.401 1.401 0 0 1 13 9.736a1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.4 1.4 0 0 1 9 9.74v-.008a1 1 0 0 0-2 .003v.008a1.504 1.504 0 0 1-.18.712 1.22 1.22 0 0 1-.146.209l-.007.007a1.01 1.01 0 0 1-.325.248.82.82 0 0 1-.316.08.973.973 0 0 1-.563-.256 1.224 1.224 0 0 1-.102-.103A1.518 1.518 0 0 1 5 9.724v-.006a2.543 2.543 0 0 1 .029-.207c.024-.132.06-.296.11-.49.098-.385.237-.85.395-1.344ZM4 12.112a3.521 3.521 0 0 1-1-2.376c0-.349.098-.8.202-1.208.112-.441.264-.95.428-1.46.327-1.024.715-2.104.958-2.767A1.985 1.985 0 0 1 6.456 3h11.01c.803 0 1.539.481 1.844 1.243.258.641.67 1.697 1.019 2.72a22.3 22.3 0 0 1 .457 1.487c.114.433.214.903.214 1.286 0 .412-.072.821-.214 1.207A3.288 3.288 0 0 1 20 12.16V19a2 2 0 0 1-2 2h-6a1 1 0 0 1-1-1v-4H8v4a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-6.888ZM13 15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Jenis barang</h2>
                                <p className="text-xl font-bold text-red-700">
                                    {props.barang}
                                </p>
                            </div>
                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-5 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-red-800 mb-2">Semua Stok</h2>
                                <p className="text-xl font-bold text-red-700">
                                    {props.stok}
                                </p>
                            </div>
                            <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <h2 className=" text-xl text-gray-700 text-center mb-4">
                                <strong>Barang Dengan Stok Terkecil</strong>
                            </h2>
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>No</Table.HeadCell>
                                        <Table.HeadCell>Produk</Table.HeadCell>
                                        <Table.HeadCell>Unit</Table.HeadCell>
                                        <Table.HeadCell>Stok</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {props.stokKecil.map((data, i) => (
                                            <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell>{i + 1}</Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {data.barang.nama_barang} <strong>({data.ukuran})</strong>
                                                </Table.Cell>
                                                <Table.Cell>{data.barang.unit}</Table.Cell>
                                                <Table.Cell>{data.stok}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                            />
                        </div>

                    </div>
                </main>
            </div>

            <CustomFooter />
        </div>
    );
}
