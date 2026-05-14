import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f0c29] text-gray-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand & Newsletter */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-extrabold text-white">
            E-<span className="text-purple-500">Learning</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Empowering learners worldwide with expert-led courses and flexible learning paths. Join our community today.
          </p>
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Subscribe to our newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 flex-grow"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            <li><Link to="/course/search?query" className="hover:text-purple-400 transition-colors">Our Courses</Link></li>
            <li><Link to="/careers" className="hover:text-purple-400 transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-bold mb-6">Support & Legal</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/help" className="hover:text-purple-400 transition-colors">Help Center</Link></li>
            <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/refund" className="hover:text-purple-400 transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 text-sm">
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-purple-500" />
            <span>support@elearning.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-purple-500" />
            <span>+1 (234) 567-890</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-purple-500" />
            <span>123 Learning Way, EdTech City</span>
          </div>
          <div className="flex gap-4 pt-4">
            <a href="#" className="hover:text-purple-400 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-purple-400 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-purple-400 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-purple-400 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
        >
          Back to Top ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
