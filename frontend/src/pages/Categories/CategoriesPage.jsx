import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import RecipeCard from '../../components/common/RecipeCard';

const BG_COLORS = ['bg-amber-50', 'bg-orange-50', 'bg-yellow-50', 'bg-green-50', 'bg-rose-50', 'bg-blue-50', 'bg-purple-50', 'bg-teal-50'];

const PLACEHOLDER_CATEGORIES = [
  { _id: '1', name: 'Breakfast', description: 'Start your day right', imageUrl: 'https://images.unsplash.com/photo-1598976711774-205feb755bb7?w=400', count: 128 },
  { _id: '2', name: 'Lunch & Dinner', description: 'Hearty main courses', imageUrl: 'https://images.unsplash.com/photo-1607403218119-83b4df4c0959?w=400', count: 342 },
  { _id: '3', name: 'Desserts', description: 'Sweet treats', imageUrl: 'https://images.unsplash.com/photo-1705301698836-82acd5a5cb38?w=400', count: 215 },
  { _id: '4', name: 'Drinks', description: 'Refreshing beverages', imageUrl: 'https://images.unsplash.com/photo-1576505944072-9d22786cb600?w=400', count: 96 },
  { _id: '5', name: 'Healthy Food', description: 'Nutritious and delicious', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', count: 187 },
  { _id: '6', name: 'Asian Cuisine', description: 'Flavors from the East', imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', count: 264 },
  { _id: '7', name: 'Italian', description: 'Classic Mediterranean', imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400', count: 198 },
  { _id: '8', name: 'Quick Meals', description: 'Ready in 30 minutes', imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', count: 156 },
];

const PLACEHOLDER_POSTS = [
  { _id: '1', title: 'Lemon Herb Salmon', description: 'Fresh salmon with herbs', cookTime: 25, ratingAvg: 4.8, coverImage: 'https://images.unsplash.com/photo-1673436977947-0787164a9abc?w=400', author: { username: 'Emma Wilson', avatar: '' } },
  { _id: '2', title: 'Mushroom Risotto', description: 'Creamy Italian risotto', cookTime: 40, ratingAvg: 4.7, coverImage: 'https://images.unsplash.com/photo-1690195127088-4c33687723b5?w=400', author: { username: 'Marco Rossi', avatar: '' } },
  { _id: '3', title: 'Açaí Bowl', description: 'Refreshing açaí bowl', cookTime: 10, ratingAvg: 4.9, coverImage: 'https://images.unsplash.com/photo-1640126219893-6c869dbe9bd0?w=400', author: { username: 'Mia Santos', avatar: '' } },
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
      {/* Header - cream gradient */}
      <div className="py-12" style={{ background: 'linear-gradient(180deg, #F0E8D8 0%, #F7F2E8 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-12 text-center">
          <h1 className="font-heading text-3xl sm:text-[40px] font-bold text-gray-900">
            Food Categories
          </h1>
          <p className="text-gray-500 mt-3 text-base">
            Browse recipes by your favorite food categories
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-12 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-white">
                <div className="h-40 bg-cream-dark" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-cream-dark rounded w-2/3" />
                  <div className="h-3 bg-cream-dark rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((cat, i) => (
              <Link
                key={cat._id}
                to={`/categories/${cat._id}`}
                className={`group rounded-xl overflow-hidden hover:shadow-md transition-shadow ${BG_COLORS[i % BG_COLORS.length]}`}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={cat.imageUrl || `https://placehold.co/400x300/F0EBE3/B85C38?text=${encodeURIComponent(cat.name)}`}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {cat.count || '0'} recipes
                  </p>
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
        setCategory(found || { name: 'Category', description: '' });
        setPosts(postsRes.data.data || []);
      } catch {
        setCategory({ name: 'Category', description: '' });
        setPosts(PLACEHOLDER_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-12" style={{ background: 'linear-gradient(180deg, #F0E8D8 0%, #F7F2E8 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-12 text-center">
          <Link to="/categories" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← All Categories
          </Link>
          <h1 className="font-heading text-3xl sm:text-[40px] font-bold text-gray-900 mt-3">
            {category?.name || '...'}
          </h1>
          {category?.description && (
            <p className="text-gray-500 mt-3 text-base">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-12 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
            <p className="text-gray-400 text-lg">No recipes in this category yet</p>
            <Link to="/explore" className="mt-4 inline-block text-primary hover:underline text-sm">
              Explore all recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
