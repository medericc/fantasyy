export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
      <p className="text-sm text-gray-500">Dernière mise à jour : 4 juin 2025</p>

      <section className="space-y-4 text-base leading-relaxed">
        <p>
          Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos données personnelles
          dans le cadre de notre fantasy league dédiée au basket féminin (LFB & LF2), proposée par <strong>First Pick</strong>,
          le premier média à lancer ce type de jeu pour le sport féminin.
        </p>

        <h2 className="text-xl font-semibold">1. Responsable du traitement</h2>
        <p>
          Cette application est opérée par <strong>First Pick</strong>. Pour toute question concernant vos données,
          vous pouvez nous contacter à :{" "}
          <a href="mailto:firstpick46@gmail.com" className="text-blue-600 underline">firstpick46@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold">2. Données collectées</h2>
        <p>Nous collectons les types de données suivants :</p>
        <ul className="list-disc ml-6">
          <li>Adresse e-mail et pseudo via Clerk (identification)</li>
          <li>Activité dans le jeu : points, choix de joueuses, classements</li>
          <li>Identifiants techniques (Clerk ID, cookie/session ID)</li>
          <li>Données de navigation via Google Analytics (anonymisées)</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Finalité de la collecte</h2>
        <p>Les données sont utilisées pour :</p>
        <ul className="list-disc ml-6">
          <li>Créer et gérer les comptes utilisateurs</li>
          <li>Afficher les scores, classements et badges</li>
          <li>Améliorer l’expérience utilisateur grâce à l’analyse d’usage</li>
          <li>Assurer la sécurité et la stabilité du service</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Services tiers</h2>
        <p>
          Nous utilisons <strong>Clerk</strong> pour l’authentification sécurisée. Leur politique de confidentialité est
          disponible ici :{" "}
          <a href="https://clerk.com/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            clerk.com/privacy
          </a>.
        </p>

        <h2 className="text-xl font-semibold">5. Conservation des données</h2>
        <p>
          Les données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte
          et de vos données à tout moment en nous contactant à{" "}
          <a href="mailto:firstpick46@gmail.com" className="text-blue-600 underline">firstpick46@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold">6. Vos droits (RGPD)</h2>
        <p>Vous disposez des droits suivants sur vos données :</p>
        <ul className="list-disc ml-6">
          <li>Droit d’accès</li>
          <li>Droit de rectification</li>
          <li>Droit à l’effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d’opposition</li>
        </ul>
        <p>
          Pour exercer vos droits, contactez-nous par e-mail à{" "}
          <a href="mailto:firstpick46@gmail.com" className="text-blue-600 underline">firstpick46@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold">7. Sécurité</h2>
        <p>
          Nous appliquons des mesures techniques et organisationnelles pour sécuriser vos données personnelles.
          Clerk assure une gestion sécurisée des sessions et des identifiants.
        </p>

        <h2 className="text-xl font-semibold">8. Cookies & statistiques</h2>
        <p>
          Nous utilisons Google Analytics pour analyser le trafic et améliorer notre service.
          Aucune donnée personnelle identifiable n’est collectée sans votre consentement préalable.
        </p>
        <p>
          Un bandeau de consentement est affiché lors de votre première visite. Vous pouvez à tout moment
          modifier vos préférences via ce bandeau.
        </p>
        <h3 className="font-semibold">Cookies utilisés :</h3>
        <ul className="list-disc ml-6">
          <li><strong>Cookies fonctionnels</strong> : nécessaires au bon fonctionnement du site (ex : gestion de session utilisateur via Clerk).</li>
          <li><strong>Cookies de mesure d’audience</strong> : utilisés par Google Analytics pour collecter des données de navigation de façon anonymisée.</li>
          <li><strong>Cookies de préférences</strong> : liés à votre langue ou thème visuel, si applicable.</li>
        </ul>

        <h2 className="text-xl font-semibold">9. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. En cas de modification significative, vous serez notifié(e) via l’application.
        </p>
      </section>
    </main>
  );
}
