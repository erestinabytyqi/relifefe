'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Tooltip,
} from 'antd';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useThemeMode } from '../../components/ThemeProvider';
import { useRouter } from 'next/navigation';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useThemeMode();
  const router = useRouter();

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      message.success('Password reset email sent.');
      router.push('/login');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        message.error('No account found with this email.');
      } else {
        message.error('Could not send reset email.');
      }
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
      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
          <Button
            type="text"
            icon={isDark ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>
      </div>

      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Forgot Password</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Enter your email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Send Reset Email
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          <Button type="link" size="small" onClick={() => router.push('/login')}>
            Back to Login
          </Button>
        </Text>
      </Card>
    </div>
  );
}
