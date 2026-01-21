import Welcome from '../../components/Welcome';
import Featured from '../../components/featured';
import Role from '../../components/Role';
import Company from '../../components/companies';
import Footer from '../../components/Footer';
import Stats from '../../components/Stats';
import Chatboticon from '../../components/chatboticon';
import CTASection from '../../components/cta';
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <Welcome />
      
      {/* Stats Section */}
      <Stats />
      
      {/* Browse by Category */}
      <Role />
      
      {/* Featured Companies */}
      <Company />
        {/* Featured Jobs */}
      <Featured />
      <Chatboticon/>
      {/* Footer */}
      
      <Footer />
    </div>
  );
};

export default Home;