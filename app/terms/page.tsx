export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Conditions Générales d’Utilisation (CGU)</h1>
      <p className="text-sm text-gray-500">Dernière mise à jour : 4 juin 2025</p>

      <section className="space-y-4 text-base leading-relaxed">
        <p>
          Les présentes Conditions Générales d’Utilisation (CGU) régissent l’utilisation de la plateforme Fantasy League proposée par <strong>First Pick</strong>.
        </p>

        <h2 className="text-xl font-semibold">1. Objet</h2>
        <p>
          Le service permet aux utilisateurs de participer à un jeu de fantasy basket basé sur les performances réelles des joueuses des ligues LFB et LF2.
        </p>

        <h2 className="text-xl font-semibold">2. Accès au service</h2>
        <p>
          L’accès au service est gratuit. L’utilisateur doit créer un compte via Clerk et fournir une adresse e-mail valide.
        </p>

        <h2 className="text-xl font-semibold">3. Règles de conduite</h2>
        <ul className="list-disc ml-6">
          <li>Ne pas usurper l’identité d’autrui</li>
          <li>Respecter les autres utilisateurs</li>
          <li>Ne pas tenter de tricher ou manipuler le jeu</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Propriété intellectuelle</h2>
        <p>
          Le contenu du site (textes, logos, éléments graphiques) est protégé par les lois en vigueur sur la propriété intellectuelle.
        </p>

        <h2 className="text-xl font-semibold">5. Limitation de responsabilité</h2>
        <p>
          First Pick ne peut être tenu responsable des interruptions ou erreurs liées au fonctionnement du service.
        </p>

        <h2 className="text-xl font-semibold">6. Suppression de compte</h2>
        <p>
          L’utilisateur peut demander la suppression de son compte à tout moment par e-mail à :{" "}
          <a href="mailto:firstpick46@gmail.com" className="text-blue-600 underline">firstpick46@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold">7. Loi applicable</h2>
        <p>Les présentes CGU sont soumises au droit français.</p>
      </section>
    </main>
  );
}
