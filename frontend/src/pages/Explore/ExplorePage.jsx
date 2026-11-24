import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiSliders } from 'react-icons/fi';
import api from '../../services/api';
import RecipeCard from '../../components/common/RecipeCard';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến' },
  { value: 'rating', label: 'Đánh giá cao' },
];

const TYPE_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'recipe', label: 'Công thức' },
  { value: 'story', label: 'Câu chuyện' },
];

const PLACEHOLDER_POSTS = [
  { _id: '1', title: 'Phở Bò Hà Nội', description: 'Công thức phở bò truyền thống Hà Nội', cookTime: 120, rating: 4.8, coverImage: '', author: { username: 'Chef Minh', avatar: '' } },
  { _id: '2', title: 'Bánh Mì Sài Gòn', description: 'Bánh mì giòn rụm kiểu Sài Gòn', cookTime: 45, rating: 4.6, coverImage: '', author: { username: 'Foodie Mai', avatar: '' } },
  { _id: '3', title: 'Bún Chả Hà Nội', description: 'Bún chả thơm lừng khói than', cookTime: 60, rating: 4.9, coverImage: '', author: { username: 'Chef Hùng', avatar: '' } },
  { _id: '4', title: 'Cơm Tấm Sườn Bì', description: 'Cơm tấm sườn bì chả trứng', cookTime: 50, rating: 4.7, coverImage: '', author: { username: 'Lan Kitchen', avatar: '' } },
  { _id: '5', title: 'Gỏi Cuốn Tôm Thịt', description: 'Gỏi cuốn tươi mát ngày hè', cookTime: 30, rating: 4.5, coverImage: '', author: { username: 'Chef Minh', avatar: '' } },
  { _id: '6', title: 'Chè Bưởi', description: 'Chè bưởi mát lạnh giải nhiệt', cookTime: 40, rating: 4.3, coverImage: '', author: { username: 'Foodie Mai', avatar: '' } },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'latest';
  const categoryId = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (type) params.type = type;
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;

      const { data } = await api.get('/posts', { params });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch {
      setPosts(PLACEHOLDER_POSTS);
      setPagination({ page: 1, pages: 1, total: PLACEHOLDER_POSTS.length });
    } finally {
      setLoading(false);
    }
  }, [page, sort, type, search, categoryId]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    if (updates.page === undefined) params.delete('page');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-secondary text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-center">
            Khám phá công thức
          </h1>
          <p className="text-cream-dark text-center mt-3 max-w-xl mx-auto">
            Tìm kiếm hàng ngàn công thức nấu ăn và câu chuyện ẩm thực từ cộng đồng
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm công thức, nguyên liệu..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => updateParams({ type: tab.value })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  type === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-cream-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {categories.length > 0 && (
              <select
                value={categoryId}
                onChange={(e) => updateParams({ category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white text-sm text-gray-700 border border-cream-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiSliders size={14} />
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {search && (
          <p className="text-sm text-gray-500 mb-4">
            Kết quả cho "<span className="font-medium text-gray-700">{search}</span>"
            {!loading && ` — ${pagination.total} bài viết`}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-cream-dark" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-cream-dark rounded w-3/4" />
                  <div className="h-3 bg-cream-dark rounded w-full" />
                  <div className="h-3 bg-cream-dark rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Không tìm thấy bài viết nào</p>
            <button
              onClick={() => { setSearchInput(''); setSearchParams({}); }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <RecipeCard key={post._id} recipe={post} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParams({ page: String(p) })}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-cream-dark'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
