import { Footer } from 'flowbite-react';

const CustomFooter = () => (
    <Footer container className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-4">
        <div className="w-full">
            <Footer.Copyright href="#" by="Yayasan Prima Insani" year={2024} className='text-white md:ml-64' />
        </div>
    </Footer>
);

export default CustomFooter;
