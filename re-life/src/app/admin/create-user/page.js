'use client';

import { useState } from 'react';
import {
  Form, Input, Select, Button, Typography
} from 'antd';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { Option } = Select;

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email, role }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      toast.success('User created and email sent!');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <Title level={3}>Create New User</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            <Option value="doctor">Doctor</Option>
            <Option value="nurse">Nurse</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
