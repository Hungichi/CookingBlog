import { Link } from 'react-router-dom';
import { FiClock, FiStar, FiBookmark } from 'react-icons/fi';

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe._id || recipe.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.coverImage || 'https://placehold.co/400x300/F0EBE3/B85C38?text=Recipe'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <FiBookmark size={16} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={12} />
            <span>{recipe.cookTime || 30} min</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <FiStar size={12} fill="currentColor" />
            <span>{recipe.rating || '4.5'}</span>
          </div>
        </div>

        {recipe.author && (
          <div className="flex items-center gap-2 mt-3">
            <img
              src={recipe.author.avatar || 'https://placehold.co/24x24/F0EBE3/B85C38?text=U'}
              alt={recipe.author.username}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500">{recipe.author.username}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
