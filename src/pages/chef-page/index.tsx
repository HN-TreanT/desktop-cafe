import React, { useEffect, useState, useContext } from "react";
import { Col, MenuProps, Row, Dropdown } from "antd";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons"
import {  useSelector } from "react-redux";
import OrderDetail from "./OrderDetail";
import OperationOrderPage from './OperationOrderPage'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";

import "./OrderPage.scss";
import { RouterLinks } from "../../const/RouterLinks";

const ChefPage: React.FC = () => {

  const navigate = useNavigate()

  const {socket} = useContext(AppContext)


  useEffect(() => {
    socket.disconnect()
    socket.connect()
  }, [socket])

  const handlLogout = () => {
     localStorage.clear()
     navigate(RouterLinks.LOGIN)
  }
  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          <UserOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }} rev={undefined}            
          />
          <span style={{ fontWeight: "500" }}>Tài khoản</span>
        </div>
      ),
      key: "detailUser",
    },
    {
      label: (
        <div  onClick={() => handlLogout()}>
          <LogoutOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }} rev={undefined}           
          />
          <span style={{ fontWeight: "500" }}>Đăng xuất</span>
        </div>
      ),
      key: "logout",
      // onClick: handleLogout,
    },
  ];
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
  const [invoice_details, setInvoiceDetails] = useState<any>([])
  const [id_tables, setIdTables] = useState([])

  
 
  useEffect(() => {
   const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
   
        return item?.id_table
   } ) :  []
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
  setIdTables(mapIdTables)
  setInvoiceDetails(mappedInvoiceDetails);
  }, [selectedOrder])
  return (
    <div className="order-page">
      <div className="content-order-page">
        <Row gutter={[20, 20]}>
          <Col span={15}>
            <OperationOrderPage />
          </Col>
          <Col span={9}>
            <OrderDetail id_tables={id_tables} setIdTables={setIdTables} invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails}  />
          </Col>
        </Row>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="user-order-page">
            <span className="name-user-order-page">Hoàng Nam</span>
            <UserOutlined className="icon-user-order-page" rev={undefined}  />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
export default ChefPage;
