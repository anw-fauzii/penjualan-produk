import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiBackspace, HiDocumentReport, HiChartPie, HiInbox, HiShoppingBag, HiLogout, HiShoppingCart } from 'react-icons/hi';
import { Link, router, usePage } from '@inertiajs/react';

const CustomSidebar = ({ sidebarOpen, toggleSidebar }) => {
    const { url } = usePage();
    const [isCollapseMasterOpen, setIsCollapseMasterOpen] = useState(false);
    const [isCollapsePesananOpen, setIsCollapsePesananOpen] = useState(false);
    const [isCollapseLaporanOpen, setIsCollapseLaporanOpen] = useState(false);
    const [isCollapseReturOpen, setIsCollapseReturOpen] = useState(false);
    useEffect(() => {
        setIsCollapseMasterOpen(url.includes('/supplier') || url.includes('/kategori') || url.includes('/barang'));
        setIsCollapseLaporanOpen(url.includes('/laporan-penjualan') || url.includes('/laporan-laba-rugi'));
        setIsCollapsePesananOpen(url.includes('/pemesanan'));
        setIsCollapseReturOpen(url.includes('/retur'));
    }, [url]);

    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => {
                window.history.replaceState(null, null, '/login');
                window.location.reload();
            },
        });
    };
    return (
        <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white shadow-md transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 md:h-screen top-16 md:overflow-y-auto z-50`}
        >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        as={Link}
                        href="/dashboard"
                        icon={HiChartPie}
                        className={`hover:bg-blue-100 ${url === '/dashboard' ? 'bg-blue-200' : ''}`}
                    >
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Collapse
                        icon={HiShoppingBag}
                        label="Data Master"
                        open={isCollapseMasterOpen}
                        className={`hover:bg-blue-100 ${url.includes('/supplier') || url.includes('/kategori') || url.includes('/barang') ? 'bg-blue-200' : ''}`}
                    >
                        <Sidebar.Item
                            as={Link}
                            href="/barang"
                            className={url.includes('/barang') ? 'bg-blue-200' : ''}
                        >
                            Barang
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/supplier"
                            className={url.includes('/supplier') ? 'bg-blue-200' : ''}
                        >
                            Supplier
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/kategori"
                            className={url.includes('/kategori') ? 'bg-blue-200' : ''}
                        >
                            Kategori
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Item
                        as={Link}
                        href="/stok-barang"
                        icon={HiInbox}
                        className={`hover:bg-blue-100 ${url === '/stok-barang' ? 'bg-blue-200' : ''}`}
                    >
                        Stok Barang
                    </Sidebar.Item>
                    <Sidebar.Collapse
                        icon={HiShoppingCart}
                        label="Pesanan"
                        open={isCollapsePesananOpen}
                        className={`hover:bg-blue-100 ${url.includes('/pemesanan/create') || url.includes('/pemesanan') ? 'bg-blue-200' : ''}`}
                    >
                        <Sidebar.Item
                            as={Link}
                            href="/pemesanan/create"
                            className={url === '/pemesanan/create' ? 'bg-blue-200' : ''}
                        >
                            Buat Pesanan
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/pemesanan"
                            className={url === '/pemesanan' ? 'bg-blue-200' : ''}
                        >
                            List Pesanan
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Collapse
                        icon={HiBackspace}
                        label="Retur Barang"
                        open={isCollapseReturOpen}
                        className={`hover:bg-blue-100 ${url.includes('/retur/create') || url.includes('/retur') ? 'bg-blue-200' : ''}`}
                    >
                        <Sidebar.Item
                            as={Link}
                            href="/retur/create"
                            className={url === '/retur/create' ? 'bg-blue-200' : ''}
                        >
                            Tambah
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/retur"
                            className={url === '/retur' ? 'bg-blue-200' : ''}
                        >
                            List Retur
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Collapse
                        icon={HiDocumentReport}
                        label="Laporan"
                        open={isCollapseLaporanOpen}
                        className={`hover:bg-blue-100 ${url.includes('laporan-laba-rugi') || url.includes('laporan-penjualan') ? 'bg-blue-200' : ''}`}
                    >
                        <Sidebar.Item
                            as={Link}
                            href="/laporan-laba-rugi"
                            className={url === '/laporan-laba-rugi' ? 'bg-blue-200' : ''}
                        >
                            Laba Rugi
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/laporan-penjualan"
                            className={url.includes('laporan-penjualan') ? 'bg-blue-200' : ''}
                        >
                            Penjualan
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Item
                        onClick={handleLogout}
                        icon={HiLogout}
                        className={`hover:bg-blue-100 ${url === '/signin' ? 'bg-blue-200' : ''}`}
                    >
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default CustomSidebar;