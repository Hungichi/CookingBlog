import { Link } from 'react-router-dom';

export default function CreatorCard({ creator }) {
  return (
    <Link
      to={`/profile/${creator._id || creator.id}`}
      className="group flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={creator.avatar || 'https://placehold.co/80x80/F0EBE3/B85C38?text=U'}
        alt={creator.username}
        className="w-16 h-16 rounded-full object-cover mb-3"
      />
      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
        {creator.username}
      </h4>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{creator.bio || 'Food enthusiast'}</p>
      <span className="text-xs text-primary font-medium mt-2">
        {creator.postCount || 0} recipes
      </span>
    </Link>
  );
}
