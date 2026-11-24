import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { LuTimer, LuSignal, LuGlobe, LuLayoutGrid } from 'react-icons/lu';
import api from '../../services/api';
import RecipeCard from '../../components/common/RecipeCard';

const POPULAR_TAGS = ['Pasta', 'Healthy', 'Quick Meals', 'Desserts', 'Asian', 'Vegetarian'];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

const PLACEHOLDER_POSTS = [
  { _id: '1', title: 'Lemon Herb Salmon', description: 'Fresh salmon with herbs and citrus', cookTime: 25, ratingAvg: 4.8, ratingCount: 92, coverImage: 'https://images.unsplash.com/photo-1673436977947-0787164a9abc?w=400', author: { username: 'Emma Wilson', avatar: '' }, tags: ['seafood'], difficulty: 'easy', servings: 2 },
  { _id: '2', title: 'Mushroom Risotto', description: 'Creamy Italian risotto with wild mushrooms', cookTime: 40, ratingAvg: 4.7, ratingCount: 78, coverImage: 'https://images.unsplash.com/photo-1690195127088-4c33687723b5?w=400', author: { username: 'Marco Rossi', avatar: '' }, tags: ['italian'], difficulty: 'medium', servings: 4 },
  { _id: '3', title: 'Açaí Bowl', description: 'Refreshing açaí bowl with fresh toppings', cookTime: 10, ratingAvg: 4.9, ratingCount: 156, coverImage: 'https://images.unsplash.com/photo-1640126219893-6c869dbe9bd0?w=400', author: { username: 'Mia Santos', avatar: '' }, tags: ['healthy'], difficulty: 'easy', servings: 1 },
  { _id: '4', title: 'Beef Tacos', description: 'Authentic Mexican street tacos', cookTime: 30, ratingAvg: 4.6, ratingCount: 112, coverImage: 'https://images.unsplash.com/photo-1660820356928-4c361492f9a5?w=400', author: { username: 'Carlos Ruiz', avatar: '' }, tags: ['mexican'], difficulty: 'easy', servings: 4 },
  { _id: '5', title: 'Matcha Cheesecake', description: 'Japanese-inspired matcha cheesecake', cookTime: 90, ratingAvg: 4.8, ratingCount: 45, coverImage: 'https://images.unsplash.com/photo-1769655102909-e8dfef0835c0?w=400', author: { username: 'Yuki Tanaka', avatar: '' }, tags: ['dessert'], difficulty: 'hard', servings: 8 },
  { _id: '6', title: 'Chicken Pho', description: 'Vietnamese chicken noodle soup', cookTime: 60, ratingAvg: 4.7, ratingCount: 89, coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', author: { username: 'Linh Nguyen', avatar: '' }, tags: ['asian'], difficulty: 'medium', servings: 4 },
  { _id: '7', title: 'Avocado Toast', description: 'Simple and delicious avocado toast', cookTime: 10, ratingAvg: 4.5, ratingCount: 203, coverImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', author: { username: 'Sarah Lee', avatar: '' }, tags: ['healthy'], difficulty: 'easy', servings: 1 },
  { _id: '8', title: 'Tiramisu', description: 'Classic Italian coffee dessert', cookTime: 45, ratingAvg: 4.9, ratingCount: 167, coverImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', author: { username: 'Marco Rossi', avatar: '' }, tags: ['dessert'], difficulty: 'medium', servings: 6 },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [viewMode, setViewMode] = useState('grid');

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'latest';
  const categoryId = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (tag) params.search = tag;

      const { data } = await api.get('/posts', { params });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch {
      setPosts(PLACEHOLDER_POSTS);
      setPagination({ page: 1, pages: 1, total: PLACEHOLDER_POSTS.length });
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, categoryId, tag]);

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
    updateParams({ search: searchInput, tag: '' });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero - cream gradient */}
      <div className="py-12 sm:py-16" style={{ background: 'linear-gradient(180deg, #F0E8D8 0%, #F7F2E8 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-12 flex flex-col items-center gap-6">
          <h1 className="font-heading text-3xl sm:text-[40px] font-bold text-gray-900 text-center">
            Explore Recipes & Stories
          </h1>
          <p className="text-gray-500 text-center text-base max-w-xl">
            Search thousands of recipes from our community of food lovers
          </p>

          {/* Search Bar - white pill with shadow */}
          <form onSubmit={handleSearch} className="w-full max-w-[720px]">
            <div className="flex items-center gap-3 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-5 py-3.5">
              <FiSearch className="text-gray-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search recipes, stories, ingredients, or creators..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <span className="text-[13px] text-gray-400">Popular:</span>
            {POPULAR_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => updateParams({ tag: t, search: '' })}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  tag === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-12 py-4 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => updateParams({ category: e.target.value })}
                className="appearance-none flex items-center gap-1.5 pl-8 pr-8 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <LuLayoutGrid className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={15} />
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            {/* Cuisine Filter */}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <LuGlobe size={15} />
              <span>Cuisine</span>
              <FiChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Time Filter */}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <LuTimer size={15} />
              <span>Time</span>
              <FiChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Difficulty Filter */}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <LuSignal size={15} />
              <span>Difficulty</span>
              <FiChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="appearance-none pr-7 pl-3 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 bg-white focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort: {o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            {/* View Toggle */}
            <div className="flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg border ${viewMode === 'grid' ? 'bg-primary/10 border-primary/20 text-primary' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg border border-l-0 ${viewMode === 'list' ? 'bg-primary/10 border-primary/20 text-primary' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
              >
                <FiList size={16} />
              </button>
            </div>

            {/* Results Count */}
            <span className="text-[13px] text-gray-400 whitespace-nowrap">
              {loading ? '...' : `${pagination.total.toLocaleString()} results`}
            </span>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-12 py-8 sm:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-cream-dark" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-cream-dark rounded w-1/3" />
                  <div className="h-4 bg-cream-dark rounded w-3/4" />
                  <div className="h-3 bg-cream-dark rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No recipes found</p>
            <button
              onClick={() => { setSearchInput(''); setSearchParams({}); }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
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
