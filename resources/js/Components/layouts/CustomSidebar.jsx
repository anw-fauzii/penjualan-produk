import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi';
import { Link, usePage } from '@inertiajs/react';

const CustomSidebar = ({ sidebarOpen, toggleSidebar }) => {
    const { url } = usePage();
    const [isCollapseOpen, setIsCollapseOpen] = useState(false);

    useEffect(() => {
        if (url.includes('/supplier') || url.includes('/kategori') || url.includes('/barang')) {
            setIsCollapseOpen(true);
        } else {
            setIsCollapseOpen(false);
        }
    }, [url]);

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
                        open={isCollapseOpen}
                        className={`hover:bg-blue-100 ${url.includes('/supplier') || url.includes('/kategori') || url.includes('/barang') ? 'bg-blue-200' : ''}`}
                    >
                        <Sidebar.Item
                            as={Link}
                            href="/barang"
                            className={url === '/barang' ? 'bg-blue-200' : ''}
                        >
                            Barang
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/supplier"
                            className={url === '/supplier' ? 'bg-blue-200' : ''}
                        >
                            Supplier
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            href="/kategori"
                            className={url === '/kategori' ? 'bg-blue-200' : ''}
                        >
                            Kategori
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Item
                        as={Link}
                        href="/inbox"
                        icon={HiInbox}
                        className={`hover:bg-blue-100 ${url === '/inbox' ? 'bg-blue-200' : ''}`}
                    >
                        Inbox
                    </Sidebar.Item>
                    <Sidebar.Item
                        as={Link}
                        href="/users"
                        icon={HiUser}
                        className={`hover:bg-blue-100 ${url === '/users' ? 'bg-blue-200' : ''}`}
                    >
                        Users
                    </Sidebar.Item>
                    <Sidebar.Item
                        as={Link}
                        href="/signin"
                        icon={HiArrowSmRight}
                        className={`hover:bg-blue-100 ${url === '/signin' ? 'bg-blue-200' : ''}`}
                    >
                        Sign In
                    </Sidebar.Item>
                    <Sidebar.Item
                        as={Link}
                        href="/signup"
                        icon={HiTable}
                        className={`hover:bg-blue-100 ${url === '/signup' ? 'bg-blue-200' : ''}`}
                    >
                        Sign Up
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default CustomSidebar;
