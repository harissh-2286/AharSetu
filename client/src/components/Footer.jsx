import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="glass-panel border-t border-white/5 pt-16 pb-8 mt-auto backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/25 border border-emerald-500/30">
                <HeartHandshake className="h-6 w-6 text-emerald-400" />
              </div>
              <span class="font-extrabold text-2xl tracking-wider text-slate-100 font-sans">
                Ahar<span class="text-emerald-400">Setu</span>
              </span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Empowering communities to reduce food waste and alleviate hunger. Connecting excess food sources directly with NGOs and shelters via our smart logistics network.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <a href="#" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div class="space-y-4">
            <h3 class="text-base font-bold text-slate-100 tracking-wider font-sans uppercase">Quick Directory</h3>
            <ul class="space-y-2.5 text-sm">
              <li>
                <Link to="/" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Home Landing</Link>
              </li>
              <li>
                <Link to="/about" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">About Our Mission</Link>
              </li>
              <li>
                <Link to="/live-listings" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Live Surplus Listings</Link>
              </li>
              <li>
                <Link to="/gallery" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Distribution Gallery</Link>
              </li>
              <li>
                <Link to="/testimonials" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Impact Testimonials</Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div class="space-y-4">
            <h3 class="text-base font-bold text-slate-100 tracking-wider font-sans uppercase">Support & Safety</h3>
            <ul class="space-y-2.5 text-sm">
              <li>
                <Link to="/faq" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/contact" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Contact Help Desk</Link>
              </li>
              <li>
                <a href="#" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Food Safety Guidelines</a>
              </li>
              <li>
                <a href="#" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Terms of Service</a>
              </li>
              <li>
                <a href="#" class="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div class="space-y-4">
            <h3 class="text-base font-bold text-slate-100 tracking-wider font-sans uppercase">Central HQ</h3>
            <ul class="space-y-3.5 text-sm">
              <li class="flex items-start gap-2.5 text-slate-400">
                <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>AharSetu Central Office,<br />Connaught Place, New Delhi - 110001</span>
              </li>
              <li class="flex items-center gap-2.5 text-slate-400">
                <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>+91 11 4321 0987</span>
              </li>
              <li class="flex items-center gap-2.5 text-slate-400">
                <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>support@aharsetu.org</span>
              </li>
              <li class="flex items-center gap-2.5 text-slate-400">
                <Globe className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>www.aharsetu.org</span>
              </li>
            </ul>
          </div>
        </div>

        <hr class="border-white/10 my-8" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {currentYear} AharSetu. All rights reserved. Powered by Advanced AI Recovery Networks.</p>
          <div class="flex items-center gap-6">
            <a href="#" class="hover:text-emerald-400 transition-colors">Safety Code</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">CSR Compliance</a>
            <a href="#" class="hover:text-emerald-400 transition-colors">NGO Registry</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
