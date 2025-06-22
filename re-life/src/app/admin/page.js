import RoleProtectedPage from '../../components/RoleProtectedPage';

export default function AdminPage() {
  return (
    <RoleProtectedPage allowedRoles={['admin']}>
      <h1>Welcome Admin</h1>
    </RoleProtectedPage>
  );
}
