'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12 px-6 py-8 border-t">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>

      {/* Liens */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm flex-wrap">
        <Link href="/privacy" className="hover:underline text-gray-800">
          Politique de confidentialité
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/terms" className="hover:underline text-gray-800">
          Conditions d’utilisation
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/legal" className="hover:underline text-gray-800">
          Mentions légales
        </Link>

        <span className="hidden sm:inline">|</span>

        <a
          href="https://instagram.com/firstpick46"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-800"
        >
          Contact Instagram
        </a>
      </div>

      {/* Copyright */}
      <p className="mt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} First Pick – Tous droits réservés.
      </p>
    </footer>
  );
}
