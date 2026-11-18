import HeroSection from './sections/HeroSection';
import FeaturedSection from './sections/FeaturedSection';
import CategoriesSection from './sections/CategoriesSection';
import CommunityFeedSection from './sections/CommunityFeedSection';
import CreatorsSection from './sections/CreatorsSection';
import StoriesSection from './sections/StoriesSection';
import CTASection from './sections/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <CommunityFeedSection />
      <CreatorsSection />
      <StoriesSection />
      <CTASection />
    </>
  );
}
