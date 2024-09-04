import { router, useForm } from "@inertiajs/react";
import { Modal, Button } from "flowbite-react";
import toastr from "toastr";

const ModalFilter = ({ openFilterModal, setOpenFilterModal, hariIni }) => {
    const { data, setData, get, errors } = useForm({
        mulai: hariIni,
        akhir: hariIni,
    });
    console.log(hariIni);
    const submit = (e) => {
        e.preventDefault();
        get('/laporan-penjualan', {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    mulai: '',
                    akhir: '',
                });
                setOpenFilterModal(false);
            },
            onError: () => {
                toastr.error('Silahkan Periksa Kembali Inputan Anda', 'Error!');
            }
        }, data);
    };

    return (
        <Modal dismissible show={openFilterModal} onClose={() => setOpenFilterModal(false)}>
            <form onSubmit={submit}>
                <Modal.Header>Tambah Filter</Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <label htmlFor="mulai" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mr-14 mt-2">Tanggal Mulai</label>
                        <input
                            type="date"
                            onChange={(e) => setData('mulai', e.target.value)}
                            id="mulai"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={data.mulai}
                        />
                        {errors.mulai && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.mulai}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="akhir" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mr-14 mt-2">Tanggal Akhir</label>
                        <input
                            type="date"
                            onChange={(e) => setData('akhir', e.target.value)}
                            id="akhir"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={data.akhir}
                        />
                        {errors.akhir && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.akhir}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Simpan</Button>
                    <Button color="gray" onClick={() => setOpenFilterModal(false)}>
                        Batal
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default ModalFilter;
