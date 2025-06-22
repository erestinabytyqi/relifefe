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
  Tooltip,
} from 'antd';
import Link from 'next/link';
import { loginUser } from '../../lib/auth';
import { useThemeMode } from '../../components/ThemeProvider';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useThemeMode();
  const router = useRouter();

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      await loginUser(email, password);
      message.success('Logged in successfully!');
      router.push('/');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        message.error('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        message.error('Incorrect password.');
      } else {
        message.error('Login failed. Please check your email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    if (!email) {
      message.warning('Please enter your email first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      message.success('Password reset email sent.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        message.error('No account with this email.');
      } else {
        message.error('Could not send reset email.');
      }
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
        <Title level={3} style={{ textAlign: 'center' }}>Login</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>

       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
  <Link href="/register">Don’t have an account?</Link>
  <Link href="/forgot-password">
    <Button type="link" size="small">Forgot Password?</Button>
  </Link>
</div>

      </Card>
    </div>
  );
}
