'use client';
import { Layout, Button, Space, Badge, Switch, Tooltip } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { useThemeMode } from './ThemeProvider';

const { Header } = Layout;

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (loading) return null;

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'inherit',
        borderBottom: '1px solid #f0f0f0',
        paddingInline: 24,
        height: 64,
      }}
    >
      <Link href="/" style={{ fontSize: 18, fontWeight: 600 }}>
        Re Life
      </Link>

      <Space align="center" size="middle">
        {/* Notification icon */}
        <Tooltip title="Notifications">
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Badge>
        </Tooltip>

        {/* Dark/Light toggle */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Switch checked={isDark} onChange={toggleTheme} />
        </Tooltip>

        {/* Role */}
        {user && <span style={{ fontSize: 14, color: '#888' }}>Role: {role}</span>}

        {/* Admin Link */}
        {role === 'admin' && (
          <Link href="/admin" style={{ fontSize: 14, color: '#1890ff' }}>
            Admin Panel
          </Link>
        )}

        {/* Auth buttons */}
        {user ? (
          <Button size="small" danger onClick={handleLogout}>
            Sign Out
          </Button>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: 14, color: '#1890ff' }}>
              Login
            </Link>
            <Link href="/register" style={{ fontSize: 14, color: '#1890ff' }}>
              Register
            </Link>
          </>
        )}
      </Space>
    </Header>
  );
}
