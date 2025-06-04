export default function LegalPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mentions légales</h1>
      <p className="text-sm text-gray-500">Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004</p>

      <section className="space-y-4 text-base leading-relaxed">
        <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
        <p>
          Le site <strong>First Pick Fantasy League</strong> est édité par un particulier à titre non professionnel.
          Adresse e-mail de contact :{" "}
          <a href="mailto:firstpick46@gmail.com" className="text-blue-600 underline">firstpick46@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold">2. Hébergement</h2>
        <p>
          Le site est hébergé par :<br />
          <strong>Vercel Inc.</strong><br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
          Site :{" "}
          <a href="https://vercel.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            https://vercel.com
          </a>
        </p>

        <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>
        <p>
          Tous les contenus du site (textes, images, graphismes, logo) sont la propriété exclusive de First Pick,
          sauf mentions contraires. Toute reproduction est interdite sans autorisation.
        </p>

        <h2 className="text-xl font-semibold">4. Données personnelles</h2>
        <p>
          Pour en savoir plus sur la gestion des données personnelles, veuillez consulter notre{" "}
          <a href="/privacy" className="text-blue-600 underline">Politique de confidentialité</a>.
        </p>

        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          Le site peut utiliser des cookies pour des mesures d’audience anonymes. Vous pouvez les refuser via le bandeau de consentement.
        </p>
      </section>
    </main>
  );
}
