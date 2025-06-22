'use client';

import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function AdminSidebar() {
  const router = useRouter();

  const menuItems = [
    { key: 'doctors', icon: <TeamOutlined />, label: 'All Doctors' },
    { key: 'nurses', icon: <TeamOutlined />, label: 'All Nurses' },
    { key: 'create-user', icon: <UserAddOutlined />, label: 'Create User' },
  ];

  const handleClick = ({ key }) => {
    router.push(`/admin/${key}`);
  };

  return (
    <Sider
      width={220}
      theme="light"
      style={{
        height: '100vh',
        borderRight: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        overflow: 'auto',
      }}
    >
      <div className="p-4 text-lg font-semibold">Admin Panel</div>
      <Menu mode="inline" items={menuItems} onClick={handleClick} />
    </Sider>
  );
}
