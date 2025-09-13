import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Extend Window interface for Lucide
declare global {
  interface Window {
    lucide: {
      createIcons: () => void;
    };
  }
}

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Mobile Menu Logic
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    const handleMenuOpen = () => {
      if (mobileMenu) mobileMenu.classList.remove('hidden');
    };

    const handleMenuClose = () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    };

    if (menuButton) {
      menuButton.addEventListener('click', handleMenuOpen);
    }

    if (closeMenuButton) {
      closeMenuButton.addEventListener('click', handleMenuClose);
    }
    
    menuLinks.forEach(link => {
      link.addEventListener('click', handleMenuClose);
    });

    // Scroll Animation Logic
    const scrollElements = document.querySelectorAll(".scroll-animate");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    scrollElements.forEach(el => {
      observer.observe(el);
    });

    // Cleanup
    return () => {
      if (menuButton) {
        menuButton.removeEventListener('click', handleMenuOpen);
      }
      if (closeMenuButton) {
        closeMenuButton.removeEventListener('click', handleMenuClose);
      }
      menuLinks.forEach(link => {
        link.removeEventListener('click', handleMenuClose);
      });
    };
  }, []);

  return (
    <>
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        html {
          scroll-behavior: smooth;
        }
        .section {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        .section-title {
          font-size: 2.25rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 4rem;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-animate.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      <div className="flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300 h-20 flex items-center">
          <div className="w-full flex items-center justify-between p-4 sm:px-6">
            <a href="#" className="flex items-center">
              <img src="/assets/landing/logo.png" alt="Pairly Logo" className="h-28 w-auto" />
            </a>
            
            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <a href="#home" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Home</a>
              <a href="#features" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Testimonials</a>
            </nav>
            
            <button className="md:hidden p-2" id="menu-button">
              <i data-lucide="menu" className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden fixed inset-0 bg-white z-50">
          <div className="flex justify-end p-6">
            <button id="close-menu-button">
              <i data-lucide="x" className="w-8 h-8 text-gray-800" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
            <a href="#home" className="menu-link text-gray-800 hover:text-pink-500">Home</a>
            <a href="#features" className="menu-link text-gray-800 hover:text-pink-500">Features</a>
            <a href="#how-it-works" className="menu-link text-gray-800 hover:text-pink-500">How It Works</a>
            <a href="#testimonials" className="menu-link text-gray-800 hover:text-pink-500">Testimonials</a>
          </nav>
        </div>

        {/* Main Content */}
        <main className="pt-20">
          {/* Hero Section */}
          <section id="home" className="min-h-[calc(100vh-5rem)] flex items-center relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  Find your <span className="text-pink-500">perfect</span> pair
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  Join Pairly to connect with people who share your interests. A new way to build meaningful relationships.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                  <button 
                    onClick={() => window.open('https://play.google.com/store/apps/details?id=com.pairluv.app&hl=en_IN', '_blank')}
                    className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-colors duration-300"
                  >
                    Download App
                  </button>
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-pink-500 border-2 border-pink-500 hover:bg-pink-50 transition-colors duration-300">
                    <i data-lucide="play-circle" className="w-6 h-6" />
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="mt-16 lg:mt-24 flex justify-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <img src="/assets/landing/app_interface.png" 
                     alt="Pairly App Screenshot" className="w-full max-w-4xl max-h-[600px] h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border border-gray-200" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="section bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title text-gray-900 scroll-animate">Why Pairly is Different</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 scroll-animate" style={{transitionDelay: '100ms'}}>
                  <div className="inline-block bg-pink-100 text-pink-500 p-4 rounded-full mb-4">
                    <i data-lucide="users" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Smart Matching</h3>
                  <p className="text-gray-600">Our advanced algorithm connects you with people who truly match your vibe and interests.</p>
                </div>
                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 scroll-animate" style={{transitionDelay: '200ms'}}>
                  <div className="inline-block bg-purple-100 text-purple-500 p-4 rounded-full mb-4">
                    <i data-lucide="message-square" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Instant Chat</h3>
                  <p className="text-gray-600">Once you match, start a conversation instantly. No waiting, just pure connection.</p>
                </div>
                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 scroll-animate" style={{transitionDelay: '300ms'}}>
                  <div className="inline-block bg-teal-100 text-teal-500 p-4 rounded-full mb-4">
                    <i data-lucide="shield-check" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Verified Profiles</h3>
                  <p className="text-gray-600">We prioritize your safety with a robust verification process for all profiles.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="section bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title text-gray-900 scroll-animate">Get Started in 3 Easy Steps</h2>
              <div className="relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
                <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Step 1 */}
                  <div className="text-center scroll-animate" style={{transitionDelay: '100ms'}}>
                    <div className="relative inline-block">
                      <div className="w-24 h-24 flex items-center justify-center bg-white border-2 border-pink-500 rounded-full text-3xl font-bold text-pink-500 mb-4 shadow-md">1</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Create Your Profile</h3>
                    <p className="text-gray-600">Sign up and build a profile that showcases your personality and what you&apos;re looking for.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="text-center scroll-animate" style={{transitionDelay: '200ms'}}>
                    <div className="relative inline-block">
                      <div className="w-24 h-24 flex items-center justify-center bg-white border-2 border-purple-500 rounded-full text-3xl font-bold text-purple-500 mb-4 shadow-md">2</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Find Matches</h3>
                    <p className="text-gray-600">Browse profiles, see who likes you, and use our smart filters to find your perfect pair.</p>
                  </div>
                  {/* Step 3 */}
                  <div className="text-center scroll-animate" style={{transitionDelay: '300ms'}}>
                    <div className="relative inline-block">
                      <div className="w-24 h-24 flex items-center justify-center bg-white border-2 border-teal-500 rounded-full text-3xl font-bold text-teal-500 mb-4 shadow-md">3</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Start Connecting</h3>
                    <p className="text-gray-600">Match with someone? Start a conversation and see where it goes!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="section bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title text-gray-900 scroll-animate">What Our Users Say</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 scroll-animate" style={{transitionDelay: '100ms'}}>
                  <p className="text-gray-700 mb-6">&ldquo;I was tired of swiping endlessly. Pairly helped me find someone with shared interests in just a few days. Highly recommended!&rdquo;</p>
                  <div className="flex items-center">
                    <img src="https://placehold.co/40x40/f3f4f6/111827?text=J" alt="User" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-gray-900">Jhanvi S.</p>
                      <p className="text-sm text-gray-500">Joined in 2024</p>
                    </div>
                  </div>
                </div>
                {/* Testimonial 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 scroll-animate" style={{transitionDelay: '200ms'}}>
                  <p className="text-gray-700 mb-6">&ldquo;The app is beautifully designed and so easy to use. I met my current partner here. Thank you, Pairly!&rdquo;</p>
                  <div className="flex items-center">
                    <img src="https://placehold.co/40x40/f3f4f6/111827?text=R" alt="User" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-gray-900">Ronak M.</p>
                      <p className="text-sm text-gray-500">Joined in 2023</p>
                    </div>
                  </div>
                </div>
                {/* Testimonial 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 scroll-animate" style={{transitionDelay: '300ms'}}>
                  <p className="text-gray-700 mb-6">&ldquo;Felt safe and secure from the start. The profile verification is a great feature. Finally, a dating app that cares.&rdquo;</p>
                  <div className="flex items-center">
                    <img src="https://placehold.co/40x40/f3f4f6/111827?text=S" alt="User" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-gray-900">Sarah K.</p>
                      <p className="text-sm text-gray-500">Joined in 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="cta" className="section bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-12 text-center scroll-animate">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Ready to Find Your Pair?</h2>
                <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">Join thousands of others who have found meaningful connections on Pairly. Download the app now and start your journey.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">                  
                  <button 
                    onClick={() => window.open('https://play.google.com/store/apps/details?id=com.pairluv.app&hl=en_IN', '_blank')}
                    className="bg-white text-pink-600 font-bold py-3 px-6 rounded-full inline-flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <i data-lucide="play" className="inline-block mr-2" /> Google Play
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-500 hover:text-pink-500"><i data-lucide="twitter" className="w-6 h-6" /></a>
              <a href="#" className="text-gray-500 hover:text-pink-500"><i data-lucide="instagram" className="w-6 h-6" /></a>
              <a href="#" className="text-gray-500 hover:text-pink-500"><i data-lucide="facebook" className="w-6 h-6" /></a>
              <a href="#" className="text-gray-500 hover:text-pink-500"><i data-lucide="linkedin" className="w-6 h-6" /></a>
            </div>
            <div className="flex justify-center space-x-6 mb-4 text-sm">
              <button onClick={() => navigate('/privacy-policy')} className="text-gray-500 hover:text-pink-500 transition-colors">Privacy Policy</button>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">Contact Us</a>
              <a href="/delete-user.html" className="text-gray-500 hover:text-pink-500 transition-colors">Delete Account</a>
            </div>
            <p>&copy; 2025 Pairly. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
