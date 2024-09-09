import { Modal, Button } from "flowbite-react";
import Barcode from "react-barcode";

const ModalBarcode = ({ openModalBarcode, setOpenModalBarcode, modalData }) => {
    const downloadPdf = () => {
        const url = `/generate-pdf/${modalData.id}`;
        window.open(url, '_blank');
    };

    return (
        <Modal dismissible show={openModalBarcode} onClose={() => setOpenModalBarcode(false)}>
            <Modal.Header>{modalData.id} - {modalData.nama_barang}</Modal.Header>
            <Modal.Body>
                <div className="flex items-center justify-center">
                    <Barcode className="items-center" value={modalData.id} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={downloadPdf}>Simpan</Button>
                <Button color="gray" onClick={() => setOpenModalBarcode(false)}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalBarcode;
