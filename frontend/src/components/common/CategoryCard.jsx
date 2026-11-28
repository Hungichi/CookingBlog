import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categories/${category._id || category.id}`}
      className="group flex flex-col items-center gap-3"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cream-dark group-hover:border-primary transition-colors">
        <img
          src={category.imageUrl || 'https://placehold.co/96x96/F0EBE3/B85C38?text=' + category.name?.charAt(0)}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
