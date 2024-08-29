import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { HiMenu } from 'react-icons/hi';

const CustomNavbar = ({ toggleSidebar }) => (
    <Navbar fluid rounded className="fixed top-0 left-0 right-0 shadow-lg bg-blue-900 text-white z-50">
        <div className="flex items-center w-full">
            {/* Toggle Button for Mobile */}
            <Navbar.Toggle onClick={toggleSidebar} className="md:hidden text-white" />

            {/* Brand Logo */}
            <Navbar.Brand href="https://flowbite-react.com" className="flex items-center">
                <img src="/storage/logo.png" className="mr-3 h-6 sm:h-9" alt="Logo Yayasan" />
                <span className="shadow-lg self-center whitespace-nowrap text-xl font-semibold">Yayasan Prima Insani</span>
            </Navbar.Brand>

            <div className="flex-1"></div>

            {/* User Dropdown Menu */}
            <div className="flex items-center space-x-4 md:space-x-6">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    </Navbar>
);

export default CustomNavbar;
