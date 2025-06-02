// app/_components/ClientPage.tsx
"use client";

import { useState } from "react";
import { updatePseudo } from "../actions/secretActions";

export default function ClientPage({ pseudo }: { pseudo: string | null }) {
  const [open, setOpen] = useState(!pseudo);
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (input.trim().length < 3) return alert("Pseudo trop court");
    const res = await updatePseudo(input);
    if (res.success) {
      setOpen(false);
    } else {
      alert("Erreur : " + res.error);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Choisis ton pseudo</h2>
            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="ex: JeanBaptiste77"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Valider
            </button>
          </div>
        </div>
      )}
      {!open && (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Bienvenue {pseudo} !</h1>
        </div>
      )}
    </>
  );
}
