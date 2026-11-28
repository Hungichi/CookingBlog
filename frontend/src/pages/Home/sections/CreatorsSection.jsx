import { useEffect, useState } from 'react';
import CreatorCard from '../../../components/common/CreatorCard';
import api from '../../../services/api';

const PLACEHOLDER = [
  { _id: '1', username: 'Maria Chen', bio: 'Italian & Asian fusion lover', avatar: '', postCount: 42 },
  { _id: '2', username: 'James Park', bio: 'BBQ pitmaster & grill expert', avatar: '', postCount: 38 },
  { _id: '3', username: 'Sarah Kim', bio: 'Artisan baker & pastry chef', avatar: '', postCount: 31 },
  { _id: '4', username: 'David Lee', bio: 'Ramen enthusiast from Tokyo', avatar: '', postCount: 27 },
];

export default function CreatorsSection() {
  const [creators, setCreators] = useState(PLACEHOLDER);

  useEffect(() => {
    api.get('/users/top-creators?limit=4')
      .then((res) => {
        if (res.data?.data?.length) setCreators(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">
            Top Creators
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Follow talented home cooks and chefs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {creators.map((creator) => (
            <CreatorCard key={creator._id} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
}
