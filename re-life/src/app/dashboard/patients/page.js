'use client';

import { useEffect, useState } from 'react';
import { Table, Typography, Spin, Input, Space, Card, Tag } from 'antd';
import Link from 'next/link'; // <-- Add this
import { EyeOutlined } from '@ant-design/icons'; // Optional icon

const { Title } = Typography;
const { Search } = Input;

export default function PatientsTable() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://localhost:7023/api/PatientRegisters');
        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(term) ||
        p.patientLastName?.toLowerCase().includes(term) ||
        p.patientIdentification?.toLowerCase().includes(term)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const columns = [
    { title: 'ID', dataIndex: 'patientID', key: 'patientID' },
    { title: 'Identification', dataIndex: 'patientIdentification', key: 'patientIdentification' },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.patientName} ${record.patientLastName}`,
    },
    { title: 'Date of Birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Region', dataIndex: 'region', key: 'region' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    {
      title: 'Hospitalized',
      dataIndex: 'isHospitilized',
      key: 'isHospitilized',
      render: (value) => (value ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link href={`/dashboard/patients/${record.patientID}`}>
          <EyeOutlined /> View
        </Link>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Title level={3}>Patient Registry</Title>
      <Card className="mb-4">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder="Search by name, ID or identification..."
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            enterButton
          />
        </Space>
      </Card>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="patientID"
          pagination={{ pageSize: 8 }}
        />
      )}
    </div>
  );
}
