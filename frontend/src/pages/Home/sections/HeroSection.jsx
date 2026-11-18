import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight">
              Where Every Meal Tells a Story
            </h1>
            <p className="text-gray-600 mt-4 text-base md:text-lg leading-relaxed max-w-md">
              Discover recipes, share culinary adventures, and connect with food
              lovers from around the world.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Explore Recipes
                <FiArrowRight size={18} />
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Share Yours
              </Link>
            </div>
          </div>

          {/* Right — image grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop"
                alt="Healthy salad"
                className="w-full rounded-xl object-cover h-48 md:h-56"
              />
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
                alt="Pizza"
                className="w-full rounded-xl object-cover h-32 md:h-40"
              />
            </div>
            <div className="space-y-3 pt-6">
              <img
                src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop"
                alt="Breakfast"
                className="w-full rounded-xl object-cover h-32 md:h-40"
              />
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop"
                alt="Gourmet dish"
                className="w-full rounded-xl object-cover h-48 md:h-56"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
