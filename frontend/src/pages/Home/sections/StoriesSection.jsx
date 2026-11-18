import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import FoodStoryCard from '../../../components/common/FoodStoryCard';
import api from '../../../services/api';

const PLACEHOLDER = [
  { _id: '1', title: 'The Art of Making Perfect Pasta from Scratch', description: 'A journey through Italian kitchens and the traditions behind handmade pasta', coverImage: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=225&fit=crop', author: { username: 'Maria Chen', avatar: '' } },
  { _id: '2', title: 'Street Food Adventures in Bangkok', description: 'Exploring the vibrant night markets and hidden food stalls of Thailand', coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=225&fit=crop', author: { username: 'James Park', avatar: '' } },
  { _id: '3', title: 'Farm to Table: A Weekend at the Organic Market', description: 'How local farmers are changing the way we think about fresh ingredients', coverImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=225&fit=crop', author: { username: 'Emma Wilson', avatar: '' } },
];

export default function StoriesSection() {
  const [stories, setStories] = useState(PLACEHOLDER);

  useEffect(() => {
    api.get('/posts?type=story&limit=3')
      .then((res) => {
        if (res.data?.data?.length) setStories(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">
              Food Stories
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Culinary tales from our community
            </p>
          </div>
          <Link
            to="/explore?type=story"
            className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          >
            All Stories <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stories.map((story) => (
            <FoodStoryCard key={story._id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
