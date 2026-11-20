import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from './Dashboard/Dashboard';
import UserManagement from './UserManagement/UserManagement';
import PostManagement from './PostManagement/PostManagement';
import CommentModeration from './CommentModeration/CommentModeration';
import ReportManagement from './ReportManagement/ReportManagement';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="comments" element={<CommentModeration />} />
        <Route path="reports" element={<ReportManagement />} />
      </Route>
    </Routes>
  );
}