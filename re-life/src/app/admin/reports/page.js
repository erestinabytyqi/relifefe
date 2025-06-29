'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const { Title } = Typography;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b14aed', '#f653a6'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorStats, setDoctorStats] = useState({ active: 0, inactive: 0 });
  const [nurseStats, setNurseStats] = useState({ active: 0, inactive: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, mRes, aRes, pRes] = await Promise.all([
        fetch('https://localhost:7023/api/DiagnosisLists'),
        fetch('https://localhost:7023/api/Medications'),
        fetch('https://localhost:7023/api/AllergiesLists'),
        fetch('https://localhost:7023/api/PatientRegisters')
      ]);

      const [dData, mData, aData, pData] = await Promise.all([
        dRes.json(),
        mRes.json(),
        aRes.json(),
        pRes.json()
      ]);

      setDiagnosis(dData);
      setMedications(mData);
      setAllergies(aData);
      setPatients(pData);

      const doctorSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'doctor')));
      const nurseSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'nurse')));

      const doctorData = doctorSnap.docs.map(doc => doc.data());
      const nurseData = nurseSnap.docs.map(doc => doc.data());

      setDoctors(doctorData);
      setNurses(nurseData);

      setDoctorStats({
        active: doctorData.filter(d => d.isActive).length,
        inactive: doctorData.filter(d => !d.isActive).length
      });

      setNurseStats({
        active: nurseData.filter(n => n.isActive).length,
        inactive: nurseData.filter(n => !n.isActive).length
      });

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allergyChart = Object.entries(
    allergies.reduce((acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({ name: key, value }));

  const medicationChart = Object.entries(
    medications.reduce((acc, m) => {
      acc[m.medicationType] = (acc[m.medicationType] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({ name: key, value }));

  const doctorChart = [
    { name: 'Active Doctors', value: doctorStats.active },
    { name: 'Inactive Doctors', value: doctorStats.inactive },
  ];

  const nurseChart = [
    { name: 'Active Nurses', value: nurseStats.active },
    { name: 'Inactive Nurses', value: nurseStats.inactive },
  ];

  const hospitalizedChart = [
    { name: 'Hospitalized', value: patients.filter(p => p.isHospitilized).length },
    { name: 'Not Hospitalized', value: patients.filter(p => !p.isHospitilized).length }
  ];

  const patientLocationChart = Object.entries(
    patients.reduce((acc, p) => {
      const location = `${p.city}, ${p.country}`;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({ location: key, count: value }));

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Admin Report Dashboard</Title>

      {loading ? <Spin tip="Loading dashboard..." /> : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Diagnosis Count" size="small"><Title level={4}>{diagnosis.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Medication Count" size="small"><Title level={4}>{medications.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Allergy Count" size="small"><Title level={4}>{allergies.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Doctor Count" size="small"><Title level={4}>{doctors.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Nurse Count" size="small"><Title level={4}>{nurses.length}</Title></Card></Col>
            <Col xs={12} sm={8} md={6} lg={4}><Card title="Patient Count" size="small"><Title level={4}>{patients.length}</Title></Card></Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}><Card title="Allergies by Severity">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={allergyChart} dataKey="value" nameKey="name" outerRadius={100} label>
                    {allergyChart.map((_, i) => <Cell key={`a-cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Medications by Type">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={medicationChart} barSize={40}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => Number(value)} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {medicationChart.map((entry, index) => (
                      <Cell key={`med-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Doctors: Active vs Inactive">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={doctorChart} dataKey="value" nameKey="name" outerRadius={100} label>
                    {doctorChart.map((_, i) => <Cell key={`d-cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Nurses: Active vs Inactive">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={nurseChart} dataKey="value" nameKey="name" outerRadius={100} label>
                    {nurseChart.map((_, i) => <Cell key={`n-cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Patients: Hospitalized vs Not">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={hospitalizedChart} dataKey="value" nameKey="name" outerRadius={100} label>
                    {hospitalizedChart.map((_, i) => <Cell key={`p-cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card></Col>

            <Col xs={24} md={12}><Card title="Patients by City & Country">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patientLocationChart} barSize={40}>
                  <XAxis dataKey="location" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" />
                  <YAxis tickFormatter={(value) => Number(value)} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count">
                    {patientLocationChart.map((entry, index) => (
                      <Cell key={`pat-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card></Col>

          </Row>
        </>
      )}
    </div>
  );
}
