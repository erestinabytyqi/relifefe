"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  DatePicker,
  Switch,
  Typography,
  Space,
  Card,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TextArea } = Input;

export default function DiagnosisForm() {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        id: 0, // default on creation
        addedDate: data.addedDate.toISOString(),
        updatedDate: new Date().toISOString(),
        userid: 0,
      };

      const res = await fetch("https://localhost:7023/api/DiagnosisLists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Diagnosis has been created!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Register Diagnosis
          </Title>
        }
        bordered
        style={{
          maxWidth: 800,
          margin: "0 auto",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Controller
              name="icdTen"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="ICD-10 Code" />
              )}
            />
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Diagnosis Title" />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea {...field} placeholder="Description" rows={3} />
              )}
            />
            <Controller
              name="addedDate"
              control={control}
              defaultValue={dayjs()}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "100%" }}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
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
