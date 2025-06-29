'use client';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useThemeMode } from './ThemeProvider';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  DashboardFilled,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function DashboardSidebar() {
  const { role, loading, user } = useAuth();
  const { isDark } = useThemeMode();
  const router = useRouter();

  if (loading) return null;

  const doctorMenu = [
     { key: '/', icon: <DashboardFilled />, label: 'Dashboard' },
    { key: 'patients', icon: <UserOutlined />, label: 'Patient List' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments' },
    { key: 'reports', icon: <FileTextOutlined />, label: 'Reports' },
  ];

  const nurseMenu = [
    { key: 'vitals', icon: <HeartOutlined />, label: 'Record Vitals' },
    { key: 'medications', icon: <MedicineBoxOutlined />, label: 'Medications' },
  ];

  const menuItems = (role === 'doctor' ? doctorMenu : role === 'nurse' ? nurseMenu : []).map(
    (item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
    })
  );

  const handleClick = ({ key }) => {
    router.push(`/dashboard/${key}`);
  };

  return (
    <Sider
      width={220}
      theme={isDark ? 'dark' : 'light'}
      style={{
        height: '100vh',
        backgroundColor: isDark ? '#001529' : '#ffffff',
        borderRight: isDark ? '1px solid #333' : '1px solid #f0f0f0',
        position: 'relative', // Needed for absolute positioning of footer
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 16,
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'capitalize',
          color: isDark ? '#ffffff' : '#000000',
        }}
      >
        {role} Panel
      </div>

      {/* Scrollable menu wrapper */}
      <div style={{ overflowY: 'auto', paddingBottom: 60 }}>
        <Menu
          mode="inline"
          theme={isDark ? 'dark' : 'light'}
          items={menuItems}
          onClick={handleClick}
          style={{ borderRight: 0 }}
        />
      </div>

      {/* Footer fixed to bottom of sidebar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 12,
          fontSize: 12,
          color: isDark ? '#ffffff88' : '#00000088',
          borderTop: isDark ? '1px solid #333' : '1px solid #f0f0f0',
          backgroundColor: isDark ? '#001529' : '#ffffff',
        }}
      >
        Logged in as:<br />
        <strong>{user?.email || 'Unknown'}</strong>
      </div>
    </Sider>
  );
}
