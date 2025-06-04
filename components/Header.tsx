'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type UserData = {
  pseudo: string | null;
};

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pseudo, setPseudo] = useState<string | null>(null);

  useEffect(() => {
    const fetchPseudo = async () => {
      if (!user?.id) return;

      const res = await fetch(`/api/user/${user.id}`);
      const data: UserData = await res.json();
      setPseudo(data.pseudo);
    };

    fetchPseudo();
  }, [user?.id]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* Logo gauche */}
     <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span className="text-xl font-bold">Mon App</span>
      </Link>

      {/* User info */}
      <div className="flex items-center gap-4">
        {/* Avatar Clerk */}
        {user?.imageUrl && (
          <Image
            src={user.imageUrl}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        {/* Pseudo */}
        <span className="font-medium text-gray-800">
          {pseudo ?? 'Chargement...'}
        </span>

        {/* Bouton déconnexion */}
        <button
          onClick={() => signOut()}
          className="text-sm text-red-500 hover:underline"
        >
          Se déconnecter
        </button>
      </div>
    </header>
  );
}
