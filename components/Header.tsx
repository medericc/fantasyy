'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

type UserData = {
  pseudo: string | null;
};

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight">Fantasy LFB</span>
          </Link>

          {/* Avatar cliquable qui ouvre directement la modale */}
          <button
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
            onClick={() => setShowLogoutModal(true)}
          >
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full border"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 border">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Modale de déconnexion */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-500" />
              <span>Déconnexion</span>
            </DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment vous déconnecter, {pseudo || 'utilisateur'} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutModal(false);
                signOut();
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Au revoir !</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
