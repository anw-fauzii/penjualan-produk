import { router, useForm } from "@inertiajs/react";
import { Modal, Button } from "flowbite-react";
import toastr from "toastr";

const ModalStok = ({ openModalStok, setOpenModalStok, modalData }) => {
    const { data, setData, post, errors } = useForm({
        stok: '',
    });
    console.log(modalData)
    const submit = (e) => {
        e.preventDefault();
        post(`/update-stok/${modalData.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Data Berhasil diinput', 'Sukses!');
                setData({
                    stok: '',
                });
                setOpenModalStok(false);
                router.get(route('barang.show', modalData.barang_id));
            },
            onError: () => {
                toastr.error('Silahkan Periksa Kembali Inputan Anda', 'Error!');
            }
        }, data);
    };

    return (
        <Modal dismissible show={openModalStok} onClose={() => setOpenModalStok(false)}>
            <form onSubmit={submit}>
                <Modal.Header>{modalData.id} - {modalData?.barang?.nama_barang || 'Nama Barang Tidak Tersedia'} ({modalData.ukuran})</Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <label htmlFor="stok" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mr-14 mt-2">Stok</label>
                        <input
                            type="number"
                            onChange={(e) => setData('stok', e.target.value)}
                            id="stok"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={data.stok}
                        />
                        {errors.stok && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.stok}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Simpan</Button>
                    <Button color="gray" onClick={() => setOpenModalStok(false)}>
                        Batal
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default ModalStok;
