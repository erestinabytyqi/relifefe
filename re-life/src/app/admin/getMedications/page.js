'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Button,
  Popconfirm,
  Input,
  Space,
  Card,
  Modal,
  Form,
  Spin,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://localhost:7023/api/Medications');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMedications(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:7023/api/Medications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success('Medication deleted');
      setMedications(prev => prev.filter(m => m.id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleCreate = async (values) => {
    try {
      const payload = {
        ...values,
        id: 0,
        addedDate: new Date().toISOString(),
      };
      const res = await fetch('https://localhost:7023/api/Medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Medication added');
      form.resetFields();
      setIsModalOpen(false);
      fetchMedications();
    } catch {
      toast.error('Creation failed');
    }
  };

  const filtered = medications.filter(m => {
    const search = searchTerm.toLowerCase();
    return (
      m.medicationName?.toLowerCase().includes(search) ||
      m.takenFor?.toLowerCase().includes(search)
    );
  });

  const columns = [
    { title: 'Name', dataIndex: 'medicationName', key: 'medicationName', ellipsis: true },
    { title: 'Strength', dataIndex: 'strengthOfMedicine', key: 'strengthOfMedicine' },
    { title: 'Taken For', dataIndex: 'takenFor', key: 'takenFor', ellipsis: true },
    { title: 'Type', dataIndex: 'medicationType', key: 'medicationType' },
    {
      title: 'Instructions',
      dataIndex: 'instruction',
      key: 'instruction',
      render: text => <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="text" onClick={() => toast('Edit coming soon')} />
          <Popconfirm
            title="Delete this medication?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger type="text" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3} style={{ margin: 0 }}>Medications</Title>}
        bordered
        style={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        extra={<Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Add Medication</Button>}
      >
        <div style={{ maxWidth: 320, marginBottom: 16 }}>
          <Search
            placeholder="Search by name or condition"
            allowClear
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
      </Card>

      <Modal
        title="Add New Medication"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Submit"
        confirmLoading={loading}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
        >
          <Form.Item name="medicationName" label="Medication Name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="strengthOfMedicine" label="Strength" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="takenFor" label="Taken For"> <Input /> </Form.Item>
          <Form.Item name="medicationDev" label="Developer"> <Input /> </Form.Item>
          <Form.Item name="medicationType" label="Type"> <Input /> </Form.Item>
          <Form.Item name="instruction" label="Instructions"> <Input.TextArea rows={2} /> </Form.Item>
          <Form.Item name="description" label="Description"> <Input.TextArea rows={2} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
