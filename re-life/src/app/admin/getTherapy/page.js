'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Input,
  Card,
  Popover,
  Spin,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Modal,
  Switch,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function TherapyListPage() {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState(null);

  const fetchTherapies = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://localhost:7023/api/TherapyLists');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTherapies(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load therapies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:7023/api/TherapyLists/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Therapy deleted');
      setTherapies(prev => prev.filter(t => t.id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (record) => {
    setEditingTherapy({ ...record });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://localhost:7023/api/TherapyLists/${editingTherapy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTherapy),
      });
      if (!res.ok) throw new Error();
      toast.success('Therapy updated');
      setTherapies(prev =>
        prev.map(t => (t.id === editingTherapy.id ? editingTherapy : t))
      );
      setEditModalVisible(false);
      setEditingTherapy(null);
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredTherapies = therapies.filter((t) => {
    const search = searchTerm.toLowerCase();
    return (
      t.therapyName?.toLowerCase().includes(search) ||
      t.therapyDescription?.toLowerCase().includes(search) ||
      new Date(t.registeredate).toLocaleDateString().includes(search)
    );
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'therapyName', key: 'therapyName', ellipsis: true },
    { title: 'Therapy ID', dataIndex: 'therapyId', key: 'therapyId', ellipsis: true },
    { title: 'Focus Arena', dataIndex: 'focusArena', key: 'focusArena', ellipsis: true },
    { title: 'Type of Illness', dataIndex: 'typeOfIllness', key: 'typeOfIllness', ellipsis: true },
    {
      title: 'Description',
      dataIndex: 'therapyDescription',
      key: 'therapyDescription',
      render: (text) => (
        <Popover content={text} title="Description">
          <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>
        </Popover>
      ),
    },
    {
      title: 'Added Date',
      dataIndex: 'registeredate',
      key: 'registeredate',
      render: (val) =>
        val ? new Date(val).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Enabled',
      dataIndex: 'therapyEnabled',
      key: 'therapyEnabled',
      render: (enabled) => (enabled ? 'Yes' : 'No'),
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
            title="Are you sure to delete this therapy?"
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
        title={<Title level={3} style={{ margin: 0 }}>Therapy List</Title>}
        bordered
        style={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <div style={{ maxWidth: 320, marginBottom: 16 }}>
          <Search
            placeholder="Search by name or date"
            allowClear
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <Spin tip="Loading therapies..." />
        ) : (
          <Table
            dataSource={filteredTherapies}
            columns={columns}
            rowKey="id"
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>

      <Modal
        title="Edit Therapy"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
        okText="Update"
      >
        {editingTherapy && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              value={editingTherapy.therapyName}
              placeholder="Therapy Name"
              onChange={(e) => setEditingTherapy({ ...editingTherapy, therapyName: e.target.value })}
            />
            <Input
              value={editingTherapy.therapyId}
              placeholder="Therapy ID"
              onChange={(e) => setEditingTherapy({ ...editingTherapy, therapyId: e.target.value })}
            />
            <Input
              value={editingTherapy.focusArena}
              placeholder="Focus Arena"
              onChange={(e) => setEditingTherapy({ ...editingTherapy, focusArena: e.target.value })}
            />
            <Input
              value={editingTherapy.typeOfIllness}
              placeholder="Type of Illness"
              onChange={(e) => setEditingTherapy({ ...editingTherapy, typeOfIllness: e.target.value })}
            />
            <Input.TextArea
              value={editingTherapy.therapyDescription}
              placeholder="Therapy Description"
              rows={3}
              onChange={(e) => setEditingTherapy({ ...editingTherapy, therapyDescription: e.target.value })}
            />
            <Switch
              checked={editingTherapy.therapyEnabled}
              onChange={(checked) =>
                setEditingTherapy({ ...editingTherapy, therapyEnabled: checked })
              }
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Space>
        )}
      </Modal>
    </div>
  );
}
