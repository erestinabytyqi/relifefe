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

export default function NursesPage() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'nurse'));
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNurses(result);
      } catch (error) {
        console.error(error);
        message.error('Failed to load nurses.');
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  const handleChangeRole = async (user, newRole) => {
    if (newRole === user.role) return;
    try {
      const ref = doc(db, 'users', user.id);
      await updateDoc(ref, { role: newRole });
      setNurses(prev =>
        prev.map(n =>
          n.id === user.id ? { ...n, role: newRole } : n
        )
      );
      message.success(`Role updated to ${newRole}`);
    } catch (err) {
      message.error('Failed to change role.');
    }
  };

  const handleDeleteUser = async (user) => {
    console.log('[Delete] User:', user);
    if (!user?.id) {
      return message.error('Missing Firestore ID');
    }
    if (!user?.uid) {
      return message.error('Missing UID (Firebase Auth)');
    }

    try {
      // 1. Delete from Firebase Auth
      const res = await fetch('/api/delete-auth-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete from Auth');
      }

      // 2. Delete from Firestore
      await deleteDoc(doc(db, 'users', user.id));
      setNurses(prev => prev.filter(n => n.id !== user.id));

      message.success('User deleted from Auth and Firestore.');
    } catch (err) {
      console.error('[Delete error]', err);
      message.error(err.message || 'Failed to delete user.');
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
      )
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
      <Title level={3}>All Nurses</Title>
      {loading ? (
        <div
          style={{
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin tip="Loading nurses..." size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={nurses} rowKey="id" />
      )}
    </div>
  );
}
