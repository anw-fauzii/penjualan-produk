import { Modal, Button, Table } from "flowbite-react";
import { NumericFormat } from "react-number-format";

const ModalRetur = ({ openModal, setOpenModal, modalData }) => {
    const pesananDetails = modalData?.retur_detail || [];
    return (
        <Modal dismissible size="4xl" position="top-center" show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>{modalData?.id}</Modal.Header>
            <Modal.Body>
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Produk</Table.HeadCell>
                            <Table.HeadCell>Qty.</Table.HeadCell>
                            <Table.HeadCell>Harga</Table.HeadCell>
                            <Table.HeadCell>Diskon</Table.HeadCell>
                            <Table.HeadCell>Subtotal</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {pesananDetails.map((data, i) => (
                                <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {data.pesanan_detail.barang?.nama_barang || 'N/A'}
                                    </Table.Cell>
                                    <Table.Cell>{data.kuantitas || 0}</Table.Cell>
                                    <Table.Cell>
                                        <NumericFormat
                                            value={data.pesanan_detail.harga || 0}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'Rp. '}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <NumericFormat
                                            value={((data.pesanan_detail.harga || 0) * ((data.pesanan_detail.diskon || 0) / 100) * (data.kuantitas || 0))}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'Rp. '}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <NumericFormat
                                            value={data.pesanan_detail.subtotal || 0}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'Rp. '}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            <Table.Row>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRetur;
