"use client";

import Link from 'next/link';
import Image from 'next/image';
import { sendMetaEvent } from "@/lib/meta-events";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-8 font-sans">
      <div className="container mx-auto px-6 max-w-[1500px]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Left Section - Brand */}
          <div className="md:col-span-1">
            <p className="text-white text-2xl font-medium tracking-tight leading-snug">
              Connecting people authentically and honestly
            </p>
            <div className="mt-6">
              <img src="/matchapp-logo-circular.png" alt="Klick Logo" className="w-16 h-16 object-cover rounded-full opacity-90 mb-4" />
              <p className="text-gray-400 text-xs leading-relaxed">
                Klick - The dating and matchmaking platform based on honesty, shared interests, and cultural exchange.
              </p>
            </div>
          </div>

          {/* Column 1: Planes de Citas */}
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200 uppercase tracking-wider">Dating Plans</h4>
            <ul className="text-gray-400 space-y-2.5 text-sm">
              <li>
                <Link href="/#planes" className="hover:text-white transition-colors">Klick</Link>
              </li>
              <li>
                <Link href="/#planes" className="hover:text-white transition-colors">Klick Pro</Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">Verified Profiles</Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">Affinity Algorithm</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Confianza y Legal */}
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200 uppercase tracking-wider">Trust & Legal</h4>
            <ul className="text-gray-400 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Klick</Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">Safe Dating Tips</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Comunidad y Soporte */}
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200 uppercase tracking-wider">Community & Support</h4>
            <ul className="text-gray-400 space-y-2.5 text-sm">
              <li>
                <Link href="/referrals" className="hover:text-white transition-colors">Referral Program</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Support Contact</Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white font-medium text-white transition-colors">User Portal</Link>
              </li>
              <li className="pt-3 flex flex-col gap-1 text-xs">
                <span className="text-gray-400 block">
                  💬 WhatsApp Support:{' '}
                  <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'Footer WhatsApp' })} className="text-blue-400 hover:underline">
                    WhatsApp Community
                  </a>
                </span>
                <span className="text-gray-400 block mt-1">
                  ✉️ <a href="https://mail.google.com/mail/?view=cm&fs=1&to=services@klick.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">services@klick.com</a>
                </span>
                <span className="text-gray-400 block">📍 Salt Lake City, Utah, USA</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Redes Sociales */}
          <div>
            <h4 className="font-medium mb-4 text-sm text-slate-200 uppercase tracking-wider">Follow Us</h4>
            <p className="text-gray-400 text-xs mb-4">
              Join our official social media communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.facebook.com/profile.php?id=61593817282601" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/f.jpg" alt="Facebook" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://www.instagram.com/match_app_/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/i.jpg" alt="Instagram" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'Footer Social Icon' })} className="hover:opacity-80 transition-opacity"><Image src="/assets/w.jpg" alt="Whatsapp" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/x.jpg" alt="X" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/y.jpg" alt="YouTube" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
              <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><Image src="/assets/t.jpg" alt="TikTok" width={32} height={32} style={{ height: 'auto' }} className="rounded-md" /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="items-center flex mt-16 pt-8 border-t border-white/10 flex-col md:flex-row gap-4">
          <Link href="/" className="text-white text-lg font-medium hover:text-white transition-colors tracking-tight">Klick</Link>
          <div className="flex justify-center space-x-6 w-full flex-wrap">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs">About Klick</Link>
            <Link href="/#planes" className="text-gray-400 hover:text-white transition-colors text-xs">Klick Plans</Link>
            <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-xs">Privacy</Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-xs">Terms & Conditions</Link>
          </div>
          <div className="text-gray-500 text-xs w-full text-center md:text-right">
            © {new Date().getFullYear()} SafeMeet.Ut LLC (KLICK!). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;