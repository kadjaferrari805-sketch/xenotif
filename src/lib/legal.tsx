import { Link } from '@/i18n/navigation'
import type { LegalSection } from '@/components/legal/LegalDocument'

export type LegalSlug = 'privacy' | 'legal' | 'terms'

export interface LegalDoc {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
  updatedLabel: string
  backLabel: string
  related: { href: string; label: string }
}

const LINK = 'text-sport-orange hover:underline'
const mail = (
  <a href="mailto:contact@xenotif.com" className={LINK}>contact@xenotif.com</a>
)

// Chrome partagé (libellés répétés sur les 3 documents).
const CHROME = {
  fr: { back: "Retour à l'accueil", updated: 'Dernière mise à jour : juin 2026' },
  en: { back: 'Back to home', updated: 'Last updated: June 2026' },
  de: { back: 'Zurück zur Startseite', updated: 'Zuletzt aktualisiert: Juni 2026' },
} as const

const RELATED = {
  fr: {
    privacy: { href: '/mentions-legales', label: 'Mentions légales' },
    legal: { href: '/conditions-generales-vente', label: 'Conditions générales de vente' },
    terms: { href: '/confidentialite', label: 'Politique de confidentialité' },
  },
  en: {
    privacy: { href: '/mentions-legales', label: 'Legal notice' },
    legal: { href: '/conditions-generales-vente', label: 'Terms of sale' },
    terms: { href: '/confidentialite', label: 'Privacy policy' },
  },
  de: {
    privacy: { href: '/mentions-legales', label: 'Impressum' },
    legal: { href: '/conditions-generales-vente', label: 'Allgemeine Geschäftsbedingungen' },
    terms: { href: '/confidentialite', label: 'Datenschutzerklärung' },
  },
} as const

// ─── Contenu FR ──────────────────────────────────────────────
const FR: Record<LegalSlug, { metaTitle: string; metaDescription: string; eyebrow: string; title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    metaTitle: 'Politique de confidentialité - Xenotif®',
    metaDescription: 'Politique de confidentialité et protection des données (RGPD) de Xenotif®.',
    eyebrow: 'RGPD',
    title: 'Politique de confidentialité',
    intro: "Xenotif® s'engage à protéger vos données personnelles et à respecter votre vie privée.",
    sections: [
      { id: 'donnees', title: 'Données collectées', body: (
        <p>Nous collectons votre adresse email lors de votre inscription (newsletter ou compte), ainsi que les informations nécessaires à la gestion de votre abonnement et de vos commandes (nom, email, historique d&apos;entraînement que vous saisissez). Aucune donnée de paiement n&apos;est stockée sur nos serveurs : les paiements sont traités par Stripe.</p>
      )},
      { id: 'utilisation', title: 'Utilisation des données', body: (
        <>
          <p className="mb-2">Vos données sont utilisées pour :</p>
          <p>- gérer votre compte, votre abonnement et vos commandes ;<br />- vous envoyer nos programmes, conseils et défis hebdomadaires ;<br />- vous informer des nouveautés Xenotif®.</p>
          <p className="mt-3">Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales.</p>
        </>
      )},
      { id: 'cookies', title: 'Cookies', body: (
        <p>Ce site utilise uniquement des cookies techniques essentiels au bon fonctionnement (session, préférence de langue). Aucun cookie publicitaire, de tracking ou de profilage n&apos;est utilisé. Vous pouvez bloquer les cookies dans les paramètres de votre navigateur sans que cela affecte votre navigation.</p>
      )},
      { id: 'droits', title: 'Vos droits (RGPD)', body: (
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : {mail}<br /><br />Vous avez également le droit d&apos;introduire une réclamation auprès de la <a href="https://www.cnil.fr" className={LINK} target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
      )},
      { id: 'desabonnement', title: 'Désabonnement', body: (
        <p>Vous pouvez vous désabonner à tout moment en cliquant sur le lien de désabonnement présent dans chacun de nos emails, ou en nous contactant directement à {mail}. Votre demande sera traitée sous 48 heures.</p>
      )},
      { id: 'conservation', title: 'Conservation des données', body: (
        <p>Vos données sont conservées tant que votre compte est actif, puis pendant 3 ans après la fin de la relation, conformément aux obligations légales. À l&apos;issue de cette période, elles sont définitivement supprimées.</p>
      )},
    ],
  },
  legal: {
    metaTitle: 'Mentions légales - Xenotif®',
    metaDescription: 'Mentions légales de la plateforme sportive Xenotif®.',
    eyebrow: 'Légal',
    title: 'Mentions légales',
    intro: 'Informations relatives à l’éditeur et à l’hébergeur du site xenotif.com.',
    sections: [
      { id: 'editeur', title: 'Éditeur du site', body: (
        <p><strong className="text-sport-fg">Xenotif LTD</strong> - société à responsabilité limitée (private limited company) immatriculée en Angleterre et au Pays de Galles.<br />Numéro de société (Companies House) : 17013934<br />Siège social : 20 Wenlock Road, Londres N1 7GU, Royaume-Uni<br />Directeur de la publication : Dave Ferrari<br />Email : {mail}<br />Site : <a href="https://xenotif.com" className={LINK} target="_blank" rel="noopener noreferrer">xenotif.com</a></p>
      )},
      { id: 'hebergement', title: 'Hébergement', body: (
        <p><strong className="text-sport-fg">Vercel Inc.</strong><br />440 N Barranca Ave #4133, Covina, CA 91723, USA<br /><a href="https://vercel.com" className={LINK} target="_blank" rel="noopener noreferrer">vercel.com</a></p>
      )},
      { id: 'propriete', title: 'Propriété intellectuelle', body: (
        <p>L&apos;ensemble du contenu de ce site (textes, images, logos, icônes, programmes) est la propriété exclusive de Xenotif®. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
      )},
      { id: 'responsabilite', title: 'Limitation de responsabilité', body: (
        <p>Xenotif® s&apos;efforce de fournir des informations exactes et à jour. Toutefois, nous ne pouvons garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées. Les programmes sportifs proposés sont informatifs et ne remplacent pas l&apos;avis d&apos;un professionnel de santé.</p>
      )},
      { id: 'droit', title: 'Droit applicable', body: (
        <p>Le présent site est soumis au droit français. Tout litige sera soumis à la compétence des tribunaux français.</p>
      )},
    ],
  },
  terms: {
    metaTitle: 'Conditions générales de vente - Xenotif®',
    metaDescription: 'Conditions générales de vente des abonnements et produits Xenotif® (abonnements, guides digitaux, produits physiques).',
    eyebrow: 'CGV',
    title: 'Conditions générales de vente',
    intro: 'Les présentes conditions régissent les ventes d’abonnements et de produits réalisées sur xenotif.com.',
    sections: [
      { id: 'objet', title: '1. Objet', body: (
        <p>Les présentes Conditions Générales de Vente (CGV) régissent toute commande passée sur le site xenotif.com : abonnement (Pro), guides et programmes digitaux, et produits physiques. Toute commande implique l&apos;acceptation pleine et entière des présentes CGV.</p>
      )},
      { id: 'vendeur', title: '2. Vendeur', body: (
        <p>Les produits et services sont vendus par <strong className="text-sport-fg">Xenotif LTD</strong> (société immatriculée en Angleterre et au Pays de Galles, n° 17013934). Les coordonnées complètes figurent dans les <Link href="/mentions-legales" className={LINK}>mentions légales</Link>. Contact : {mail}.</p>
      )},
      { id: 'produits', title: '3. Produits et services', body: (
        <>
          <p className="mb-2">Xenotif® propose :</p>
          <p>- des <strong className="text-sport-fg">abonnements</strong> donnant accès aux programmes, au coaching IA et au suivi (Plan Pro), facturés mensuellement ou annuellement ;<br />- des <strong className="text-sport-fg">guides et programmes digitaux</strong> (PDF), à accès immédiat après paiement ;<br />- des <strong className="text-sport-fg">produits physiques</strong> (équipement, accessoires).</p>
        </>
      )},
      { id: 'prix', title: '4. Prix', body: (
        <p>Les prix sont indiqués en euros (€), toutes taxes comprises. Xenotif® se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
      )},
      { id: 'paiement', title: '5. Commande et paiement', body: (
        <p>Le paiement s&apos;effectue en ligne, de manière sécurisée, via notre prestataire <strong className="text-sport-fg">Stripe</strong> (carte bancaire, Apple Pay, Google Pay selon disponibilité). Aucune donnée bancaire n&apos;est conservée par Xenotif®. La commande est validée après confirmation du paiement.</p>
      )},
      { id: 'abonnement', title: '6. Abonnement et résiliation', body: (
        <p>Les abonnements sont reconduits automatiquement par période (mensuelle ou annuelle) jusqu&apos;à résiliation. Vous pouvez résilier à tout moment depuis votre espace membre (rubrique « Abonnement ») ; l&apos;accès reste actif jusqu&apos;à la fin de la période déjà payée, sans reconduction ultérieure.</p>
      )},
      { id: 'livraison', title: '7. Livraison', body: (
        <p>Les produits digitaux sont livrés immédiatement après paiement, par email et via un lien de téléchargement sécurisé (accès à vie). Les produits physiques sont expédiés sous 3 à 7 jours ouvrés ; la livraison est offerte dès 50&nbsp;€ d&apos;achat.</p>
      )},
      { id: 'retractation', title: '8. Droit de rétractation', body: (
        <>
          <p>Conformément à l&apos;article L.221-18 du Code de la consommation, vous disposez d&apos;un délai de 14 jours pour exercer votre droit de rétractation sur les produits physiques, à compter de leur réception, sans avoir à justifier de motif.</p>
          <p className="mt-3"><strong className="text-sport-fg">Exception (contenus numériques)</strong> : pour les guides et programmes digitaux fournis immédiatement, vous renoncez expressément à votre droit de rétractation dès le début du téléchargement, conformément à l&apos;article L.221-28 13°. Le droit de rétractation ne s&apos;applique donc plus une fois le contenu téléchargé.</p>
          <p className="mt-3">Pour exercer ce droit (produits physiques), contactez-nous à {mail}.</p>
        </>
      )},
      { id: 'retours', title: '9. Retours et remboursements', body: (
        <p>Les produits physiques peuvent être retournés sous 30 jours s&apos;ils sont en parfait état et dans leur emballage d&apos;origine. Le remboursement est effectué sous 14 jours après réception du retour, par le même moyen de paiement.</p>
      )},
      { id: 'satisfait-rembourse', title: '10. Garantie « satisfait ou remboursé » (30 jours)', body: (
        <>
          <p>Au-delà de vos droits légaux, Xenotif® vous offre une <strong className="text-sport-fg">garantie commerciale « satisfait ou remboursé » de 30 jours</strong> sur l&apos;abonnement (Pro) et les guides digitaux.</p>
          <p className="mt-3">Si vous n&apos;êtes pas satisfait(e), écrivez-nous simplement à {mail} dans les 30 jours suivant votre paiement (pour un abonnement : ton premier paiement). Nous vous remboursons <strong className="text-sport-fg">intégralement</strong>, sans avoir à vous justifier. Le remboursement est effectué sous 14 jours, par le même moyen de paiement.</p>
          <p className="mt-3">Cette garantie commerciale s&apos;ajoute aux garanties légales et au droit de rétractation : elle ne les remplace pas.</p>
        </>
      )},
      { id: 'garanties', title: '11. Garanties légales', body: (
        <p>Tous les produits bénéficient de la garantie légale de conformité (art. L.217-3 et suivants du Code de la consommation) et de la garantie contre les vices cachés (art. 1641 et suivants du Code civil).</p>
      )},
      { id: 'responsabilite-cgv', title: '12. Santé et responsabilité', body: (
        <p>Les programmes et conseils proposés sont fournis à titre informatif et ne remplacent pas l&apos;avis d&apos;un professionnel de santé. Consultez un médecin avant de débuter un programme sportif. Xenotif® ne saurait être tenu responsable d&apos;un usage inadapté de ses contenus.</p>
      )},
      { id: 'donnees-cgv', title: '13. Données personnelles', body: (
        <p>Le traitement de vos données est décrit dans notre <Link href="/confidentialite" className={LINK}>politique de confidentialité</Link>, conforme au RGPD.</p>
      )},
      { id: 'litiges', title: '14. Service client, médiation et droit applicable', body: (
        <p>Pour toute réclamation, contactez {mail}. Conformément à l&apos;article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement à un médiateur de la consommation. Les présentes CGV sont soumises au droit français ; à défaut de résolution amiable, tout litige relève des tribunaux français compétents.</p>
      )},
    ],
  },
}

// ─── Contenu EN ──────────────────────────────────────────────
const EN: Record<LegalSlug, { metaTitle: string; metaDescription: string; eyebrow: string; title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    metaTitle: 'Privacy Policy - Xenotif®',
    metaDescription: 'Xenotif® privacy policy and data protection (GDPR).',
    eyebrow: 'GDPR',
    title: 'Privacy Policy',
    intro: 'Xenotif® is committed to protecting your personal data and respecting your privacy.',
    sections: [
      { id: 'donnees', title: 'Data we collect', body: (
        <p>We collect your email address when you sign up (newsletter or account), along with the information needed to manage your subscription and orders (name, email, and the training history you enter). No payment data is stored on our servers - payments are handled by Stripe.</p>
      )},
      { id: 'utilisation', title: 'How we use your data', body: (
        <>
          <p className="mb-2">Your data is used to:</p>
          <p>- manage your account, subscription and orders;<br />- send you our weekly programs, tips and challenges;<br />- keep you informed about Xenotif® news.</p>
          <p className="mt-3">We never sell or share your data with third parties for commercial purposes.</p>
        </>
      )},
      { id: 'cookies', title: 'Cookies', body: (
        <p>This site uses only essential technical cookies (session, language preference). No advertising, tracking or profiling cookies are used. You can block cookies in your browser settings without affecting your browsing.</p>
      )},
      { id: 'droits', title: 'Your rights (GDPR)', body: (
        <p>Under the General Data Protection Regulation (GDPR), you have the right to access, rectify, erase and port your data. To exercise these rights, contact us at: {mail}<br /><br />You also have the right to lodge a complaint with the <a href="https://www.cnil.fr" className={LINK} target="_blank" rel="noopener noreferrer">CNIL</a> (the French data protection authority).</p>
      )},
      { id: 'desabonnement', title: 'Unsubscribe', body: (
        <p>You can unsubscribe at any time by clicking the unsubscribe link in any of our emails, or by contacting us directly at {mail}. Your request will be processed within 48 hours.</p>
      )},
      { id: 'conservation', title: 'Data retention', body: (
        <p>Your data is kept while your account is active, then for 3 years after the end of the relationship, in line with legal obligations. After that period, it is permanently deleted.</p>
      )},
    ],
  },
  legal: {
    metaTitle: 'Legal Notice - Xenotif®',
    metaDescription: 'Legal notice for the Xenotif® sports platform.',
    eyebrow: 'Legal',
    title: 'Legal Notice',
    intro: 'Information about the publisher and host of the xenotif.com website.',
    sections: [
      { id: 'editeur', title: 'Site publisher', body: (
        <p><strong className="text-sport-fg">Xenotif LTD</strong> - a private limited company registered in England and Wales.<br />Company number (Companies House): 17013934<br />Registered office: 20 Wenlock Road, London N1 7GU, United Kingdom<br />Publication director: Dave Ferrari<br />Email: {mail}<br />Site: <a href="https://xenotif.com" className={LINK} target="_blank" rel="noopener noreferrer">xenotif.com</a></p>
      )},
      { id: 'hebergement', title: 'Hosting', body: (
        <p><strong className="text-sport-fg">Vercel Inc.</strong><br />440 N Barranca Ave #4133, Covina, CA 91723, USA<br /><a href="https://vercel.com" className={LINK} target="_blank" rel="noopener noreferrer">vercel.com</a></p>
      )},
      { id: 'propriete', title: 'Intellectual property', body: (
        <p>All content on this site (text, images, logos, icons, programs) is the exclusive property of Xenotif®. Any reproduction, even partial, is prohibited without prior written authorization.</p>
      )},
      { id: 'responsabilite', title: 'Limitation of liability', body: (
        <p>Xenotif® strives to provide accurate and up-to-date information. However, we cannot guarantee the accuracy, completeness or timeliness of the information published. The training programs offered are informational and do not replace the advice of a healthcare professional.</p>
      )},
      { id: 'droit', title: 'Governing law', body: (
        <p>This site is governed by French law. Any dispute will fall under the jurisdiction of the French courts.</p>
      )},
    ],
  },
  terms: {
    metaTitle: 'Terms of Sale - Xenotif®',
    metaDescription: 'Terms of sale for Xenotif® subscriptions and products (subscriptions, digital guides, physical products).',
    eyebrow: 'Terms of Sale',
    title: 'Terms of Sale',
    intro: 'These terms govern subscription and product sales made on xenotif.com.',
    sections: [
      { id: 'objet', title: '1. Purpose', body: (
        <p>These Terms of Sale govern any order placed on xenotif.com: subscription (Pro), digital guides and programs, and physical products. Any order implies full acceptance of these terms.</p>
      )},
      { id: 'vendeur', title: '2. Seller', body: (
        <p>Products and services are sold by <strong className="text-sport-fg">Xenotif LTD</strong> (a company registered in England and Wales, no. 17013934). Full details are in the <Link href="/mentions-legales" className={LINK}>legal notice</Link>. Contact: {mail}.</p>
      )},
      { id: 'produits', title: '3. Products and services', body: (
        <>
          <p className="mb-2">Xenotif® offers:</p>
          <p>- <strong className="text-sport-fg">subscriptions</strong> giving access to programs, AI coaching and tracking (Pro plan), billed monthly or annually;<br />- <strong className="text-sport-fg">digital guides and programs</strong> (PDF), available immediately after payment;<br />- <strong className="text-sport-fg">physical products</strong> (equipment, accessories).</p>
        </>
      )},
      { id: 'prix', title: '4. Prices', body: (
        <p>Prices are shown in euros (€), all taxes included. Xenotif® reserves the right to change its prices at any time; products are billed based on the prices in effect when the order is confirmed.</p>
      )},
      { id: 'paiement', title: '5. Order and payment', body: (
        <p>Payment is made online, securely, through our provider <strong className="text-sport-fg">Stripe</strong> (credit card, Apple Pay, Google Pay where available). No banking data is stored by Xenotif®. The order is confirmed once payment is approved.</p>
      )},
      { id: 'abonnement', title: '6. Subscription and cancellation', body: (
        <p>Subscriptions renew automatically per period (monthly or annual) until cancelled. You can cancel anytime from your member area (&quot;Subscription&quot; section); access stays active until the end of the period already paid, with no further renewal.</p>
      )},
      { id: 'livraison', title: '7. Delivery', body: (
        <p>Digital products are delivered immediately after payment, by email and via a secure download link (lifetime access). Physical products ship within 3 to 7 business days; shipping is free for orders over €50.</p>
      )},
      { id: 'retractation', title: '8. Right of withdrawal', body: (
        <>
          <p>In accordance with article L.221-18 of the French Consumer Code, you have 14 days to exercise your right of withdrawal on physical products, from the date of receipt, without having to give a reason.</p>
          <p className="mt-3"><strong className="text-sport-fg">Exception (digital content)</strong>: for digital guides and programs delivered immediately, you expressly waive your right of withdrawal as soon as the download begins, in accordance with article L.221-28 13°. The right of withdrawal therefore no longer applies once the content has been downloaded.</p>
          <p className="mt-3">To exercise this right (physical products), contact us at {mail}.</p>
        </>
      )},
      { id: 'retours', title: '9. Returns and refunds', body: (
        <p>Physical products may be returned within 30 days if they are in perfect condition and in their original packaging. Refunds are issued within 14 days of receiving the return, using the same payment method.</p>
      )},
      { id: 'satisfait-rembourse', title: '10. Money-back guarantee (30 days)', body: (
        <>
          <p>Beyond your legal rights, Xenotif® offers a <strong className="text-sport-fg">30-day commercial &quot;money-back&quot; guarantee</strong> on subscription (Pro) and digital guides.</p>
          <p className="mt-3">If you&apos;re not satisfied, simply email us at {mail} within 30 days of your payment (for a subscription: your first payment). We refund you <strong className="text-sport-fg">in full</strong>, no questions asked. The refund is issued within 14 days, using the same payment method.</p>
          <p className="mt-3">This commercial guarantee is in addition to the legal guarantees and right of withdrawal - it does not replace them.</p>
        </>
      )},
      { id: 'garanties', title: '11. Legal guarantees', body: (
        <p>All products benefit from the legal guarantee of conformity (art. L.217-3 et seq. of the Consumer Code) and the guarantee against hidden defects (art. 1641 et seq. of the Civil Code).</p>
      )},
      { id: 'responsabilite-cgv', title: '12. Health and liability', body: (
        <p>The programs and advice provided are for informational purposes and do not replace the advice of a healthcare professional. Consult a doctor before starting a training program. Xenotif® cannot be held liable for improper use of its content.</p>
      )},
      { id: 'donnees-cgv', title: '13. Personal data', body: (
        <p>The processing of your data is described in our <Link href="/confidentialite" className={LINK}>privacy policy</Link>, which complies with the GDPR.</p>
      )},
      { id: 'litiges', title: '14. Customer service, mediation and governing law', body: (
        <p>For any complaint, contact {mail}. In accordance with article L.612-1 of the French Consumer Code, you may use a consumer ombudsman free of charge. These terms are governed by French law; failing an amicable resolution, any dispute falls under the competent French courts.</p>
      )},
    ],
  },
}

// ─── Contenu DE ──────────────────────────────────────────────
const DE: Record<LegalSlug, { metaTitle: string; metaDescription: string; eyebrow: string; title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    metaTitle: 'Datenschutzerklärung - Xenotif®',
    metaDescription: 'Datenschutzerklärung und Datenschutz (DSGVO) von Xenotif®.',
    eyebrow: 'DSGVO',
    title: 'Datenschutzerklärung',
    intro: 'Xenotif® verpflichtet sich, deine personenbezogenen Daten zu schützen und deine Privatsphäre zu respektieren.',
    sections: [
      { id: 'donnees', title: 'Erhobene Daten', body: (
        <p>Wir erheben deine E-Mail-Adresse bei deiner Anmeldung (Newsletter oder Konto) sowie die zur Verwaltung deines Abonnements und deiner Bestellungen erforderlichen Informationen (Name, E-Mail, von dir eingegebene Trainingshistorie). Auf unseren Servern werden keine Zahlungsdaten gespeichert: Zahlungen werden von Stripe abgewickelt.</p>
      )},
      { id: 'utilisation', title: 'Verwendung der Daten', body: (
        <>
          <p className="mb-2">Deine Daten werden verwendet, um:</p>
          <p>- dein Konto, dein Abonnement und deine Bestellungen zu verwalten;<br />- dir unsere wöchentlichen Programme, Tipps und Challenges zu senden;<br />- dich über Neuigkeiten von Xenotif® zu informieren.</p>
          <p className="mt-3">Wir verkaufen oder teilen deine Daten niemals zu kommerziellen Zwecken mit Dritten.</p>
        </>
      )},
      { id: 'cookies', title: 'Cookies', body: (
        <p>Diese Website verwendet ausschließlich technisch notwendige Cookies (Sitzung, Sprachpräferenz). Es werden keine Werbe-, Tracking- oder Profiling-Cookies eingesetzt. Du kannst Cookies in den Einstellungen deines Browsers blockieren, ohne dass dies deine Navigation beeinträchtigt.</p>
      )},
      { id: 'droits', title: 'Deine Rechte (DSGVO)', body: (
        <p>Gemäß der Datenschutz-Grundverordnung (DSGVO) hast du das Recht auf Auskunft, Berichtigung, Löschung und Übertragbarkeit deiner Daten. Um diese Rechte auszuüben, kontaktiere uns unter: {mail}<br /><br />Du hast außerdem das Recht, eine Beschwerde bei der <a href="https://www.cnil.fr" className={LINK} target="_blank" rel="noopener noreferrer">CNIL</a> (französische Datenschutzbehörde) einzureichen.</p>
      )},
      { id: 'desabonnement', title: 'Abmeldung', body: (
        <p>Du kannst dich jederzeit abmelden, indem du auf den Abmeldelink in einer unserer E-Mails klickst oder uns direkt unter {mail} kontaktierst. Deine Anfrage wird innerhalb von 48 Stunden bearbeitet.</p>
      )},
      { id: 'conservation', title: 'Aufbewahrung der Daten', body: (
        <p>Deine Daten werden gespeichert, solange dein Konto aktiv ist, und anschließend 3 Jahre nach Beendigung der Geschäftsbeziehung gemäß den gesetzlichen Pflichten. Nach diesem Zeitraum werden sie endgültig gelöscht.</p>
      )},
    ],
  },
  legal: {
    metaTitle: 'Impressum - Xenotif®',
    metaDescription: 'Impressum der Sportplattform Xenotif®.',
    eyebrow: 'Rechtliches',
    title: 'Impressum',
    intro: 'Informationen über den Betreiber und den Hoster der Website xenotif.com.',
    sections: [
      { id: 'editeur', title: 'Betreiber der Website', body: (
        <p><strong className="text-sport-fg">Xenotif LTD</strong> - eine in England und Wales eingetragene Gesellschaft mit beschränkter Haftung (private limited company).<br />Handelsregisternummer (Companies House): 17013934<br />Eingetragener Sitz: 20 Wenlock Road, London N1 7GU, Vereinigtes Königreich<br />Verantwortlich für den Inhalt: Dave Ferrari<br />E-Mail: {mail}<br />Website: <a href="https://xenotif.com" className={LINK} target="_blank" rel="noopener noreferrer">xenotif.com</a></p>
      )},
      { id: 'hebergement', title: 'Hosting', body: (
        <p><strong className="text-sport-fg">Vercel Inc.</strong><br />440 N Barranca Ave #4133, Covina, CA 91723, USA<br /><a href="https://vercel.com" className={LINK} target="_blank" rel="noopener noreferrer">vercel.com</a></p>
      )},
      { id: 'propriete', title: 'Geistiges Eigentum', body: (
        <p>Sämtliche Inhalte dieser Website (Texte, Bilder, Logos, Symbole, Programme) sind ausschließliches Eigentum von Xenotif®. Jede auch nur teilweise Vervielfältigung ist ohne vorherige schriftliche Genehmigung untersagt.</p>
      )},
      { id: 'responsabilite', title: 'Haftungsbeschränkung', body: (
        <p>Xenotif® bemüht sich, genaue und aktuelle Informationen bereitzustellen. Wir können jedoch die Richtigkeit, Vollständigkeit oder Aktualität der veröffentlichten Informationen nicht garantieren. Die angebotenen Sportprogramme dienen der Information und ersetzen nicht den Rat einer medizinischen Fachkraft.</p>
      )},
      { id: 'droit', title: 'Anwendbares Recht', body: (
        <p>Diese Website unterliegt französischem Recht. Für alle Streitigkeiten sind die französischen Gerichte zuständig.</p>
      )},
    ],
  },
  terms: {
    metaTitle: 'Allgemeine Geschäftsbedingungen - Xenotif®',
    metaDescription: 'Allgemeine Geschäftsbedingungen für Abonnements und Produkte von Xenotif® (Abonnements, digitale Guides, physische Produkte).',
    eyebrow: 'AGB',
    title: 'Allgemeine Geschäftsbedingungen',
    intro: 'Diese Bedingungen regeln den Verkauf von Abonnements und Produkten auf xenotif.com.',
    sections: [
      { id: 'objet', title: '1. Gegenstand', body: (
        <p>Diese Allgemeinen Geschäftsbedingungen (AGB) regeln jede auf xenotif.com aufgegebene Bestellung: Abonnement (Pro), digitale Guides und Programme sowie physische Produkte. Jede Bestellung setzt die vollständige Annahme dieser AGB voraus.</p>
      )},
      { id: 'vendeur', title: '2. Verkäufer', body: (
        <p>Die Produkte und Dienstleistungen werden von <strong className="text-sport-fg">Xenotif LTD</strong> (in England und Wales eingetragene Gesellschaft, Nr. 17013934) verkauft. Die vollständigen Angaben findest du im <Link href="/mentions-legales" className={LINK}>Impressum</Link>. Kontakt: {mail}.</p>
      )},
      { id: 'produits', title: '3. Produkte und Dienstleistungen', body: (
        <>
          <p className="mb-2">Xenotif® bietet:</p>
          <p>- <strong className="text-sport-fg">Abonnements</strong>, die Zugang zu Programmen, KI-Coaching und Tracking bieten (Pro-Plan), monatlich oder jährlich abgerechnet;<br />- <strong className="text-sport-fg">digitale Guides und Programme</strong> (PDF), sofort nach Zahlung verfügbar;<br />- <strong className="text-sport-fg">physische Produkte</strong> (Ausrüstung, Zubehör).</p>
        </>
      )},
      { id: 'prix', title: '4. Preise', body: (
        <p>Die Preise sind in Euro (€) inklusive aller Steuern angegeben. Xenotif® behält sich das Recht vor, seine Preise jederzeit zu ändern; die Produkte werden auf Grundlage der zum Zeitpunkt der Bestellbestätigung gültigen Preise abgerechnet.</p>
      )},
      { id: 'paiement', title: '5. Bestellung und Zahlung', body: (
        <p>Die Zahlung erfolgt online und sicher über unseren Dienstleister <strong className="text-sport-fg">Stripe</strong> (Kreditkarte, Apple Pay, Google Pay, sofern verfügbar). Es werden keine Bankdaten von Xenotif® gespeichert. Die Bestellung wird nach Bestätigung der Zahlung wirksam.</p>
      )},
      { id: 'abonnement', title: '6. Abonnement und Kündigung', body: (
        <p>Abonnements verlängern sich automatisch pro Zeitraum (monatlich oder jährlich) bis zur Kündigung. Du kannst jederzeit über deinen Mitgliederbereich (Bereich „Abonnement“) kündigen; der Zugang bleibt bis zum Ende des bereits bezahlten Zeitraums aktiv, ohne weitere Verlängerung.</p>
      )},
      { id: 'livraison', title: '7. Lieferung', body: (
        <p>Digitale Produkte werden sofort nach Zahlung per E-Mail und über einen sicheren Download-Link geliefert (lebenslanger Zugang). Physische Produkte werden innerhalb von 3 bis 7 Werktagen versandt; ab 50&nbsp;€ Bestellwert ist der Versand kostenlos.</p>
      )},
      { id: 'retractation', title: '8. Widerrufsrecht', body: (
        <>
          <p>Gemäß Artikel L.221-18 des französischen Verbrauchergesetzbuchs hast du bei physischen Produkten ab Erhalt 14 Tage Zeit, dein Widerrufsrecht ohne Angabe von Gründen auszuüben.</p>
          <p className="mt-3"><strong className="text-sport-fg">Ausnahme (digitale Inhalte)</strong>: Bei sofort bereitgestellten digitalen Guides und Programmen verzichtest du gemäß Artikel L.221-28 13° ausdrücklich auf dein Widerrufsrecht, sobald der Download beginnt. Das Widerrufsrecht gilt daher nicht mehr, sobald der Inhalt heruntergeladen wurde.</p>
          <p className="mt-3">Um dieses Recht auszuüben (physische Produkte), kontaktiere uns unter {mail}.</p>
        </>
      )},
      { id: 'retours', title: '9. Rückgaben und Erstattungen', body: (
        <p>Physische Produkte können innerhalb von 30 Tagen zurückgegeben werden, sofern sie in einwandfreiem Zustand und in der Originalverpackung sind. Die Erstattung erfolgt innerhalb von 14 Tagen nach Erhalt der Rückgabe über dasselbe Zahlungsmittel.</p>
      )},
      { id: 'satisfait-rembourse', title: '10. „Geld-zurück“-Garantie (30 Tage)', body: (
        <>
          <p>Über deine gesetzlichen Rechte hinaus bietet dir Xenotif® eine <strong className="text-sport-fg">30-tägige kommerzielle „Geld-zurück“-Garantie</strong> auf das Abonnement (Pro) und die digitalen Guides.</p>
          <p className="mt-3">Wenn du nicht zufrieden bist, schreib uns innerhalb von 30 Tagen nach deiner Zahlung einfach an {mail} (bei einem Abonnement: deine erste Zahlung). Wir erstatten dir <strong className="text-sport-fg">den vollen Betrag</strong>, ohne Nachfragen. Die Erstattung erfolgt innerhalb von 14 Tagen über dasselbe Zahlungsmittel.</p>
          <p className="mt-3">Diese kommerzielle Garantie besteht zusätzlich zu den gesetzlichen Gewährleistungen und dem Widerrufsrecht - sie ersetzt sie nicht.</p>
        </>
      )},
      { id: 'garanties', title: '11. Gesetzliche Gewährleistung', body: (
        <p>Alle Produkte unterliegen der gesetzlichen Konformitätsgewährleistung (Art. L.217-3 ff. des Verbrauchergesetzbuchs) und der Gewährleistung für versteckte Mängel (Art. 1641 ff. des Zivilgesetzbuchs).</p>
      )},
      { id: 'responsabilite-cgv', title: '12. Gesundheit und Haftung', body: (
        <p>Die bereitgestellten Programme und Ratschläge dienen Informationszwecken und ersetzen nicht den Rat einer medizinischen Fachkraft. Konsultiere einen Arzt, bevor du ein Sportprogramm beginnst. Xenotif® haftet nicht für eine unsachgemäße Nutzung seiner Inhalte.</p>
      )},
      { id: 'donnees-cgv', title: '13. Personenbezogene Daten', body: (
        <p>Die Verarbeitung deiner Daten ist in unserer <Link href="/confidentialite" className={LINK}>Datenschutzerklärung</Link> beschrieben, die der DSGVO entspricht.</p>
      )},
      { id: 'litiges', title: '14. Kundenservice, Schlichtung und anwendbares Recht', body: (
        <p>Für jede Reklamation kontaktiere {mail}. Gemäß Artikel L.612-1 des französischen Verbrauchergesetzbuchs kannst du kostenlos eine Verbraucherschlichtungsstelle in Anspruch nehmen. Diese AGB unterliegen französischem Recht; sollte keine gütliche Einigung erzielt werden, sind die zuständigen französischen Gerichte zuständig.</p>
      )},
    ],
  },
}

export function getLegalDoc(slug: LegalSlug, locale: string): LegalDoc {
  const lang: 'fr' | 'en' | 'de' = locale === 'en' ? 'en' : locale === 'de' ? 'de' : 'fr'
  const base = (lang === 'en' ? EN : lang === 'de' ? DE : FR)[slug]
  return {
    ...base,
    updatedLabel: CHROME[lang].updated,
    backLabel: CHROME[lang].back,
    related: RELATED[lang][slug],
  }
}
