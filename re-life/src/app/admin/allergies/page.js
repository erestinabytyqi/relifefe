"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  DatePicker,
  Switch,
  Typography,
  Select,
  Space,
  Card,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast"; // ✅ Add toast

const { Title } = Typography;
const { TextArea } = Input;

export default function AllergyForm() {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        id: 0,
        registerdDate: data.registerdDate.toISOString(),
      };
      const res = await fetch("https://localhost:7023/api/AllergiesLists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Allergy has been created!"); // ✅ Toast success
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed"); // ✅ Toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Register Allergy
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
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Allergy Name" />
              )}
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Code" />}
            />
            <Controller
              name="affect"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Affects (e.g. respiratory)" />
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
              name="symptoms"
              control={control}
              render={({ field }) => (
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Symptoms"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="triggers"
              control={control}
              render={({ field }) => (
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Triggers"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="diagnosis"
              control={control}
              render={({ field }) => (
                <TextArea {...field} placeholder="Diagnosis" rows={2} />
              )}
            />
            <Controller
              name="preventions"
              control={control}
              render={({ field }) => (
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Preventions"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="treatment"
              control={control}
              render={({ field }) => (
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Treatment"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Severity"
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Moderate", label: "Moderate" },
                    { value: "Severe", label: "Severe" },
                  ]}
                />
              )}
            />
            <Controller
              name="registerdDate"
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
              name="activated"
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
