'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Spin,
  message,
  Select,
  Button,
  Tooltip,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const { Title } = Typography;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(result);
      } catch (error) {
        console.error(error);
        message.error('Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChangeRole = async (user, newRole) => {
    if (newRole === user.role) return;
    try {
      const ref = doc(db, 'users', user.id);
      await updateDoc(ref, { role: newRole });
      setDoctors(prev =>
        prev.map(d => (d.id === user.id ? { ...d, role: newRole } : d))
      );
      message.success(`Role updated to ${newRole}`);
    } catch (err) {
      message.error('Failed to change role.');
    }
  };

const handleDeleteUser = async (user) => {
  try {
    const res = await fetch('/api/delete-auth-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: user.id }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // 🔍 Log error body from API
      console.error('Auth deletion error:', errorText); // ✅ this shows real error reason
      throw new Error('Failed to delete from Auth');
    }

    await deleteDoc(doc(db, 'users', user.id));
    setDoctors(prev => prev.filter(d => d.id !== user.id));
    message.success('User deleted from Auth and Firestore.');
  } catch (err) {
    console.error(err);
    message.error('Failed to delete user.');
  }
};


  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 120 }}
          onChange={(newRole) => handleChangeRole(record, newRole)}
          options={[
            { value: 'doctor', label: 'Doctor' },
            { value: 'nurse', label: 'Nurse' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => value?.toDate().toLocaleString() ?? '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Tooltip title="Delete User">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteUser(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>All Doctors</Title>
      {loading ? (
        <div
          style={{
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin tip="Loading doctors..." size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={doctors} rowKey="id" />
      )}
    </div>
  );
}
