'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Tag,
  Spin,
  Button,
  Popconfirm,
  Switch,
  Space,
  Input,
  Card,
  Tooltip,
  Popover,
  Modal as DefaultModal,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function AllergyListPage() {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAllergy, setCurrentAllergy] = useState(null);

  const fetchAllergies = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://localhost:7023/api/AllergiesLists');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllergies(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load allergies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:7023/api/AllergiesLists/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Allergy deleted');
      setAllergies(prev => prev.filter(a => a.id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleActivate = async (record) => {
    const updated = { ...record, activated: !record.activated };
    try {
      const res = await fetch(`https://localhost:7023/api/AllergiesLists/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      toast.success(`Allergy ${updated.activated ? 'activated' : 'deactivated'}`);
      setAllergies(prev =>
        prev.map(a => (a.id === record.id ? { ...a, activated: updated.activated } : a))
      );
    } catch {
      toast.error('Update failed');
    }
  };

  const handleEdit = (record) => {
    setCurrentAllergy(record);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const updated = {
        ...currentAllergy,
        registerdDate: currentAllergy.registerdDate // Keep original register date
      };
      const res = await fetch(`https://localhost:7023/api/AllergiesLists/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      toast.success('Allergy updated');
      setAllergies(prev =>
        prev.map(a => (a.id === updated.id ? { ...updated } : a))
      );
      setIsModalOpen(false);
      setCurrentAllergy(null);
    } catch {
      toast.error('Update failed');
    }
  };

  const renderTags = arr =>
    arr?.length ? arr.map((item, idx) => <Tag key={idx}>{item}</Tag>) : '-';

  const filteredAllergies = allergies.filter((a) => {
    const search = searchTerm.toLowerCase();
    return (
      a.name?.toLowerCase().includes(search) ||
      a.code?.toLowerCase().includes(search) ||
      a.symptoms?.some(s => s.toLowerCase().includes(search)) ||
      new Date(a.registerdDate).toLocaleDateString().includes(search)
    );
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Code', dataIndex: 'code', key: 'code', ellipsis: true },
    { title: 'Affect', dataIndex: 'affect', key: 'affect', ellipsis: true },
    { title: 'Severity', dataIndex: 'severity', key: 'severity' },
    {
      title: 'Activated',
      dataIndex: 'activated',
      key: 'activated',
      render: (_, record) => (
        <Switch
          checked={record.activated}
          onChange={() => handleToggleActivate(record)}
        />
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'registerdDate',
      key: 'registerdDate',
      render: val => new Date(val).toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100,
      render: text => (
        <Popover content={text} title="Description">
          <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>
        </Popover>
      ),
    },
    {
      title: 'Symptoms',
      dataIndex: 'symptoms',
      key: 'symptoms',
      render: arr => (
        <Popover content={<div>{arr.join(', ')}</div>} title="Symptoms">
          <Paragraph ellipsis={{ rows: 1 }}>{arr.join(', ')}</Paragraph>
        </Popover>
      ),
    },
    {
      title: 'Triggers',
      dataIndex: 'triggers',
      key: 'triggers',
      render: arr => (
        <Popover content={<div>{arr.join(', ')}</div>} title="Triggers">
          <Paragraph ellipsis={{ rows: 1 }}>{arr.join(', ')}</Paragraph>
        </Popover>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this allergy?"
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
        title={<Title level={3} style={{ margin: 0 }}>Allergies List</Title>}
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
          <Spin tip="Loading allergies..." />
        ) : (
          <Table
            dataSource={filteredAllergies}
            columns={columns}
            rowKey="id"
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
      </Card>

      <DefaultModal
        title="Edit Allergy"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        {currentAllergy && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              placeholder="Name"
              value={currentAllergy.name}
              onChange={(e) => setCurrentAllergy({ ...currentAllergy, name: e.target.value })}
            />
            <Input
              placeholder="Code"
              value={currentAllergy.code}
              onChange={(e) => setCurrentAllergy({ ...currentAllergy, code: e.target.value })}
            />
            <Input
              placeholder="Affect"
              value={currentAllergy.affect}
              onChange={(e) => setCurrentAllergy({ ...currentAllergy, affect: e.target.value })}
            />
            <Input
              placeholder="Severity"
              value={currentAllergy.severity}
              onChange={(e) => setCurrentAllergy({ ...currentAllergy, severity: e.target.value })}
            />
            <Input.TextArea
              placeholder="Description"
              value={currentAllergy.description}
              onChange={(e) => setCurrentAllergy({ ...currentAllergy, description: e.target.value })}
              rows={3}
            />
            <Input
              placeholder="Symptoms (comma separated)"
              value={currentAllergy.symptoms?.join(', ')}
              onChange={(e) =>
                setCurrentAllergy({
                  ...currentAllergy,
                  symptoms: e.target.value.split(',').map(s => s.trim()),
                })
              }
            />
            <Input
              placeholder="Triggers (comma separated)"
              value={currentAllergy.triggers?.join(', ')}
              onChange={(e) =>
                setCurrentAllergy({
                  ...currentAllergy,
                  triggers: e.target.value.split(',').map(t => t.trim()),
                })
              }
            />
          </div>
        )}
      </DefaultModal>
    </div>
  );
}
