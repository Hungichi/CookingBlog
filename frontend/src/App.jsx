import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import AdminRoutes from './pages/Admin/AdminRoutes';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;