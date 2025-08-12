// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - First Pick",
  description: "Connectez-vous pour gérer votre équipe First Pick.",
};

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900">
      <SignIn
        appearance={{
          layout: {
            logoPlacement: "outside",
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "blockButton",
          },
          elements: {
            rootBox:
              "shadow-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6",
            formButtonPrimary:
              "bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-lg transition-all",
            socialButtonsBlockButton:
              "border border-neutral-700 hover:bg-neutral-800 transition-colors",
            headerTitle: "text-2xl font-bold text-yellow-400",
            headerSubtitle: "text-neutral-400",
            footerActionLink: "text-yellow-400 hover:text-yellow-300",
            formFieldInput:
              "bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-yellow-400",
          },
        }}
      />
    </div>
  );
}
