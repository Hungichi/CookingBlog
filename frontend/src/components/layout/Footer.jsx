import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { to: '/explore', label: 'All Recipes' },
      { to: '/categories', label: 'Categories' },
      { to: '/explore?sort=trending', label: 'Trending' },
      { to: '/explore?sort=latest', label: 'Latest' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: '/explore?type=story', label: 'Food Stories' },
      { to: '/explore?type=recipe', label: 'Top Recipes' },
      { to: '/saved', label: 'Saved Posts' },
      { to: '/notifications', label: 'Notifications' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact Us' },
      { to: '#', label: 'Privacy Policy' },
      { to: '#', label: 'Terms of Service' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary text-xl">&#9752;</span>
              <span className="font-heading font-bold text-lg">The Daily Plate</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A community for food lovers to share recipes and culinary stories from around the world.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-light mt-10 pt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} The Daily Plate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
