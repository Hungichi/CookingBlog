import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import RecipeCard from '../../components/common/RecipeCard';

const PLACEHOLDER_CATEGORIES = [
  { _id: '1', name: 'Món Việt', description: 'Các món ăn truyền thống Việt Nam', imageUrl: '' },
  { _id: '2', name: 'Món Á', description: 'Ẩm thực châu Á phong phú', imageUrl: '' },
  { _id: '3', name: 'Món Âu', description: 'Hương vị phương Tây', imageUrl: '' },
  { _id: '4', name: 'Tráng miệng', description: 'Bánh ngọt và đồ tráng miệng', imageUrl: '' },
  { _id: '5', name: 'Đồ uống', description: 'Nước ép, sinh tố và cocktail', imageUrl: '' },
  { _id: '6', name: 'Ăn chay', description: 'Món chay dinh dưỡng', imageUrl: '' },
  { _id: '7', name: 'Healthy', description: 'Món ăn lành mạnh', imageUrl: '' },
  { _id: '8', name: 'Ăn vặt', description: 'Snack và món ăn vặt', imageUrl: '' },
];

const PLACEHOLDER_POSTS = [
  { _id: '1', title: 'Phở Bò Hà Nội', description: 'Công thức phở bò truyền thống', cookTime: 120, rating: 4.8, coverImage: '', author: { username: 'Chef Minh', avatar: '' } },
  { _id: '2', title: 'Bún Bò Huế', description: 'Bún bò cay nồng đặc trưng Huế', cookTime: 90, rating: 4.7, coverImage: '', author: { username: 'Foodie Mai', avatar: '' } },
  { _id: '3', title: 'Bánh Xèo', description: 'Bánh xèo giòn rụm miền Tây', cookTime: 40, rating: 4.5, coverImage: '', author: { username: 'Chef Hùng', avatar: '' } },
];

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => setCategories(PLACEHOLDER_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const list = loading ? [] : (categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES);

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-secondary text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Danh mục</h1>
          <p className="text-cream-dark mt-3 max-w-xl mx-auto">
            Khám phá công thức theo từng danh mục yêu thích
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-[4/3] bg-cream-dark" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-cream-dark rounded w-2/3" />
                  <div className="h-3 bg-cream-dark rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-cream-dark">
                  <img
                    src={cat.imageUrl || `https://placehold.co/400x300/F0EBE3/B85C38?text=${encodeURIComponent(cat.name)}`}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, postsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/posts', { params: { categoryId: id, limit: 20 } }),
        ]);
        const found = (catRes.data.data || []).find((c) => c._id === id);
        setCategory(found || { name: 'Danh mục', description: '' });
        setPosts(postsRes.data.data || []);
      } catch {
        setCategory({ name: 'Danh mục', description: '' });
        setPosts(PLACEHOLDER_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-secondary text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link to="/categories" className="text-cream-dark hover:text-white text-sm transition-colors">
            ← Tất cả danh mục
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-3">
            {category?.name || 'Đang tải...'}
          </h1>
          {category?.description && (
            <p className="text-cream-dark mt-3 max-w-xl mx-auto">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-cream-dark" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-cream-dark rounded w-3/4" />
                  <div className="h-3 bg-cream-dark rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Chưa có bài viết nào trong danh mục này</p>
            <Link to="/explore" className="mt-4 inline-block text-primary hover:underline text-sm">
              Khám phá tất cả
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <RecipeCard key={post._id} recipe={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { id } = useParams();
  return id ? <CategoryDetail /> : <CategoryList />;
}
