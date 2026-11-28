import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
          Ready to Share Your Culinary Story?
        </h2>
        <p className="text-gray-400 mt-4 max-w-lg mx-auto text-base">
          Join our community of food lovers. Share recipes, discover new flavors,
          and connect with people who share your passion.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/explore"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Explore Recipes
          </Link>
        </div>
      </div>
    </section>
  );
}
