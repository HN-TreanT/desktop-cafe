import React, { useEffect } from "react";
import { Button, Modal, Form, Card, Row, Col, Input, DatePicker, Select, message  } from "antd";
import { useSelector } from "react-redux";
import dayjs from 'dayjs'
import axios from "axios";
import { serverConfig } from "../const/serverConfig";
const ModalTaiKhoan = ({isAdd, handleModal, setModalAddKhuonMat}) => {
    const userInfo = useSelector((state) => state.auth.user_info);
    const [form] = Form.useForm()
    
    const hadleResetFace = async () => {
        try {

        // const url = `http://localhost:8080/api/v1/delete-face/${userInfo?.id}`;
        const url = `${serverConfig.server}/api/v1/delete-face/${userInfo?.id}`;

        axios.get(url).then((res) => {
            if (res?.data.data?.status === "ok") {
                message.success("Làm mới thành công")
            } 
        }).catch(err => {
            console.log(err)
            message.success("Làm mới thất bại")
          
        })

        } catch (err){
            console.log(err)
        }
            

    }
    useEffect(() => {
        form.setFieldsValue({
            ...userInfo,
            gender: userInfo?.gender === 1 ? "nam" : "nữ",
            birthday: userInfo?.birthday ? dayjs(userInfo.birthday) : "",
          })
    }, [form, userInfo])
    return    <Modal
    open={isAdd}
    toggle={handleModal}
    onCancel={handleModal}
    contentClassName="pt-0"
    autoFocus={false}
    width={800}
    height={400}
    footer={null}
  >
    <Card
      title={
        "Thông tin cá nhân"
      }
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        fontSize: "21px",
      }}
    >
      <div className="flex-grow-1">
        <Form
          form={form}
          name="control-hooks"
          layout="vertical"
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="name"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: "Nhập họ và tên",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject("Không hợp lệ");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input value={userInfo?.name} placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="username"
                label="Tên đăng nhập"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên đăng nhập",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject("Không hợp lệ");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input value={userInfo?.username} placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="gender"
                label="Giới tính"
                rules={[
                  {
                    required: true,
                    message: "Nhập giới tính",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  value={userInfo?.gender ? "nam" : "nữ"}
                  style={{ width: "100%" }}
                  placeholder="Chọn giới tính"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="birthday"
                label="Ngày sinh"
                rules={[
                  {
                    required: true,
                    message: "Nhập ngày sinh",
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{
                    width: "100%",
                    height: " 34px",
                  }}
                  placeholder="Ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    message: "Nhập địa chỉ",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject("Không hợp lệ");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Nhập số điện thoại",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject("Không hợp lệ");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Nhập email",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject("Không hợp lệ");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Nhập email" type="email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "4px" }}
                name="id_position"
                label="Vị trí"
                rules={[
                  {
                    required: true,
                    message: "Chọn vị trí",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear

                  style={{ width: "100%" }}
                  placeholder="Chọn vị trí"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item label="Nhận dạng khuôn mặt">
                     <Button onClick={() => setModalAddKhuonMat(true)} type="primary" style={{marginRight:"5px"}}>Thêm khuôn mặt</Button>
                     <Button onClick={() => hadleResetFace()}>Làm mới</Button>
                </Form.Item>
            </Col>
           
          </Row>
        </Form>
      </div>
    </Card>
  </Modal>
}
export default ModalTaiKhoan