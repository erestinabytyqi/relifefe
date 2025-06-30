'use client';

import { useForm, Controller } from 'react-hook-form';
import {
  Input,
  Button,
  DatePicker,
  Switch,
  Typography,
  Space,
  Card,
} from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { TextArea } = Input;

export default function TherapyFormPage() {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        id: 0,
        therapyName: data.therapyName,
        therapyId: data.therapyId,
        therapyDescription: data.therapyDescription,
        focusArena: data.focusArena,
        registeredate: data.registeredate.toISOString(),
        typeOfIllness: data.typeOfIllness,
        therapyEnabled: data.therapyEnabled,
      };

      const res = await fetch('https://localhost:7023/api/TherapyLists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit');
      toast.success('Therapy has been registered!');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Register Therapy</Title>}
        bordered
        style={{
          maxWidth: 800,
          margin: '0 auto',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Controller
              name="therapyName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Therapy Name" />
              )}
            />
            <Controller
              name="therapyId"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Therapy ID" />
              )}
            />
            <Controller
              name="therapyDescription"
              control={control}
              render={({ field }) => (
                <TextArea {...field} placeholder="Therapy Description" rows={3} />
              )}
            />
            <Controller
              name="focusArena"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Focus Arena" />
              )}
            />
            <Controller
              name="typeOfIllness"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Type of Illness" />
              )}
            />
            <Controller
              name="registeredate"
              control={control}
              defaultValue={dayjs()}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: '100%' }}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="therapyEnabled"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              )}
            />
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Space>
        </form>
      </Card>
    </div>
  );
}
