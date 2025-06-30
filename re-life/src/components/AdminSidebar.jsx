'use client';

import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import {
  UserAddOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  ToolOutlined,
  PlusSquareOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
  FileAddOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function AdminSidebar() {
  const router = useRouter();

  const menuItems = [
    {
      type: 'group',
      label: 'Administrative Tasks',
      children: [ 
         { key: 'reports', icon: <FileTextOutlined />, label: 'Reports' },
        { key: 'create-user', icon: <UserAddOutlined />, label: 'Create User' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      ],
    },
    {
      type: 'group',
      label: 'Medical Tasks',
      children: [
       { key: 'allergies', icon: <PlusSquareOutlined />, label: 'Register Allergies' },
      { key: 'getAllergies', icon: <UnorderedListOutlined />, label: 'Get Allergies' },
      { key: 'getMedications', icon: <FileSearchOutlined />, label: 'Get Medications' },
      { key: 'diagnosis', icon: <FileAddOutlined />, label: 'Register Diagnosis' },
      { key: 'getDiagnosis', icon: <UnorderedListOutlined />, label: 'Get Diagnosis' },
      { key: 'therapy', icon: <PlusSquareOutlined />, label: 'Register Therapy' },
      { key: 'getTherapy', icon: <MedicineBoxOutlined />, label: 'Get Therapy' },
     ],
    },
    {
      type: 'group',
      label: 'Hospital Management',
      children: [
        { key: 'doctors', icon: <UserOutlined />, label: 'All Doctors' },
        { key: 'nurses', icon: <TeamOutlined />, label: 'All Nurses' },
        { key: 'patients', icon: <UserOutlined />, label: 'Patients' },
        { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments' },
        { key: 'departments', icon: <HomeOutlined />, label: 'Departments' },
        { key: 'equipment', icon: <ToolOutlined />, label: 'Equipment' },
      ],
    },
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
     
      <Menu mode="inline" items={menuItems} onClick={handleClick} />
    </Sider>
  );
}
