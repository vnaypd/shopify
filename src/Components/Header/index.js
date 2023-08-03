import {
  Badge,
  Button,
  Drawer,
  Input,
  InputNumber,
  Menu,
  Table,
  Typography,
  Form,
  Checkbox,
  message,
} from "antd";

import { HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCart } from "../../API";
import { useEffect } from "react";

function AppHeader() {
  const navigate = useNavigate();
  const onMenuClick = (item) => {
    navigate(`/${item.key}`);
  };
  return (
    <div className="appHeader">
      <Menu
      className="appMenu"
        onClick={onMenuClick}
        mode="horizontal"
        items={[
          {
            label: <HomeFilled />,
            key: "",
          },
          {
            label: "Men",
            key: "men",
            children: [
              {
                label: "Men's Shirts",
                key: "men's-shirts",
              },
              {
                label: "Men's Shoes",
                key: "mens-shoes",
              },
              {
                label: "Men's Watches",
                key: "mens-watches",
              },
            ],
          },
          {
            label: "Women",
            key: "women",
            children: [
              {
                label: "Women's Dresses",
                key: "womens-dresses",
              },
              {
                label: "Women's Shoes",
                key: "womens-shoes",
              },
              {
                label: "Women's Watches",
                key: "womens-watches",
              },
              {
                label: "Women's Bags",
                key: "womens-bags",
              },
              {
                label: "Women's Jewellery",
                key: "womens-jewellery",
              },
            ],
          },
          {
            label: "Fragrances",
            key: "fragrances",
          },
        ]}
      />
      <Typography.Title> BadshaH StorE </Typography.Title>
      <AppCart />
    </div>
  );

  function AppCart() {
    const [cartDrawerOpen, setcartDrawerOpen] = useState(false);
    const [cartItems, setcartItems] = useState([]);
    const [CheckOutDrawerOpen, setCheckOutDrawerOpen] = useState(false);
    useEffect(() => {
      getCart().then((res) => {
        setcartItems(res.products);
      });
    }, []);

    const onConfirmOrder =(values)=>{
 console.log({values})
 setCheckOutDrawerOpen(false)
 setcartDrawerOpen(false)
 message.success("Your Order has be Placed Succesfully")
    }

    return (
      <div>
        <Badge
          onClick={() => {
            setcartDrawerOpen(true);
          }}
          count={cartItems.length}
          className="shoppingCartIcon"
        >
          <ShoppingCartOutlined />
        </Badge>
        <Drawer
          open={cartDrawerOpen}
          onClose={() => {
            setcartDrawerOpen(false);
          }}
          title="Your Cart"
          contentWrapperStyle={{ width: 500 }}
        >
          <Table
            pagination={false}
            columns={[
              {
                title: "Title",
                dataIndex: "title",
              },
              {
                title: "Price",
                dataIndex: "price",
                render: (value) => {
                  return <span>${value}</span>;
                },
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                render: (value, record) => {
                  return (
                    <InputNumber
                      min={0}
                      defaultValue={value}
                      onChange={(value) => {
                        setcartItems((pre) =>
                          cartItems.map((cart) => {
                            if (record.id === cart.id) {
                              cart.total = cart.price * value;
                            }
                            return cart;
                          })
                        );
                      }}
                    ></InputNumber>
                  );
                },
              },
              {
                title: "Total",
                dataIndex: "total",
                render: (value) => {
                  return <span>${value}</span>;
                },
              },
            ]}
            dataSource={cartItems}
            summary={(data) => {
              const total = data.reduce((pre, current) => {
                return pre + current.total;
              }, 0);
              return <span> Total: {total} </span>;
            }}
          />
          <Button
            onClick={() => {
              setCheckOutDrawerOpen(true);
            }}
            type="primary"
          >
            Checkout Your Cart{" "}
          </Button>
        </Drawer>
        <Drawer
          open={CheckOutDrawerOpen}
          onClose={() => {
            setCheckOutDrawerOpen(false);
          }}
          title="Confirm Order"
          contentWrapperStyle={{ width: 500 }}
        >
          <Form onFinish={onConfirmOrder} >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "please enter your full name",
                },
              ]}
              label="Full Name"
              name="full_name"
            >
              <Input placeholder="Enter Your full Name" />
            </Form.Item>
            <Form.Item  rules={[
                {
                  required: true,
                  type:"email",
                  message: "please enter your valid email id",
                },
              ]} label="Email" name="your_email">
              <Input placeholder="Enter Your Email Address  " />
            </Form.Item>
            <Form.Item rules={[
                {
                  required: true,
                  message: "please enter your full address",
                },
              ]}  label="Adress" name="your_adress">
              <Input placeholder="Enter Your Full Address" />
            </Form.Item>
            <Form.Item rules={[
                {
                  required: true,
                  type:"tel",
                  message: "please enter your valid contact number",
                },
              ]} label="Contact Number" name="your_number">
              <Input placeholder="Enter Your Phone Number" />
            </Form.Item>
            <Form.Item>
              <Checkbox defaultChecked disabled > Cash on Delivery  </Checkbox>
            </Form.Item>
            <Typography.Paragraph type="secondary" >More Options Comming Soon....</Typography.Paragraph>
            <Button type="primary" htmlType="submit">
              Confirm order
            </Button>
          </Form>
        </Drawer>
      </div>
    );
  }
}
export default AppHeader;
