'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

// Language options interface
interface LanguageOption {
  code: string;
  name: string;
  flag: string; // Unicode flag emoji
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { cartCount } = useCart();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Cross Board</Link>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          {/* Navigation Links */}
          <Link href="/favorites" className="hover:text-blue-600">
            ❤️ Favorites
          </Link>
          <Link href="/cart" className="hover:text-blue-600 relative">
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
          <Link href="/signup" className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
} 