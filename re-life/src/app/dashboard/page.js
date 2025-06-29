'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const { Title } = Typography;
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c'];

export default function AdminReportDashboard() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('https://localhost:7023/api/PatientRegisters');
        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const hospitalizedCount = patients.filter(p => p.isHospitilized).length;
  const notHospitalizedCount = patients.length - hospitalizedCount;

  const patientsByCity = Object.entries(
    patients.reduce((acc, p) => {
      const city = p.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const patientsByCountry = Object.entries(
    patients.reduce((acc, p) => {
      const country = p.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Hospital Admin Report</Title>
      {loading ? <Spin tip="Loading report..." /> : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6}><Card title="Total Patients" size="small"><Title level={4}>{patients.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6}><Card title="Hospitalized" size="small"><Title level={4}>{hospitalizedCount}</Title></Card></Col>
            <Col xs={12} sm={8} md={6}><Card title="Not Hospitalized" size="small"><Title level={4}>{notHospitalizedCount}</Title></Card></Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}><Card title="Patients by City">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patientsByCity} layout="vertical">
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {patientsByCity.map((_, i) => (
                      <Cell key={`bar-city-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Patients by Country">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={patientsByCountry} dataKey="value" nameKey="name" outerRadius={100} label>
                    {patientsByCountry.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card></Col>
          </Row>
        </>
      )}
    </div>
  );
}
