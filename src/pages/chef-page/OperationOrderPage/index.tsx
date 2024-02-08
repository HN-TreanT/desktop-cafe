import React from "react";
import {  Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,

} from "@fortawesome/free-solid-svg-icons";

import Order from "./Order";


const IconTab = ({ icon, label, children }: any) => (
  <div>
    <FontAwesomeIcon
      style={{ paddingRight: "6px", fontSize: "1rem" }}
      icon={icon}
    />
    <span>{label}</span>
    {children}
  </div>
);

// interface props {
//   invoice_details: any[],
//   setInvoiceDetails: any,
// }
const OperationOrderPage: React.FC = () => {
  

  return (
  
    <div className="operation-order-page">

      <Tabs
      >        
           <Tabs.TabPane
            tab={<IconTab icon={faFileInvoiceDollar} label={"Phiếu yêu cầu"} />}
            key={"order"}
            className="tab-pane"
          >
            <Order />,
          </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default OperationOrderPage;
