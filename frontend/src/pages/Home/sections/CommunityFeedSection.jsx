import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RecipeCard from '../../../components/common/RecipeCard';
import api from '../../../services/api';

const PLACEHOLDER = [
  { _id: '5', title: 'Miso Ramen', description: 'Rich umami broth with handmade noodles and soft-boiled egg', coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', cookTime: 45, rating: 4.7, author: { username: 'David Lee', avatar: '' } },
  { _id: '6', title: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, basil and balsamic', coverImage: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', cookTime: 15, rating: 4.5, author: { username: 'Nadia Amari', avatar: '' } },
  { _id: '7', title: 'Risotto Milanese', description: 'Creamy saffron-infused Italian rice cooked to perfection', coverImage: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop', cookTime: 40, rating: 4.6, author: { username: 'Alex Rivera', avatar: '' } },
  { _id: '8', title: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers', coverImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', cookTime: 30, rating: 4.9, author: { username: 'Claire Dupont', avatar: '' } },
];

export default function CommunityFeedSection() {
  const [posts, setPosts] = useState(PLACEHOLDER);

  useEffect(() => {
    api.get('/posts?sort=latest&limit=4')
      .then((res) => {
        if (res.data?.data?.length) setPosts(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">
              From the Community
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Latest recipes shared by our members
            </p>
          </div>
          <Link
            to="/explore?sort=latest"
            className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          >
            See More <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post) => (
            <RecipeCard key={post._id} recipe={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
