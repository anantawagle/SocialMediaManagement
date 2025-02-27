import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">SmartSocial</div>
          <div className="flex space-x-6">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">How It Works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Testimonials</a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Benefits</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Contact</a>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 animate__animated animate__bounceIn animate__delay-1s"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-full hover:from-blue-600 hover:to-blue-800 transition-transform duration-300 transform hover:scale-105 animate__animated animate__bounceIn animate__delay-2s"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-32 pt-40">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 animate__animated animate__fadeIn animate__delay-1s">
            Elevate Your Social Media with SmartSocial
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 animate__animated animate__fadeIn animate__delay-2s">
            Harness AI to create, schedule, and analyze your posts effortlessly.
          </p>
          <div className="space-x-4 animate__animated animate__fadeIn animate__delay-3s">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-transform duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeIn">Why Choose SmartSocial?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div data-aos="slide-left" className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-3">Smart Scheduling</h3>
              <p className="text-gray-600">Plan and automate posts across platforms with precision timing.</p>
            </div>
            <div data-aos="slide-right" className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Content</h3>
              <p className="text-gray-600">Create captivating posts and visuals with cutting-edge AI.</p>
            </div>
            <div data-aos="slide-left" className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-blue-600 text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Insightful Analytics</h3>
              <p className="text-gray-600">Track performance and optimize your strategy with real data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How SmartSocial Works Section - Static and Stylish */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-16 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            How SmartSocial Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-600">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">1</div>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Sign Up & Connect</h3>
              <p className="text-gray-600 text-lg">
                Start by creating your SmartSocial account. Seamlessly connect your social media profiles in just a few clicks, setting the stage for effortless management.
              </p>
            </div>
            <div className="relative bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-600">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">2</div>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Generate Content</h3>
              <p className="text-gray-600 text-lg">
                Leverage our cutting-edge AI to craft compelling posts and stunning visuals tailored to your brand’s voice and audience preferences.
              </p>
            </div>
            <div className="relative bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-600">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">3</div>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Schedule & Analyze</h3>
              <p className="text-gray-600 text-lg">
                Schedule your content to go live at optimal times and dive into detailed analytics to refine your strategy and boost engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeIn">Benefits of SmartSocial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div data-aos="slide-left" className="bg-blue-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Save Time</h3>
              <p className="text-gray-600">Automate repetitive tasks and focus on growing your business.</p>
            </div>
            <div data-aos="slide-right" className="bg-blue-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Boost Engagement</h3>
              <p className="text-gray-600">Create content that resonates with your audience effortlessly.</p>
            </div>
            <div data-aos="slide-left" className="bg-blue-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Stay Consistent</h3>
              <p className="text-gray-600">Maintain a steady posting schedule without the hassle.</p>
            </div>
            <div data-aos="slide-right" className="bg-blue-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Data-Driven Growth</h3>
              <p className="text-gray-600">Use analytics to refine your strategy and maximize impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeIn">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div data-aos="slide-left" className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"SmartSocial transformed how I manage my social media—AI content is a lifesaver!"</p>
              <p className="text-gray-800 font-bold">- Sarah K., Small Business Owner</p>
            </div>
            <div data-aos="slide-right" className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"The scheduling feature keeps my posts on point without the stress."</p>
              <p className="text-gray-800 font-bold">- Mike T., Marketing Manager</p>
            </div>
            <div data-aos="slide-left" className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Analytics helped me double my engagement in just weeks!"</p>
              <p className="text-gray-800 font-bold">- Emily R., Content Creator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 animate__animated animate__fadeIn">Ready to Transform Your Social Media?</h2>
          <p className="text-xl mb-10 animate__animated animate__fadeIn animate__delay-1s">
            Join thousands of users leveraging SmartSocial to simplify and supercharge their online presence.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-blue-50 transition-transform duration-300 transform hover:scale-105 animate__animated animate__fadeIn animate__delay-2s"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeIn">Get in Touch</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-8 animate__animated animate__fadeIn animate__delay-1s">
              Have questions or need support? Reach out to our team—we’re here to help you succeed!
            </p>
            <div data-aos="slide-right">
              <a href="mailto:support@smartsocial.com" className="text-blue-600 text-xl font-bold hover:underline">
                support@smartsocial.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© 2025 SmartSocial. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;