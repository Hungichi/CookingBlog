import { useEffect, useState } from 'react';
import CategoryCard from '../../../components/common/CategoryCard';
import api from '../../../services/api';

const PLACEHOLDER_CATEGORIES = [
  { _id: '1', name: 'Italian', imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=200&h=200&fit=crop' },
  { _id: '2', name: 'Asian', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop' },
  { _id: '3', name: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  { _id: '4', name: 'Healthy', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { _id: '5', name: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop' },
  { _id: '6', name: 'Vegan', imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=200&h=200&fit=crop' },
  { _id: '7', name: 'BBQ', imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200&h=200&fit=crop' },
  { _id: '8', name: 'Seafood', imageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&h=200&fit=crop' },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState(PLACEHOLDER_CATEGORIES);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data?.data?.length) setCategories(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Find recipes that match your taste
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
