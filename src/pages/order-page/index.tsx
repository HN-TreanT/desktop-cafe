import React, { useEffect, useState, useContext, useRef } from "react";
import { Col, MenuProps, Row, Dropdown, message, Button, Modal } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import OrderDetail from "./OrderDetail";
import OperationOrderPage from "./OperationOrderPage";
import useAction from "../../redux/useActions";
import { invoiceServices } from "../../utils/services/invoiceService";
import { AppContext } from "../../context/appContext";
import "./OrderPage.scss";
import { RouterLinks } from "../../const/RouterLinks";
import { useNavigate } from "react-router-dom";

import Webcam from "react-webcam";
import axios from "axios";
import { serverConfig } from "../../const/serverConfig";
import ModalTaiKhoan from "../../components/ModalTaiKhoan";
const OrderPage: React.FC = () => {
  const actions = useAction();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();

  ///
  const userInfo = useSelector((state: any) => state.auth.user_info);
  const webcamRef = useRef<any>();
  const [isModal, setIsModal] = useState(false);
  const [messageError, setMessageError] = useState<any>();
  const [modalSetKhuonMat, setModalSetKhuonMat] = useState(false);
  const handleModal = () => {
    setIsModal(!isModal);
  };

  const handleCallApi = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        const response = await fetch(imageSrc);

        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        const formData = new FormData();
        formData.append("image", file);
        // const url = `http://localhost:8080/api/v1/upsert-image`;
        const url = `${serverConfig.server}/api/v1/upsert-image`;

        axios
          .post(url, formData, {
            params: {
              name: userInfo.name,
              id: userInfo.id,
            },
            headers: {
              "Content-Type": "application/octet-stream", // Đặt kiểu content-type cho dữ liệu byteArray
            },
          })
          .then((response) => {
            console.log("Response:", response.data);
            if (response?.data?.status) {
              if (response?.data?.data?.status === 200) {
                messageApi.success("Thêm khuôn mặt thành công");
                setMessageError(null);
              } else {
                console.log(response?.data?.data);
                if (response?.data?.data?.message.includes("skewed")) {
                  setMessageError("Mặt lệch quá");
                } else if (response?.data?.data?.message.includes("no")) {
                  setMessageError("Không tìm thấy khuôn  mặt đâu");
                } else {
                  setMessageError("Chỉ 1 khuôn mặt trong 1 khung hình");
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  ///

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [socket]);
  socket.off("announce_success").on("announce_success", function (data: any) {
    // if(data?.message === "success") {
    messageApi.success(`Yêu cầu mã #${data?.id_invoice} hoàn thành`);
    dispatch(
      actions.InvoiceActions.loadData({
        page: 1,
        size: 6,
        //thanh_toan: "chua"
      })
    );
    // }
  });

  const handlLogout = () => {
    localStorage.clear();
    navigate(RouterLinks.LOGIN);
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <div onClick={() => setIsModal(true)}>
          <UserOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
            rev={undefined}
          />
          <span style={{ fontWeight: "500" }}>Tài khoản</span>
        </div>
      ),
      key: "detailUser",
    },
    {
      label: (
        <div onClick={() => handlLogout()}>
          <LogoutOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
            rev={undefined}
          />
          <span style={{ fontWeight: "500" }}>Đăng xuất</span>
        </div>
      ),
      key: "logout",
      // onClick: handleLogout,
    },
  ];
  const selectedOrder = useSelector((state: any) => state.order.selectedOrder);
  const [invoice_details, setInvoiceDetails] = useState<any>([]);
  const [id_tables, setIdTables] = useState([]);
  const hanldeSetInvoiceDetails = (data: any) => {
    console.log(data);
    setInvoiceDetails(data);
  };

  const handleSaveOrder = () => {
    const lst_invoice_detail = invoice_details.map((item: any) => {
      return {
        id_invoice: selectedOrder?.id,
        id_product: !item?.isCombo ? item?.id_product : null,
        id_combo: item?.isCombo ? item?.id_product : null,
        isCombo: item?.isCombo,
        price: item?.price,
        amount: item?.amount,
      };
    });

    const dataSubmit = {
      id_employee: selectedOrder?.id_employee
        ? selectedOrder?.id_employee
        : null,
      id_customer: selectedOrder?.id_customer
        ? selectedOrder?.id_customer
        : null,
      id_promotion: selectedOrder?.id_promotion
        ? selectedOrder?.id_promotion
        : null,
      lst_invoice_detail: lst_invoice_detail,
    };

    invoiceServices
      .update(selectedOrder?.id, dataSubmit)
      .then((res: any) => {
        if (res.status) {
          messageApi.success("Chỉnh sửa thành công");
          invoiceServices
            .getById(res.data.id)
            .then((res: any) => {
              if (res.status) {
                dispatch(actions.OrderActions.selectedOrder(res.data));
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
        messageApi.error("Chỉnh sửa thất bại");
      });
  };

  useEffect(() => {
    const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices)
      ? selectedOrder?.tablefood_invoices.map((item: any) => {
          return item?.id_table;
        })
      : [];
    const mappedInvoiceDetails = Array.isArray(selectedOrder?.invoice_details)
      ? selectedOrder?.invoice_details.map((item: any) => {
          return {
            id: item?.id,
            isCombo: item?.isCombo,
            id_product: !item?.isCombo ? item?.id_product : item?.id_combo,
            // id_combo: item?.id_combo,
            amount: item?.amount,
            price: item?.price,
            name: item?.id_product ? item?.product?.name : item?.combo?.name,
          };
        })
      : [];
    setIdTables(mapIdTables);
    setInvoiceDetails(mappedInvoiceDetails);
  }, [selectedOrder]);
  return (
    <div className="order-page">
      {contextHolder}
      <div className="content-order-page">
        <Row gutter={[20, 20]}>
          <Col span={15}>
            <OperationOrderPage
              hanldeSetInvoiceDetails={hanldeSetInvoiceDetails}
              invoice_details={invoice_details}
              setInvoiceDetails={setInvoiceDetails}
            />
          </Col>
          <Col span={9}>
            <OrderDetail
              id_tables={id_tables}
              setIdTables={setIdTables}
              invoice_details={invoice_details}
              setInvoiceDetails={setInvoiceDetails}
              handleSaveOrder={handleSaveOrder}
            />
          </Col>
        </Row>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="user-order-page">
            <span className="name-user-order-page">{userInfo?.name || ""}</span>
            <UserOutlined className="icon-user-order-page" rev={undefined} />
          </div>
        </Dropdown>
      </div>
      <ModalTaiKhoan
        setModalAddKhuonMat={setModalSetKhuonMat}
        isAdd={isModal}
        handleModal={handleModal}
      />
      <Modal
        open={modalSetKhuonMat}
        onCancel={() => {
          setModalSetKhuonMat(false);
          setMessageError(null);
        }}
        footer={null}
      >
        {/* <div style={{ height: "300px", width: "300px" }}> */}
        <div className="appvide" style={{ height: "300px", width: "300px" }}>
          <Webcam height={300} width={300} ref={webcamRef} />
        </div>
        {messageError && <span style={{ color: "red" }}>{messageError}</span>}

        <Button
          onClick={() => {
            setModalSetKhuonMat(false);
          }}
          danger
          style={{ marginRight: "7px" }}
        >
          Dừng lại
        </Button>
        <Button type="primary" onClick={handleCallApi}>
          Chụp khuôn mặt
        </Button>

        {/* </div> */}
      </Modal>
    </div>
  );
};
export default OrderPage;
