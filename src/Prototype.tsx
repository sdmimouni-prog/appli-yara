import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeftIcon,
  BarChartIcon,
  BoxIcon,
  BookmarkFilledIcon,
  CalendarIcon,
  CardStackIcon,
  ChatBubbleIcon,
  CheckCircledIcon,
  ChevronRightIcon,
  ClockIcon,
  CrossCircledIcon,
  CubeIcon,
  DashboardIcon,
  DotsHorizontalIcon,
  DrawingPinFilledIcon,
  DotsVerticalIcon,
  ExclamationTriangleIcon,
  FileTextIcon,
  GlobeIcon,
  GearIcon,
  HomeIcon,
  IdCardIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MobileIcon,
  MoonIcon,
  PersonIcon,
  PlusIcon,
  ReloadIcon,
  RocketIcon,
  SewingPinIcon,
  StarFilledIcon,
  SunIcon,
  LightningBoltIcon,
  TrashIcon,
  ValueIcon,
} from "@radix-ui/react-icons";
import { KeyboardInput, MobileScroll } from "./mobile";
import { useMobileDevice } from "./mobile";

type ScreenName =
  | "activation"
  | "accueil"
  | "clients"
  | "client"
  | "catalogue"
  | "panier"
  | "livraison"
  | "synchronisation";

const activationRows = [
  {
    label: "Code commercial",
    value: "RS0158",
    icon: IdCardIcon,
  },
  {
    label: "Téléphone assigné",
    value: "+212 6 72 45 81 09",
    icon: MobileIcon,
  },
  {
    label: "Véhicule",
    value: "Dacia Dokker | 12345 | 26",
    icon: RocketIcon,
  },
  {
    label: "Secteur",
    value: "Casablanca Nord",
    icon: SewingPinIcon,
  },
  {
    label: "État de connexion",
    value: "En ligne",
    icon: GearIcon,
    status: true,
  },
];

const dashboardStats = [
  {
    label: "CA jour",
    value: "4 850 DH",
    detail: "6 ventes",
  },
  {
    label: "CA mois",
    value: "68 720 DH",
    detail: "57 % de l'objectif",
    accent: true,
  },
  {
    label: "Objectif mensuel",
    value: "120 000 DH",
    detail: "Reste 51 280 DH",
  },
  {
    label: "MCS estimée",
    value: "1 940 DH",
    detail: "Calcul provisoire",
  },
  {
    label: "Caisse à remettre",
    value: "2 155 DH",
    detail: "À remettre ce soir",
  },
  {
    label: "Stock véhicule",
    value: "48 350 DH",
    detail: "26 références",
  },
];

const bottomTabs = [
  { label: "Accueil", icon: HomeIcon, screen: "accueil" },
  { label: "Tournée", icon: SewingPinIcon, screen: "clients" },
  { label: "Vendre", icon: PlusIcon, screen: "panier", featured: true },
  { label: "Stock", icon: CubeIcon, screen: "catalogue" },
  { label: "Plus", icon: DotsHorizontalIcon, screen: "synchronisation" },
] satisfies Array<{
  label: string;
  icon: typeof HomeIcon;
  screen?: ScreenName;
  featured?: boolean;
}>;

const clientFilters = [
  { label: "À visiter", count: 8, active: true },
  { label: "Visités", count: 4 },
  { label: "Prospects", count: 3 },
  { label: "Tous", count: 19 },
];

const sectorClients = [
  {
    name: "Épicerie Al Manar",
    locality: "Ain Sebaâ · 1,2 km",
    lastPurchase: "11/08/2026 · 2 450 DH",
    status: "À visiter",
    priority: true,
  },
  {
    name: "Bazar Saada",
    locality: "Hay Mohammadi · 2,1 km",
    lastPurchase: "09/08/2026 · 3 120 DH",
    status: "À visiter",
    priority: true,
  },
  {
    name: "Supérette Al Amal",
    locality: "Sidi Moumen · 3,0 km",
    lastPurchase: "05/08/2026 · 1 890 DH",
    status: "À visiter",
    priority: false,
  },
  {
    name: "Kiosque El Fath",
    locality: "Roches Noires · 3,4 km",
    lastPurchase: "02/08/2026 · 980 DH",
    status: "À visiter",
    priority: false,
  },
  {
    name: "Épicerie Badr",
    locality: "Oulfa · 3,8 km",
    lastPurchase: "30/07/2026 · 2 200 DH",
    status: "À relancer",
    priority: true,
  },
];

const clientInfo = [
  {
    label: "Téléphone",
    value: "06 61 23 45 67",
    icon: MobileIcon,
  },
  {
    label: "Localisation",
    value: "Ain Sebaâ · Zone 5",
    icon: GlobeIcon,
  },
  {
    label: "Adresse",
    value: "128, Rue 5, Ain Sebaâ, Casablanca",
    icon: DrawingPinFilledIcon,
    wide: true,
  },
  {
    label: "Dernier achat",
    value: "11/08/2026 · 2 450 DH",
    icon: ClockIcon,
    wide: true,
  },
];

const recentHistory = [
  { date: "11/08/2026", label: "Vente", value: "2 450 DH" },
  { date: "07/08/2026", label: "Vente", value: "1 870 DH" },
  { date: "02/08/2026", label: "Vente", value: "1 350 DH" },
];

const productFilters = [
  { label: "Tous", active: true },
  { label: "Famille S" },
  { label: "Famille K" },
  { label: "Famille V" },
];

const vehicleProducts = [
  {
    name: "Blue VIP",
    description: "Parfum S · 100 ml",
    price: "50 DH",
    family: "S",
    stock: 18,
    image: "/assets/yara/products/blue-vip.jpg",
  },
  {
    name: "Boous",
    description: "Parfum K · 100 ml",
    price: "50 DH",
    family: "K",
    stock: 12,
    image: "/assets/yara/products/boous.jpg",
  },
  {
    name: "Miniatures Al Anama",
    description: "Coffret 4 x 15 ml",
    price: "60 DH",
    family: "V",
    stock: 7,
    image: "/assets/yara/products/miniatures-anana.jpg",
  },
  {
    name: "Miniatures Blue VIP",
    description: "Coffret 4 x 15 ml",
    price: "60 DH",
    family: "V",
    stock: 3,
    lowStock: true,
    image: "/assets/yara/products/miniatures-blue-vip.jpg",
  },
  {
    name: "Monsieur",
    description: "Parfum V · 100 ml",
    price: "80 DH",
    family: "V",
    stock: 5,
    image: "/assets/yara/products/monsieur.jpg",
  },
];

const cartItems = [
  {
    name: "Blue VIP",
    family: "S",
    unitPrice: "50 DH",
    quantity: 2,
    stock: 18,
    total: "100 DH",
    image: "/assets/yara/products/blue-vip.jpg",
  },
  {
    name: "Boous",
    family: "K",
    unitPrice: "50 DH",
    quantity: 1,
    stock: 12,
    total: "50 DH",
    image: "/assets/yara/products/boous.jpg",
  },
  {
    name: "Miniatures Blue VIP",
    family: "V",
    unitPrice: "60 DH",
    quantity: 3,
    stock: 3,
    total: "180 DH",
    image: "/assets/yara/products/miniatures-blue-vip.jpg",
    adjusted: true,
  },
];

const syncStats = [
  {
    label: "À envoyer",
    value: "5",
    detail: "gardés sur ce téléphone",
    icon: ClockIcon,
    tone: "pending",
  },
  {
    label: "Sauvegardés",
    value: "28",
    detail: "envoyés aujourd'hui",
    icon: CheckCircledIcon,
    tone: "success",
  },
  {
    label: "À corriger",
    value: "0",
    detail: "aucun rejet",
    icon: CrossCircledIcon,
    tone: "clear",
  },
];

const pendingSyncItems = [
  {
    title: "Vente Épicerie Al Manar",
    detail: "330 DH · reçu prêt",
    status: "À envoyer",
  },
  {
    title: "Encaissement Bazar Saada",
    detail: "210 DH · espèces",
    status: "À envoyer",
  },
  {
    title: "Visite Kiosque El Fath",
    detail: "Marquée à 11:20",
    status: "À envoyer",
  },
];

// Build app-specific screens and flows in this file. The surrounding mobile
// runtime is template-owned and intentionally lives outside this component.
export default function Prototype() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [screen, setScreen] = useState<ScreenName>(() => {
    const params = new URLSearchParams(window.location.search);
    const initialScreen = params.get("screen");
    if (
      initialScreen === "activation" ||
      initialScreen === "clients" ||
      initialScreen === "client" ||
      initialScreen === "catalogue" ||
      initialScreen === "panier" ||
      initialScreen === "livraison" ||
      initialScreen === "synchronisation"
    ) {
      return initialScreen;
    }
    return "accueil";
  });
  const { setDeviceId } = useMobileDevice();
  const themeLabel = useMemo(
    () => (theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"),
    [theme],
  );

  useEffect(() => {
    setDeviceId("pixel-10");
  }, [setDeviceId]);

  function showScreen(nextScreen: ScreenName) {
    setScreen(nextScreen);
    const url = new URL(window.location.href);
    if (nextScreen === "accueil") {
      url.searchParams.delete("screen");
    } else {
      url.searchParams.set("screen", nextScreen);
    }
    window.history.replaceState({}, "", url);
  }

  const hasBottomNavigation = screen !== "activation";
  const activeBottomScreen =
    screen === "client" ? "clients" : screen === "livraison" ? "panier" : screen;

  return (
    <div className={`seller-app-shell seller-screen theme-${theme} ${hasBottomNavigation ? "seller-app-shell-with-nav" : ""}`}>
      <MobileScroll className="seller-scroll-page">
        {screen === "activation" ? (
          <ActivationScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onActivate={() => showScreen("accueil")}
          />
        ) : screen === "clients" ? (
          <ClientsScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : screen === "client" ? (
          <ClientDetailScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : screen === "catalogue" ? (
          <CatalogueScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : screen === "panier" ? (
          <CartScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : screen === "livraison" ? (
          <DeliveryPaymentScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : screen === "synchronisation" ? (
          <SynchronisationScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : (
          <DashboardScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        )}
      </MobileScroll>

      {hasBottomNavigation ? (
        <BottomNavigation activeScreen={activeBottomScreen} onNavigate={showScreen} />
      ) : null}
    </div>
  );
}

function BrandHeader({
  theme,
  themeLabel,
  onToggleTheme,
  compact = false,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  compact?: boolean;
}) {
  return (
    <header className={`brand-header ${compact ? "brand-header-compact" : ""}`}>
      <img
        className="brand-logo"
        src="/assets/yara/logo-yara.png"
        alt="YARA"
        draggable={false}
      />
      <button
        className="theme-toggle"
        type="button"
        aria-label={themeLabel}
        onClick={onToggleTheme}
        data-scroll-drag="ignore"
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
    </header>
  );
}

function ActivationScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onActivate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onActivate: () => void;
}) {
  return (
      <main className="activation-shell" aria-label="Connexion et activation RS">
        <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} />

        <section className="identity-panel" aria-labelledby="activation-title">
          <div className="seller-mark" aria-hidden="true">
            <IdCardIcon />
          </div>
          <h1 id="activation-title">Activation responsable de secteur</h1>
          <p>Connectez-vous pour commencer votre journée.</p>
        </section>

        <section className="assignment-card" aria-label="Affectation du commercial">
          {activationRows.map(({ label, value, icon: Icon, status }) => (
            <div className="assignment-row" key={label}>
              <span className="row-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="row-label">{label}</span>
              {status ? (
                <span className="connection-chip">
                  <CheckCircledIcon />
                  {value}
                </span>
              ) : (
                <span className="row-value">{value}</span>
              )}
            </div>
          ))}
        </section>

        <button className="primary-action" type="button" onClick={onActivate} data-scroll-drag="ignore">
          Activer / Se connecter
        </button>

        <p className="sync-note">Dernière sync : 12/08/2026 09:28</p>
      </main>
  );
}

function DashboardScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="dashboard-shell dashboard-reference-shell" aria-label="Accueil du jour">
      <section className="home-reference-content">
        <header className="home-reference-header">
          <div className="home-brand-lockup" aria-label="YARA">
            <span className="home-brand-mark" aria-hidden="true">
              <IdCardIcon />
            </span>
            <div>
              <strong>YARA</strong>
              <span>YARAA.MA</span>
            </div>
          </div>

          <div className="home-seller-copy">
            <h1>Bonjour Karim</h1>
            <p>RS-4821-CASA · V-204 · Casa Nord</p>
          </div>

          <div className="home-status-stack">
            <div className="home-status-actions">
              <button
                className="home-theme-button"
                type="button"
                aria-label={themeLabel}
                onClick={onToggleTheme}
                data-scroll-drag="ignore"
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>
              <span className="home-online-chip">
                <GlobeIcon />
                En ligne
              </span>
            </div>
            <button
              className="home-sync-status"
              type="button"
              onClick={() => onNavigate("synchronisation")}
              data-scroll-drag="ignore"
            >
              Synchro 08:30 · <strong>2 à envoyer</strong>
            </button>
          </div>
        </header>

        <section className="progression-panel" aria-label="Ma progression">
          <div className="home-section-title">
            <BarChartIcon />
            <h2>Ma progression</h2>
          </div>

          <div className="progress-gauge-grid">
            <article className="progress-gauge-card">
              <h3>CA TTC encaissé</h3>
              <div className="semi-gauge" style={{ "--gauge-angle": "148deg" } as CSSProperties}>
                <span className="semi-gauge-icon">
                  <ValueIcon />
                </span>
              </div>
              <p>
                <strong>123 000</strong> / 150 000 DH
              </p>
              <em>82,0 %</em>
            </article>

            <article className="progress-gauge-card">
              <h3>MCS validée</h3>
              <div className="semi-gauge" style={{ "--gauge-angle": "140deg" } as CSSProperties}>
                <span className="semi-gauge-icon">
                  <CheckCircledIcon />
                </span>
              </div>
              <p>
                <strong>12 090</strong> / 15 500 DH
              </p>
              <em>78,0 %</em>
            </article>
          </div>

          <article className="retained-performance-card">
            <span aria-hidden="true">
              <StarFilledIcon />
            </span>
            <div>
              <strong>Performance retenue <em>78,0 %</em></strong>
              <p>Frein actuel : <b>MCS</b></p>
              <small>Le pourcentage le plus bas détermine votre performance retenue.</small>
            </div>
          </article>
        </section>

        <section className="next-level-card" aria-label="Prochain niveau">
          <div>
            <span className="next-level-label">
              <BarChartIcon />
              Prochain niveau · 80 %
            </span>
            <strong>+400 DH</strong>
            <p>CA atteint <CheckCircledIcon /> · Il manque 310 DH de MCS</p>
            <small>Développez <b>K</b> et <em>V</em> pour accélérer</small>
          </div>
          <div className="level-rail" aria-hidden="true">
            {[80, 85, 90, 95, 100].map((level) => (
              <span className={level === 80 ? "level-dot level-dot-active" : "level-dot"} key={level}>
                {level}
              </span>
            ))}
          </div>
        </section>

        <section className="remuneration-card" aria-label="Ma rémunération variable">
          <div className="light-section-title">
            <CardStackIcon />
            <h2>Ma rémunération variable</h2>
          </div>
          <div className="remuneration-grid">
            <article>
              <span>5 % MCS</span>
              <strong>604,50 <small>DH</small></strong>
              <em className="pill-orange">Généré provisoire</em>
            </article>
            <article>
              <span>Prime progression</span>
              <strong>0 <small>DH</small></strong>
              <em>En attente 0 DH</em>
            </article>
            <article>
              <span>Estimation actuelle</span>
              <strong>604,50 <small>DH</small></strong>
              <em className="pill-green">Validé 0 DH</em>
            </article>
          </div>
          <p>Sous réserve de clôture et validation.</p>
        </section>

        <section className="levers-card" aria-label="Mes leviers">
          <div className="light-section-title">
            <LightningBoltIcon />
            <h2>Mes leviers</h2>
          </div>
          <div className="lever-grid">
            <article className="lever-item lever-s">
              <span>S · Base</span>
              <strong>40 %</strong>
              <i />
            </article>
            <article className="lever-item lever-k">
              <span>K · Accélérateur</span>
              <strong>35 %</strong>
              <i />
            </article>
            <article className="lever-item lever-v">
              <span>V · Turbo</span>
              <strong>25 %</strong>
              <i />
            </article>
          </div>
        </section>

        <section className="home-summary-grid" aria-label="Résumé opérationnel">
          <article>
            <span>
              <CalendarIcon />
            </span>
            <div>
              <strong>Aujourd'hui</strong>
              <em>19 650 DH</em>
              <p>encaissés<br />3 clients restants</p>
            </div>
          </article>
          <article>
            <span>
              <CardStackIcon />
            </span>
            <div>
              <strong>Caisse théorique</strong>
              <em>19 650 DH</em>
              <p>Espèces 9 200<br />Chèques 10 450</p>
            </div>
          </article>
          <article>
            <span>
              <BoxIcon />
            </span>
            <div>
              <strong>Stock véhicule</strong>
              <em>89 unités</em>
              <p className="stock-alert"><ExclamationTriangleIcon /> 2 références faibles</p>
            </div>
          </article>
        </section>

        <section className="home-reference-actions" aria-label="Actions rapides">
          <button className="tour-button" type="button" onClick={() => onNavigate("clients")} data-scroll-drag="ignore">
            Continuer ma tournée
            <ChevronRightIcon />
          </button>
          <button className="new-sale-reference-button" type="button" onClick={() => onNavigate("panier")} data-scroll-drag="ignore">
            Nouvelle vente
          </button>
        </section>
      </section>
    </main>
  );
}

function ClientsScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="clients-shell" aria-label="Clients et tournée">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="clients-content">
        <div className="clients-topline">
          <div>
            <p className="eyebrow">Casablanca Nord</p>
            <h1>Clients / Tournée</h1>
            <p className="assignment-summary">19 clients secteur · 8 à visiter</p>
          </div>
          <button className="compact-sale-button" type="button" data-scroll-drag="ignore">
            <PlusIcon />
            Nouvelle vente
          </button>
        </div>

        <label className="client-search" htmlFor="client-search">
          <MagnifyingGlassIcon aria-hidden="true" />
          <KeyboardInput
            id="client-search"
            aria-label="Rechercher un client"
            placeholder="Rechercher un client, téléphone..."
            data-testid="client-search"
          />
        </label>

        <div className="client-filters" aria-label="Filtres clients">
          {clientFilters.map((filter) => (
            <button
              className={`client-filter ${filter.active ? "client-filter-active" : ""}`}
              type="button"
              key={filter.label}
              data-scroll-drag="ignore"
            >
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>

        <section className="client-list" aria-label="Liste des clients du secteur">
          {sectorClients.map((client, index) => (
            <article
              className={`client-card ${client.priority ? "client-card-priority" : ""}`}
              key={client.name}
              onClick={() => onNavigate("client")}
            >
              <span className="client-rank" aria-hidden="true">
                {index + 1}
              </span>
              <div className="client-details">
                <div className="client-title-row">
                  <h2>{client.name}</h2>
                  {client.priority ? (
                    <span className="priority-indicator" aria-label="Client prioritaire">
                      <StarFilledIcon />
                    </span>
                  ) : null}
                </div>
                <p className="client-locality">
                  <DrawingPinFilledIcon />
                  {client.locality}
                </p>
                <p className="client-purchase">
                  <ClockIcon />
                  Dernier achat : <strong>{client.lastPurchase}</strong>
                </p>
                <span className={`visit-status ${client.status === "À relancer" ? "visit-status-warning" : ""}`}>
                  {client.status}
                </span>
              </div>
              <button
                className="client-sale-action"
                type="button"
                aria-label={`Nouvelle vente pour ${client.name}`}
                onClick={(event) => event.stopPropagation()}
                data-scroll-drag="ignore"
              >
                <PlusIcon />
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function ClientDetailScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="client-detail-shell" aria-label="Fiche client">
      <header className="detail-header">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Retour aux clients"
          onClick={() => onNavigate("clients")}
          data-scroll-drag="ignore"
        >
          <ArrowLeftIcon />
        </button>
        <img className="detail-logo" src="/assets/yara/logo-yara.png" alt="YARA" draggable={false} />
        <div className="header-actions">
          <button
            className="header-icon-button"
            type="button"
            aria-label={themeLabel}
            onClick={onToggleTheme}
            data-scroll-drag="ignore"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="header-icon-button" type="button" aria-label="Plus d'options" data-scroll-drag="ignore">
            <DotsVerticalIcon />
          </button>
        </div>
      </header>

      <section className="client-detail-content">
        <section className="client-hero-card" aria-labelledby="client-title">
          <div className="client-avatar" aria-hidden="true">
            <BookmarkFilledIcon />
          </div>
          <div className="client-hero-copy">
            <span className="detail-eyebrow">Nom commercial</span>
            <div className="client-heading-row">
              <h1 id="client-title">Épicerie Al Manar</h1>
              <StarFilledIcon />
            </div>
            <p>Code client : CLT-01452</p>
            <div className="client-status-row">
              <span className="status-pill status-pill-active">
                <CheckCircledIcon />
                Actif
              </span>
              <span className="status-pill">Prioritaire</span>
            </div>
          </div>
        </section>

        <section className="client-info-grid" aria-label="Informations client">
          {clientInfo.map(({ label, value, icon: Icon, wide }) => (
            <article className={`client-info-card ${wide ? "client-info-card-wide" : ""}`} key={label}>
              <span className="info-card-icon" aria-hidden="true">
                <Icon />
              </span>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </article>
          ))}
        </section>

        <button className="map-action" type="button" data-scroll-drag="ignore">
          <DrawingPinFilledIcon />
          Voir la localisation sur la carte
        </button>

        <section className="client-section-card" aria-label="Historique récent">
          <div className="section-card-title">
            <div>
              <span className="detail-eyebrow">Historique récent</span>
              <h2>Dernières opérations</h2>
            </div>
            <ChevronRightIcon />
          </div>
          <div className="history-list">
            {recentHistory.map((item) => (
              <div className="history-row" key={`${item.date}-${item.value}`}>
                <span>{item.date}</span>
                <strong>{item.label}</strong>
                <em>{item.value}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="client-notes-card" aria-label="Notes commerciales">
          <div className="notes-icon" aria-hidden="true">
            <ChatBubbleIcon />
          </div>
          <div>
            <span className="detail-eyebrow">Notes commerciales</span>
            <p>Client sensible aux ruptures. Proposer Blue VIP et miniatures à chaque passage.</p>
          </div>
        </section>

        <section className="detail-actions" aria-label="Actions fiche client">
          <button className="secondary-detail-action" type="button" data-scroll-drag="ignore">
            <CheckCircledIcon />
            Marquer visite
          </button>
          <button className="primary-detail-action" type="button" data-scroll-drag="ignore">
            <PlusIcon />
            Nouvelle vente
          </button>
        </section>
      </section>
    </main>
  );
}

function CatalogueScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="catalogue-shell" aria-label="Catalogue et produits véhicule">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="catalogue-content">
        <div className="catalogue-topline">
          <div>
            <p className="eyebrow">Stock véhicule</p>
            <h1>Catalogue / Produits</h1>
            <p className="assignment-summary">26 références disponibles · Dacia Dokker</p>
          </div>
          <div className="cart-summary" aria-label="Panier">
            <span>Panier</span>
            <strong>3</strong>
          </div>
        </div>

        <label className="product-search" htmlFor="product-search">
          <MagnifyingGlassIcon aria-hidden="true" />
          <KeyboardInput
            id="product-search"
            aria-label="Rechercher un produit"
            placeholder="Rechercher un produit..."
            data-testid="product-search"
          />
        </label>

        <div className="product-filters" aria-label="Filtres produits">
          {productFilters.map((filter) => (
            <button
              className={`product-filter ${filter.active ? "product-filter-active" : ""}`}
              type="button"
              key={filter.label}
              data-scroll-drag="ignore"
            >
              {filter.label}
            </button>
          ))}
        </div>

        <section className="product-list" aria-label="Produits disponibles dans le véhicule">
          {vehicleProducts.map((product) => (
            <article className={`product-card ${product.lowStock ? "product-card-low" : ""}`} key={product.name}>
              <img className="product-thumb" src={product.image} alt={product.name} draggable={false} />
              <div className="product-main">
                <div className="product-name-row">
                  <h2>{product.name}</h2>
                  <span className={`family-badge family-${product.family.toLowerCase()}`}>{product.family}</span>
                </div>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span>
                  Prix TTC <strong>{product.price}</strong>
                </span>
                <span className={product.lowStock ? "stock-value stock-value-low" : "stock-value"}>
                  {product.lowStock ? "Stock faible" : "Stock"} <strong>{product.stock}</strong>
                </span>
              </div>
            </div>
              <button
                className="add-product-action"
                type="button"
                aria-label={`Ajouter ${product.name} au panier`}
                data-scroll-drag="ignore"
              >
                <PlusIcon />
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function CartScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="cart-shell" aria-label="Panier et vente">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="cart-content">
        <div className="cart-topline">
          <div>
            <p className="eyebrow">Vente en cours</p>
            <h1>Panier / Vente</h1>
            <p className="assignment-summary">Dernière vérification avant validation</p>
          </div>
          <button className="cart-trash-button" type="button" aria-label="Vider le panier" data-scroll-drag="ignore">
            <TrashIcon />
          </button>
        </div>

        <section className="selected-client-card" aria-label="Client sélectionné">
          <div className="selected-client-icon" aria-hidden="true">
            <BookmarkFilledIcon />
          </div>
          <div>
            <span>Client sélectionné</span>
            <strong>Épicerie Al Manar</strong>
            <p>Ain Sebaâ · Code CLT-01452</p>
          </div>
          <button type="button" className="change-client-button" data-scroll-drag="ignore">
            Changer
          </button>
        </section>

        <section className="cart-items" aria-label="Produits ajoutés">
          {cartItems.map((item) => (
            <article className={`cart-item ${item.adjusted ? "cart-item-adjusted" : ""}`} key={item.name}>
              <div className="cart-item-main">
                <div className="cart-item-title">
                  <h2>{item.name}</h2>
                  <span className={`family-badge family-${item.family.toLowerCase()}`}>{item.family}</span>
                </div>
                <p>Prix TTC : <strong>{item.unitPrice}</strong> · Stock : <strong>{item.stock}</strong></p>
              </div>
              <div className="quantity-row" aria-label={`Quantité ${item.name}`}>
                <button type="button" data-scroll-drag="ignore" aria-label={`Diminuer ${item.name}`}>
                  <MinusIcon />
                </button>
                <strong>{item.quantity}</strong>
                <button type="button" data-scroll-drag="ignore" aria-label={`Augmenter ${item.name}`}>
                  <PlusIcon />
                </button>
              </div>
              <div className="cart-line-total">
                <span>Total</span>
                <strong>{item.total}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="stock-control-card" aria-label="Contrôle stock">
          <div className="stock-control-main">
            <span className="stock-control-icon" aria-hidden="true">
              <CheckCircledIcon />
            </span>
            <div>
              <strong>Stock contrôlé</strong>
              <p>Toutes les quantités validables sont disponibles dans le véhicule.</p>
            </div>
          </div>
          <div className="stock-warning-line">
            <CrossCircledIcon />
            <span>Miniatures Blue VIP : 4 demandés, 3 disponibles. Quantité limitée à 3.</span>
          </div>
        </section>

        <section className="cart-total-card" aria-label="Total de la vente">
          <div className="cart-total-row">
            <span>Sous-total TTC</span>
            <strong>330 DH</strong>
          </div>
          <div className="cart-total-row">
            <span>Remise</span>
            <strong>0 DH</strong>
          </div>
          <div className="cart-grand-total">
            <span>Total TTC</span>
            <strong>330 DH</strong>
          </div>
        </section>

        <button
          className="confirm-sale-button"
          type="button"
          onClick={() => onNavigate("livraison")}
          data-scroll-drag="ignore"
        >
          Confirmer vente
        </button>
      </section>
    </main>
  );
}

function DeliveryPaymentScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="delivery-shell" aria-label="Livraison et encaissement">
      <header className="detail-header">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Retour au panier"
          onClick={() => onNavigate("panier")}
          data-scroll-drag="ignore"
        >
          <ArrowLeftIcon />
        </button>
        <img className="detail-logo" src="/assets/yara/logo-yara.png" alt="YARA" draggable={false} />
        <div className="header-actions">
          <button
            className="header-icon-button"
            type="button"
            aria-label={themeLabel}
            onClick={onToggleTheme}
            data-scroll-drag="ignore"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="header-icon-button" type="button" aria-label="Aperçu reçu" data-scroll-drag="ignore">
            <FileTextIcon />
          </button>
        </div>
      </header>

      <section className="delivery-content">
        <div className="delivery-topline">
          <div>
            <p className="eyebrow">Validation finale</p>
            <h1>Livraison + Encaissement</h1>
            <p className="assignment-summary">CMD-20260812-014 · Épicerie Al Manar</p>
          </div>
          <span className="connection-chip delivery-online-chip">
            <CheckCircledIcon />
            En ligne
          </span>
        </div>

        <section className="delivery-summary-card" aria-label="Résumé vente">
          <div className="delivery-summary-head">
            <span className="delivery-summary-icon" aria-hidden="true">
              <CardStackIcon />
            </span>
            <div>
              <span>Résumé vente</span>
              <strong>3 produits validés</strong>
            </div>
            <em>330 DH</em>
          </div>
          <div className="delivery-lines">
            {cartItems.map((item) => (
              <div className="delivery-line" key={item.name}>
                <span>{item.name}</span>
                <strong>x{item.quantity}</strong>
                <em>{item.total}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="delivery-confirmation-card" aria-label="Confirmation livraison">
          <span className="delivery-confirmation-icon" aria-hidden="true">
            <CheckCircledIcon />
          </span>
          <div>
            <strong>Livraison confirmée</strong>
            <p>Commande remise au client à Ain Sebaâ · 12:45</p>
          </div>
        </section>

        <section className="payment-check-card" aria-label="Validation de l'encaissement">
          <div className="amount-grid">
            <article className="amount-card amount-card-expected">
              <span>Montant TTC attendu</span>
              <strong>330 DH</strong>
            </article>
            <label className="amount-card amount-card-received" htmlFor="received-amount">
              <span>Montant encaissé</span>
              <div className="amount-input-wrap">
                <KeyboardInput
                  id="received-amount"
                  aria-label="Montant encaissé"
                  defaultValue="330"
                  inputMode="numeric"
                  data-testid="received-amount"
                />
                <em>DH</em>
              </div>
            </label>
          </div>

          <button className="payment-method-select" type="button" data-scroll-drag="ignore">
            <span className="payment-method-icon" aria-hidden="true">
              <ValueIcon />
            </span>
            <div>
              <span>Moyen de paiement</span>
              <strong>Espèces</strong>
            </div>
            <ChevronRightIcon />
          </button>

          <div className="exact-amount-message" role="status">
            <CheckCircledIcon />
            <span>Le montant encaissé doit être exact : 330 DH attendus, 330 DH reçus.</span>
          </div>
        </section>

        <section className="receipt-preview-card" aria-label="Aperçu du reçu numéroté">
          <div className="receipt-preview-head">
            <span className="receipt-preview-icon" aria-hidden="true">
              <FileTextIcon />
            </span>
            <div>
              <span>Aperçu du reçu</span>
              <strong>Reçu N° RC-2026-0812-014</strong>
            </div>
            <em>12:46</em>
          </div>
          <div className="receipt-preview-list">
            <div>
              <span>Client</span>
              <strong>Épicerie Al Manar</strong>
            </div>
            <div>
              <span>Total TTC</span>
              <strong>330 DH</strong>
            </div>
            <div>
              <span>Payé</span>
              <strong>Espèces · 330 DH</strong>
            </div>
          </div>
        </section>

        <button className="generate-receipt-button" type="button" data-scroll-drag="ignore">
          Générer reçu
        </button>
      </section>
    </main>
  );
}

function SynchronisationScreen({
  theme,
  themeLabel,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <main className="sync-shell" aria-label="Synchronisation">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="sync-content">
        <div className="sync-topline">
          <div>
            <p className="eyebrow">Sauvegarde de la journée</p>
            <h1>Synchronisation</h1>
            <p className="assignment-summary">RS Youssef · Casablanca Nord</p>
          </div>
          <span className="connection-chip sync-online-chip">
            <CheckCircledIcon />
            En ligne
          </span>
        </div>

        <section className="sync-hero-card" aria-label="État de sauvegarde">
          <span className="sync-hero-icon" aria-hidden="true">
            <ReloadIcon />
          </span>
          <div>
            <span className="detail-eyebrow">État actuel</span>
            <h2>À synchroniser</h2>
            <p>5 éléments attendent l'envoi. Rien n'est perdu, tout est gardé sur ce téléphone.</p>
          </div>
        </section>

        <section className="last-sync-card" aria-label="Dernière synchronisation">
          <div>
            <span>Dernière synchronisation</span>
            <strong>12/08/2026 à 10:28</strong>
          </div>
          <em>Il y a 32 min</em>
        </section>

        <section className="sync-stat-grid" aria-label="Résumé synchronisation">
          {syncStats.map(({ label, value, detail, icon: Icon, tone }) => (
            <article className={`sync-stat-card sync-stat-${tone}`} key={label}>
              <span className="sync-stat-icon" aria-hidden="true">
                <Icon />
              </span>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{detail}</small>
            </article>
          ))}
        </section>

        <section className="sync-queue-card" aria-label="Opérations en attente">
          <div className="sync-section-title">
            <div>
              <span className="detail-eyebrow">À envoyer</span>
              <h2>Opérations en attente</h2>
            </div>
            <strong>5</strong>
          </div>

          <div className="sync-queue-list">
            {pendingSyncItems.map((item) => (
              <article className="sync-queue-row" key={item.title}>
                <span className="sync-row-dot" aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <em>{item.status}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="sync-message-card" aria-label="Message simple">
          <CheckCircledIcon />
          <div>
            <strong>Vos données sont en sécurité.</strong>
            <p>Appuyez sur le bouton dès que le réseau est stable.</p>
          </div>
        </section>

        <button className="sync-now-button" type="button" data-scroll-drag="ignore">
          <ReloadIcon />
          Synchroniser maintenant
        </button>
      </section>
    </main>
  );
}

function BottomNavigation({
  activeScreen,
  onNavigate,
}: {
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {bottomTabs.map(({ label, icon: Icon, screen, featured }) => (
        <button
          type="button"
          className={`bottom-tab ${screen === activeScreen ? "bottom-tab-active" : ""} ${featured ? "bottom-tab-featured" : ""}`}
          key={label}
          onClick={screen ? () => onNavigate(screen) : undefined}
          data-scroll-drag="ignore"
        >
          <span className="bottom-icon">
            <Icon />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
