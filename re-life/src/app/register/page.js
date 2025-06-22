'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Select,
  Tooltip,
} from 'antd';
import Link from 'next/link';
import { registerUser } from '../../lib/auth';
import { useThemeMode } from '../../components/ThemeProvider';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useThemeMode();
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await registerUser(values.email, values.password, values.role);
      message.success('Registration successful');
      router.push('/login');
    } catch (err) {
      message.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#141414' : '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        position: 'relative',
      }}
    >
      {/* Top-right theme toggle */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
          <Button
            type="text"
            icon={isDark ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>
      </div>

      <Card style={{ width: '100%', maxWidth: 450 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Register
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Minimum 6 characters' },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            initialValue="nurse"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="nurse">Nurse</Option>
              <Option value="doctor">Doctor</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
          Already have an account? <Link href="/login">Login</Link>
        </Text>
      </Card>
    </div>
  );
}
