import RoleProtectedPage from '../../components/RoleProtectedPage';

export default function DashboardPage() {
  return (
    <RoleProtectedPage allowedRoles={['doctor', 'nurse']}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-700">Welcome to your dashboard.</p>
      </div>
    </RoleProtectedPage>
  );
}
