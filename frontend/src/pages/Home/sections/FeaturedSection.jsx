import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RecipeCard from '../../../components/common/RecipeCard';
import api from '../../../services/api';

const PLACEHOLDER_RECIPES = [
  { _id: '1', title: 'Pasta Carbonara', description: 'Classic Italian pasta with creamy egg sauce and crispy guanciale', coverImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', cookTime: 25, rating: 4.8, author: { username: 'Maria Chen', avatar: '' } },
  { _id: '2', title: 'Thai Green Curry', description: 'Fragrant coconut curry with fresh vegetables and aromatic herbs', coverImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop', cookTime: 35, rating: 4.6, author: { username: 'James Park', avatar: '' } },
  { _id: '3', title: 'Sourdough Bread', description: 'Artisan bread with a perfectly crispy crust and soft interior', coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', cookTime: 60, rating: 4.9, author: { username: 'Sarah Kim', avatar: '' } },
  { _id: '4', title: 'Acai Bowl', description: 'Refreshing blend of acai berries topped with granola and fresh fruit', coverImage: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', cookTime: 10, rating: 4.7, author: { username: 'Emma Wilson', avatar: '' } },
];

export default function FeaturedSection() {
  const [recipes, setRecipes] = useState(PLACEHOLDER_RECIPES);

  useEffect(() => {
    api.get('/posts?featured=true&limit=4')
      .then((res) => {
        if (res.data?.data?.length) setRecipes(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">
              Featured Recipes
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Handpicked by our community
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>

        <Link
          to="/explore"
          className="sm:hidden flex items-center justify-center gap-1 text-primary text-sm font-medium mt-6 hover:underline"
        >
          View All Recipes <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
