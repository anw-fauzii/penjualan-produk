import { Modal, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import Barcode from "react-barcode";

const ModalBarcode = ({ openModalBarcode, setOpenModalBarcode, modalData }) => {
    const [jumlah, setJumlah] = useState(1);

    const handleJumlahChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= 20) { // Ensure the max value is 20
            setJumlah(value);
        } else {
            setJumlah(20); // Set to 20 if exceeded
        }
    };

    const downloadPdf = () => {
        const url = `/generate-pdf/${modalData.id}?jumlah=${jumlah}`;
        window.open(url, '_blank');
    };

    return (
        <Modal dismissible show={openModalBarcode} onClose={() => setOpenModalBarcode(false)}>
            <Modal.Header>{modalData.id} - {modalData.nama_barang}</Modal.Header>
            <Modal.Body>
                <div className="flex items-center justify-center">
                    <Barcode className="items-center" value={modalData.id} />
                </div>
                <TextInput
                    id="jumlah"
                    name="jumlah"
                    type="number"
                    placeholder="Jumlah Yang Ingin di Print"
                    required
                    min={1}
                    max={20}
                    value={jumlah}
                    onChange={handleJumlahChange} // Handle change
                />
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
