import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold">Real Estate Pro</h3>
            </div>
            <p className="text-gray-400 mb-4">
              {language === 'pt' 
                ? 'Sua parceira de confiança no mercado imobiliário português. Encontre a casa dos seus sonhos conosco.'
                : 'Your trusted partner in Portuguese real estate market. Find your dream home with us.'}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {language === 'pt' ? 'Links Rápidos' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Início' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Propriedades' : 'Properties'}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Favoritos' : 'Favorites'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Sobre Nós' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Contacto' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {language === 'pt' ? 'Legal' : 'Legal'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Termos de Serviço' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Política de Cookies' : 'Cookie Policy'}
                </Link>
              </li>
              <li>
                <Link to="/data-protection" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Proteção de Dados (RGPD)' : 'Data Protection (GDPR)'}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition-colors">
                  {language === 'pt' ? 'Aviso Legal' : 'Legal Disclaimer'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {language === 'pt' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Av. da Liberdade 123<br />
                  1250-096 Lisboa, Portugal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="tel:+351210000000" className="hover:text-white transition-colors">
                  +351 21 000 0000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <a href="mailto:info@realestatepro.pt" className="hover:text-white transition-colors">
                  info@realestatepro.pt
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Real Estate Pro. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/accessibility" className="hover:text-white transition-colors">
                {language === 'pt' ? 'Acessibilidade' : 'Accessibility'}
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                {language === 'pt' ? 'Mapa do Site' : 'Sitemap'}
              </Link>
              <button className="hover:text-white transition-colors">
                {language === 'pt' ? 'Preferências de Cookies' : 'Cookie Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
