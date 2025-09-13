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

export default function PrivacyPolicyPage() {
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
        .content-section {
          max-width: 4xl;
          margin: 0 auto;
        }
        .policy-section {
          margin-bottom: 3rem;
        }
        .policy-section h3 {
          color: #ec4899;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .policy-section p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .policy-section ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-section li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
      `}</style>
      
      <div className="flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300 h-20 flex items-center">
          <div className="w-full flex items-center justify-between p-4 sm:px-6">
            <button onClick={() => navigate('/')} className="flex items-center">
              <img src="/logo.png" alt="Pairly Logo" className="h-28 w-auto" />
            </button>
            
            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <button onClick={() => navigate('/#home')} className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Home</button>
              <button onClick={() => navigate('/#features')} className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Features</button>
              <button onClick={() => navigate('/#how-it-works')} className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">How It Works</button>
              <button onClick={() => navigate('/#testimonials')} className="text-gray-600 hover:text-pink-500 transition-colors duration-300 font-medium">Testimonials</button>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.pairluv.app&hl=en_IN', '_blank')}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors duration-300"
              >
                Download
              </button>
            </div>
            <button className="md:hidden p-2" id="menu-button">
              <i data-lucide="menu" className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden fixed inset-0 bg-white z-50">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center">
              <img src="/logo.png" alt="Pairly Logo" className="h-16 w-auto" />
            </div>
            <button id="close-menu-button" className="p-2">
              <i data-lucide="x" className="w-8 h-8 text-gray-800" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-2xl px-6">
            <button onClick={() => navigate('/#home')} className="menu-link text-gray-800 hover:text-pink-500 transition-colors duration-300">Home</button>
            <button onClick={() => navigate('/#features')} className="menu-link text-gray-800 hover:text-pink-500 transition-colors duration-300">Features</button>
            <button onClick={() => navigate('/#how-it-works')} className="menu-link text-gray-800 hover:text-pink-500 transition-colors duration-300">How It Works</button>
            <button onClick={() => navigate('/#testimonials')} className="menu-link text-gray-800 hover:text-pink-500 transition-colors duration-300">Testimonials</button>
            <button 
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.pairluv.app&hl=en_IN', '_blank')}
              className="menu-link bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 mt-4 rounded-full transition-colors duration-300"
            >
              Download
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <main className="pt-20">
          {/* Privacy Policy Section */}
          <section className="section bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="content-section">
                <h1 className="section-title text-gray-900">Privacy Policy</h1>
                <p className="text-center text-gray-600 mb-8">Last updated: January 2025</p>

                <div className="policy-section">
                  <h3>1. Introduction</h3>
                  <p>Welcome to Pairly (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy and ensuring you have a positive experience on our dating platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.</p>
                  <p>By using Pairly, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.</p>
                </div>

                <div className="policy-section">
                  <h3>2. Information We Collect</h3>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h4>
                  <ul className="list-disc">
                    <li>Profile information (name, age, photos, bio, interests)</li>
                    <li>Contact information (email address, phone number)</li>
                    <li>Location data (with your consent)</li>
                    <li>Communication preferences</li>
                    <li>Payment information (for premium features)</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">Usage Information</h4>
                  <ul className="list-disc">
                    <li>App usage patterns and interactions</li>
                    <li>Messages and communications between users</li>
                    <li>Matching preferences and behavior</li>
                    <li>Device information and app performance data</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>3. How We Use Your Information</h3>
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc">
                    <li>Creating and managing your user profile</li>
                    <li>Providing matching and recommendation services</li>
                    <li>Facilitating communication between users</li>
                    <li>Improving our app functionality and user experience</li>
                    <li>Providing customer support and responding to inquiries</li>
                    <li>Ensuring platform safety and preventing abuse</li>
                    <li>Processing payments for premium features</li>
                    <li>Sending important updates and notifications</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>4. Information Sharing and Disclosure</h3>
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
                  <ul className="list-disc">
                    <li><strong>With other users:</strong> Your profile information is visible to other users as part of the matching process</li>
                    <li><strong>Service providers:</strong> We may share data with trusted third-party service providers who assist us in operating our platform</li>
                    <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                    <li><strong>Business transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>5. Data Security</h3>
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Monitoring for suspicious activities</li>
                    <li>Secure data storage practices</li>
                  </ul>
                  <p>However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                </div>

                <div className="policy-section">
                  <h3>6. Your Privacy Rights</h3>
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Restriction:</strong> Request limitation of data processing</li>
                  </ul>
                  <p>To exercise these rights, please contact us at privacy@pairly.com</p>
                </div>

                <div className="policy-section">
                  <h3>7. Location Services</h3>
                  <p>Pairly may request access to your location to provide location-based matching services. You can control location permissions through your device settings. We use location data to:</p>
                  <ul className="list-disc">
                    <li>Show nearby potential matches</li>
                    <li>Provide location-based recommendations</li>
                    <li>Improve matching accuracy</li>
                  </ul>
                  <p>Location data is processed securely and can be disabled at any time.</p>
                </div>

                <div className="policy-section">
                  <h3>8. Cookies and Tracking Technologies</h3>
                  <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                  <ul className="list-disc">
                    <li>Essential cookies for app functionality</li>
                    <li>Analytics cookies to understand usage patterns</li>
                    <li>Advertising cookies for personalized content</li>
                    <li>Security cookies to protect against fraud</li>
                  </ul>
                  <p>You can manage cookie preferences through your device settings.</p>
                </div>

                <div className="policy-section">
                  <h3>9. Age Restrictions</h3>
                  <p>Pairly is intended for users who are 18 years of age or older. We do not knowingly collect personal information from individuals under 18. If you believe we have collected information from someone under 18, please contact us immediately.</p>
                </div>

                <div className="policy-section">
                  <h3>10. International Data Transfers</h3>
                  <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.</p>
                </div>

                <div className="policy-section">
                  <h3>11. Changes to This Policy</h3>
                  <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.</p>
                </div>

                <div className="policy-section">
                  <h3>12. Contact Us</h3>
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                  <ul className="list-none">
                    <li><strong>Email:</strong> privacy@pairly.com</li>
                    <li><strong>Address:</strong> Pairly Inc., 123 Dating Street, Love City, LC 12345</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                  </ul>
                </div>

                <div className="mt-12 text-center">
                  <button onClick={() => navigate('/')} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center">
                    <i data-lucide="arrow-left" className="w-5 h-5 mr-2" />
                    Back to Home
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
            <p>&copy; 2025 Pairly. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
