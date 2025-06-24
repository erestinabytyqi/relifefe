'use client';

import { useForm, Controller } from 'react-hook-form';
import {
  Input,
  Switch,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Divider,
} from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';

const { Title } = Typography;

export default function AdminSettingsPage() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      email: '',
      darkMode: false,
      notifications: true,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Admin Settings</Title>}
        bordered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 24]}>
            <Col span={8}><strong>Full Name</strong></Col>
            <Col span={16}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Enter name" />}
              />
            </Col>

            <Col span={8}><strong>Email</strong></Col>
            <Col span={16}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} type="email" placeholder="Enter email" />}
              />
            </Col>

            <Col span={8}><strong>Dark Mode</strong></Col>
            <Col span={16}>
              <Controller
                name="darkMode"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                  />
                )}
              />
            </Col>

            <Col span={8}><strong>Notifications</strong></Col>
            <Col span={16}>
              <Controller
                name="notifications"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                  />
                )}
              />
            </Col>
          </Row>

          <Divider />

          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Settings
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
    </div>
  );
}
