import React from "react";
import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/user";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Mutate login request
  const mutationLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      message.success("Login successful!");
      form.resetFields();
      navigate("/list/home", { replace: true });
    },
    onError: () => {
      message.error("Login failed. Please check your login details.");
    },
  });

  const handleSubmit = (values) => {
    mutationLogin.mutate(values);
  };

  return (
    <div
      className="login-form"
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutationLogin.isLoading}
            block
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
