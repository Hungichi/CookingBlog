import { Link } from 'react-router-dom';

export default function FoodStoryCard({ story }) {
  return (
    <Link
      to={`/story/${story._id || story.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={story.coverImage || 'https://placehold.co/400x225/F0EBE3/B85C38?text=Story'}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded">
          Food Story
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{story.description}</p>
        {story.author && (
          <div className="flex items-center gap-2 mt-3">
            <img
              src={story.author.avatar || 'https://placehold.co/24x24/F0EBE3/B85C38?text=U'}
              alt={story.author.username}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500">{story.author.username}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
