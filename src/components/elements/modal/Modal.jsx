import { Modal } from "antd";

const Modall = ({
  title,
  okAction,
  cancelAction,
  body,
  okText,
  cancelText,
  modalOpen,
  setModalOpen,
  okButtonDisabled = false, // Default is false, but can be passed as a prop
  cancelButtonDisabled = false, // Default is false, but can be passed as a prop
  width = 550, // Default width is 520, but can be passed as a prop
}) => {
  return (
    <Modal
      title={title}
      centered
      open={modalOpen}
      okText={okText}
      cancelText={cancelText}
      onOk={okAction}
      onCancel={cancelAction}
      width={width} // Dynamically set width
      okButtonProps={{
        style: {
          backgroundColor: "#0077b6",
          borderColor: "#0077b6",
          color: "white",
        },
        disabled: okButtonDisabled,
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: "transparent",
          borderColor: "#0077b6",
          color: "#0077b6",
          border: "2px solid",
        },
        disabled: cancelButtonDisabled,
      }}
    >
      {body}
    </Modal>
  );
};

export default Modall;
