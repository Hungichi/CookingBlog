import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import AdminRoutes from './pages/Admin/AdminRoutes';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoriesPage />} />
      </Route>

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;