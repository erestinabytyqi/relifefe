'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin, Tabs, Descriptions } from 'antd';
import { useParams } from 'next/navigation';

const { Title } = Typography;
const { TabPane } = Tabs;

export default function PatientDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://localhost:7023/api/PatientRegisters/${id}`);
        if (!res.ok) throw new Error('Failed to fetch patient');
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmergencyContacts = async () => {
      try {
        const res = await fetch(`https://localhost:7023/api/PatientEmergencyContacts/patient/${id}`);
        if (!res.ok) throw new Error('Failed to fetch emergency contacts');
        const data = await res.json();
        setEmergencyContacts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchPatient();
      fetchEmergencyContacts();
    }
  }, [id]);

  if (loading) return <Spin tip="Loading patient details..." />;
  if (!patient) return <p>Patient not found.</p>;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Patient Details</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="General Information" key="1">
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Full Name">{patient.patientName} {patient.patientLastName}</Descriptions.Item>
            <Descriptions.Item label="Identification">{patient.patientIdentification}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{patient.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Gender">{patient.gender}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">{patient.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Email">{patient.email}</Descriptions.Item>
            <Descriptions.Item label="Address">{patient.address}</Descriptions.Item>
            <Descriptions.Item label="City">{patient.city}</Descriptions.Item>
            <Descriptions.Item label="Region">{patient.region}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">{patient.postalCode}</Descriptions.Item>
            <Descriptions.Item label="Country">{patient.country}</Descriptions.Item>
            <Descriptions.Item label="Hospitalized">{patient.isHospitilized ? 'Yes' : 'No'}</Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Emergency Contacts" key="2">
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <Descriptions key={index} bordered column={1} size="middle" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Full Name">{contact.emergencyContactName} {contact.emergencyContactLastName}</Descriptions.Item>
                <Descriptions.Item label="Relationship">{contact.emergencyContactRelatinship}</Descriptions.Item>
                <Descriptions.Item label="Phone">{contact.emergencyContactPhone}</Descriptions.Item>
                <Descriptions.Item label="Email">{contact.emergencyContactEmail}</Descriptions.Item>
                <Descriptions.Item label="Active Guardian">{contact.isActiveGuardian ? 'Yes' : 'No'}</Descriptions.Item>
                <Descriptions.Item label="Is Patient Here">{contact.isPatientHere ? 'Yes' : 'No'}</Descriptions.Item>
              </Descriptions>
            ))
          ) : (
            <p>No emergency contact available.</p>
          )}
        </TabPane>

        <TabPane tab="Reports" key="3">
          <p>No reports available yet.</p>
        </TabPane>

        <TabPane tab="Documents" key="4">
          <p>No documents uploaded.</p>
        </TabPane>
      </Tabs>
    </div>
  );
}
