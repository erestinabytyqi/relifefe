'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Switch,
  Space,
  Input,
  Card,
  Tooltip,
  Popconfirm,
  Popover,
  Spin,
  Button,
  Modal as DefaultModal,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function DiagnosisListPage() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);

  const fetchDiagnoses = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://localhost:7023/api/DiagnosisLists');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDiagnoses(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load diagnoses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:7023/api/DiagnosisLists/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Diagnosis deleted');
      setDiagnoses(prev => prev.filter(d => d.id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleActivate = async (record) => {
    const updated = { ...record, isActive: !record.isActive };
    try {
      const res = await fetch(`https://localhost:7023/api/DiagnosisLists/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      toast.success(`Diagnosis ${updated.isActive ? 'activated' : 'deactivated'}`);
      setDiagnoses(prev =>
        prev.map(d => (d.id === record.id ? { ...d, isActive: updated.isActive } : d))
      );
    } catch {
      toast.error('Update failed');
    }
  };

  const handleEdit = (record) => {
    setCurrentDiagnosis(record);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const updated = {
        ...currentDiagnosis,
        updatedDate: new Date().toISOString(),
      };
      const res = await fetch(`https://localhost:7023/api/DiagnosisLists/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      toast.success('Diagnosis updated');
      setDiagnoses(prev =>
        prev.map(d => (d.id === updated.id ? { ...updated } : d))
      );
      setIsModalOpen(false);
      setCurrentDiagnosis(null);
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredDiagnoses = diagnoses.filter((d) => {
    const search = searchTerm.toLowerCase();
    return (
      d.title?.toLowerCase().includes(search) ||
      d.icdTen?.toLowerCase().includes(search) ||
      d.description?.toLowerCase().includes(search) ||
      new Date(d.addedDate).toLocaleDateString().includes(search)
    );
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'ICD-10 Code', dataIndex: 'icdTen', key: 'icdTen', ellipsis: true },
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => (
        <Popover content={text} title="Description">
          <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>
        </Popover>
      ),
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
      render: val => new Date(val).toLocaleDateString(),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: val => new Date(val).toLocaleDateString(),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_, record) => (
        <Switch checked={record.isActive} onChange={() => handleToggleActivate(record)} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this diagnosis?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3} style={{ margin: 0 }}>Diagnosis List</Title>}
        bordered
        style={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <div style={{ maxWidth: 320, marginBottom: 16 }}>
          <Search
            placeholder="Search by name, code, symptom, or date"
            allowClear
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <Spin tip="Loading diagnoses..." />
        ) : (
          <Table
            dataSource={filteredDiagnoses}
            columns={columns}
            rowKey="id"
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
      </Card>

      <DefaultModal
        title="Edit Diagnosis"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        {currentDiagnosis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              placeholder="ICD-10 Code"
              value={currentDiagnosis.icdTen}
              onChange={(e) =>
                setCurrentDiagnosis({ ...currentDiagnosis, icdTen: e.target.value })
              }
            />
            <Input
              placeholder="Title"
              value={currentDiagnosis.title}
              onChange={(e) =>
                setCurrentDiagnosis({ ...currentDiagnosis, title: e.target.value })
              }
            />
            <Input.TextArea
              placeholder="Description"
              value={currentDiagnosis.description}
              onChange={(e) =>
                setCurrentDiagnosis({ ...currentDiagnosis, description: e.target.value })
              }
              rows={4}
            />
          </div>
        )}
      </DefaultModal>
    </div>
  );
}