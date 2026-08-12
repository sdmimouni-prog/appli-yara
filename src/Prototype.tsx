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
import { KeyboardInput, MobileScroll, useKeyboard } from "./mobile";
import { useMobileDevice } from "./mobile";

type ScreenName =
  | "activation"
  | "accueil"
  | "clients"
  | "carte"
  | "client"
  | "catalogue"
  | "stock"
  | "panier"
  | "livraison"
  | "historique"
  | "caisse"
  | "synchronisation";

type SaleCycleStep = "commande" | "livraison" | "encaissement" | "recu";
type DeliveryCycleState = "livraison" | "encaissement" | "recu" | "termine";
type StockDetailFilter = "all" | "low" | "rupture";

const yaraLogoLockup = "/assets/yara/logo-yara-lockup.png";

const saleCycleSteps = [
  { key: "commande", label: "Commande", icon: CardStackIcon },
  { key: "livraison", label: "Livraison", icon: RocketIcon },
  { key: "encaissement", label: "Encaissement", icon: ValueIcon },
  { key: "recu", label: "Reçu", icon: FileTextIcon },
] satisfies Array<{
  key: SaleCycleStep;
  label: string;
  icon: typeof CardStackIcon;
}>;

type SalesHistoryFilter = "all" | "today" | "receipts" | "canceled";

const activationRows = [
  {
    label: "Identifiant RS",
    value: "RS-4821-CASA",
    icon: IdCardIcon,
  },
  {
    label: "Véhicule",
    value: "Sprinter V-204",
    icon: RocketIcon,
  },
  {
    label: "Secteur",
    value: "Casa Nord · Tit Mellil",
    icon: SewingPinIcon,
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
  { label: "Stock", icon: CubeIcon, screen: "stock" },
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

const tourMapStops = [
  {
    index: 1,
    name: "Épicerie Al Manar",
    locality: "Ain Sebaâ",
    distance: "1,2 km",
    eta: "6 min",
    status: "À visiter",
    priority: true,
    x: 24,
    y: 34,
  },
  {
    index: 2,
    name: "Bazar Saada",
    locality: "Hay Mohammadi",
    distance: "2,1 km",
    eta: "11 min",
    status: "À visiter",
    priority: true,
    x: 52,
    y: 24,
  },
  {
    index: 3,
    name: "Supérette Al Amal",
    locality: "Sidi Moumen",
    distance: "3,0 km",
    eta: "16 min",
    status: "À visiter",
    priority: false,
    x: 74,
    y: 45,
  },
  {
    index: 4,
    name: "Kiosque El Fath",
    locality: "Roches Noires",
    distance: "3,4 km",
    eta: "18 min",
    status: "À visiter",
    priority: false,
    x: 61,
    y: 70,
  },
  {
    index: 5,
    name: "Épicerie Badr",
    locality: "Oulfa",
    distance: "3,8 km",
    eta: "22 min",
    status: "À relancer",
    priority: true,
    x: 28,
    y: 72,
  },
] satisfies Array<{
  index: number;
  name: string;
  locality: string;
  distance: string;
  eta: string;
  status: string;
  priority: boolean;
  x: number;
  y: number;
}>;

const routeSegments = [
  { width: 92, left: 22, top: 118, rotate: -18 },
  { width: 82, left: 135, top: 118, rotate: 30 },
  { width: 96, left: 194, top: 188, rotate: 73 },
  { width: 82, left: 132, top: 280, rotate: 158 },
  { width: 88, left: 70, top: 274, rotate: -76 },
] satisfies Array<{
  width: number;
  left: number;
  top: number;
  rotate: number;
}>;

const tourDistanceStats = [
  { label: "Distance totale", value: "13,5 km" },
  { label: "Temps estimé", value: "1h14" },
  { label: "Clients restants", value: "5" },
] satisfies Array<{
  label: string;
  value: string;
}>;

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

const stockDetailFilters = [
  { key: "all", label: "Inventaire", count: 26 },
  { key: "low", label: "Stock faible", count: 3 },
  { key: "rupture", label: "Ruptures", count: 2 },
] satisfies Array<{
  key: StockDetailFilter;
  label: string;
  count: number;
}>;

const stockInventoryItems = [
  {
    sku: "Y-S-BVIP-100",
    name: "Blue VIP",
    family: "S",
    price: "50 DH",
    loaded: 24,
    sold: 6,
    reserved: 0,
    remaining: 18,
    threshold: 6,
    value: "900 DH",
    coverage: "OK",
    status: "ok",
    image: "/assets/yara/products/blue-vip.jpg",
  },
  {
    sku: "Y-K-BOOUS-100",
    name: "Boous",
    family: "K",
    price: "50 DH",
    loaded: 18,
    sold: 6,
    reserved: 0,
    remaining: 12,
    threshold: 6,
    value: "600 DH",
    coverage: "OK",
    status: "ok",
    image: "/assets/yara/products/boous.jpg",
  },
  {
    sku: "Y-V-MBV-4X15",
    name: "Miniatures Blue VIP",
    family: "V",
    price: "60 DH",
    loaded: 14,
    sold: 10,
    reserved: 1,
    remaining: 3,
    threshold: 5,
    value: "180 DH",
    coverage: "Faible",
    status: "low",
    image: "/assets/yara/products/miniatures-blue-vip.jpg",
  },
  {
    sku: "Y-V-MONS-100",
    name: "Monsieur",
    family: "V",
    price: "80 DH",
    loaded: 10,
    sold: 5,
    reserved: 0,
    remaining: 5,
    threshold: 5,
    value: "400 DH",
    coverage: "Limite",
    status: "low",
    image: "/assets/yara/products/monsieur.jpg",
  },
  {
    sku: "Y-V-MANA-4X15",
    name: "Miniatures Al Anama",
    family: "V",
    price: "60 DH",
    loaded: 12,
    sold: 5,
    reserved: 0,
    remaining: 7,
    threshold: 5,
    value: "420 DH",
    coverage: "OK",
    status: "ok",
    image: "/assets/yara/products/miniatures-anana.jpg",
  },
  {
    sku: "Y-K-BORUS-100",
    name: "Borus",
    family: "K",
    price: "50 DH",
    loaded: 8,
    sold: 8,
    reserved: 0,
    remaining: 0,
    threshold: 4,
    value: "0 DH",
    coverage: "Rupture",
    status: "rupture",
    image: "/assets/yara/products/boous.jpg",
  },
  {
    sku: "Y-S-BLACK-100",
    name: "Black Legend",
    family: "S",
    price: "70 DH",
    loaded: 6,
    sold: 6,
    reserved: 0,
    remaining: 0,
    threshold: 3,
    value: "0 DH",
    coverage: "Rupture",
    status: "rupture",
    image: "/assets/yara/products/monsieur.jpg",
  },
] satisfies Array<{
  sku: string;
  name: string;
  family: "S" | "K" | "V";
  price: string;
  loaded: number;
  sold: number;
  reserved: number;
  remaining: number;
  threshold: number;
  value: string;
  coverage: string;
  status: "ok" | "low" | "rupture";
  image: string;
}>;

const stockMovementItems = [
  {
    time: "12:46",
    title: "Sortie vente",
    detail: "Épicerie Al Manar · Blue VIP x2 · Boous x1 · Miniatures Blue VIP x3",
    quantity: "-6",
    tone: "sale",
  },
  {
    time: "11:58",
    title: "Sortie vente",
    detail: "Bazar Saada · Monsieur x1 · Blue VIP x2",
    quantity: "-3",
    tone: "sale",
  },
  {
    time: "08:30",
    title: "Chargement véhicule",
    detail: "Dépôt Casa Nord · 26 références confirmées",
    quantity: "+89",
    tone: "load",
  },
  {
    time: "08:10",
    title: "Contrôle initial",
    detail: "Écart 0 DH · scellé véhicule validé",
    quantity: "OK",
    tone: "check",
  },
] satisfies Array<{
  time: string;
  title: string;
  detail: string;
  quantity: string;
  tone: "sale" | "load" | "check";
}>;

const stockRuptureItems = [
  {
    product: "Borus",
    detail: "Rupture complète · 4 clients habituels à prévenir",
    needed: "+12 unités",
    priority: "Critique",
  },
  {
    product: "Black Legend",
    detail: "Rupture complète · demandé par 2 prospects",
    needed: "+8 unités",
    priority: "Haute",
  },
  {
    product: "Miniatures Blue VIP",
    detail: "Reste 3 unités · seuil minimum 5",
    needed: "+10 unités",
    priority: "À recharger",
  },
] satisfies Array<{
  product: string;
  detail: string;
  needed: string;
  priority: string;
}>;

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

const salesHistoryFilters = [
  { key: "all", label: "Toutes", count: 9 },
  { key: "today", label: "Aujourd'hui", count: 6 },
  { key: "receipts", label: "Reçus", count: 7 },
  { key: "canceled", label: "Annulations", count: 2 },
] satisfies Array<{
  key: SalesHistoryFilter;
  label: string;
  count: number;
}>;

const salesHistoryItems = [
  {
    id: "VNT-20260812-014",
    date: "12/08/2026",
    time: "12:46",
    client: "Épicerie Al Manar",
    locality: "Ain Sebaâ",
    amount: "330 DH",
    payment: "Espèces",
    products: "Blue VIP x2 · Boous x1 · Miniatures Blue VIP x3",
    receipt: "RC-2026-0812-014",
    status: "Reçu généré",
    type: "receipt",
  },
  {
    id: "VNT-20260812-013",
    date: "12/08/2026",
    time: "11:58",
    client: "Bazar Saada",
    locality: "Hay Mohammadi",
    amount: "210 DH",
    payment: "Espèces",
    products: "Monsieur x1 · Blue VIP x2",
    receipt: "RC-2026-0812-013",
    status: "Reçu envoyé",
    type: "receipt",
  },
  {
    id: "VNT-20260812-012",
    date: "12/08/2026",
    time: "10:34",
    client: "Supérette Al Amal",
    locality: "Sidi Moumen",
    amount: "480 DH",
    payment: "Chèque",
    products: "Miniatures Al Anama x4 · Boous x4",
    receipt: "RC-2026-0812-012",
    status: "À synchroniser",
    type: "sale",
  },
  {
    id: "ANN-20260812-002",
    date: "12/08/2026",
    time: "09:50",
    client: "Kiosque El Fath",
    locality: "Roches Noires",
    amount: "-120 DH",
    payment: "Annulation",
    products: "Blue VIP x1 · Boous x1",
    receipt: "Aucun reçu",
    reason: "Client absent à la livraison",
    status: "Annulée",
    type: "canceled",
  },
  {
    id: "VNT-20260812-011",
    date: "12/08/2026",
    time: "09:12",
    client: "Épicerie Badr",
    locality: "Oulfa",
    amount: "560 DH",
    payment: "Espèces",
    products: "Monsieur x2 · Miniatures Blue VIP x5",
    receipt: "RC-2026-0812-011",
    status: "Reçu généré",
    type: "receipt",
  },
  {
    id: "VNT-20260811-010",
    date: "11/08/2026",
    time: "17:22",
    client: "Parfumerie Noor",
    locality: "Casa Centre",
    amount: "1 240 DH",
    payment: "Espèces",
    products: "Mix S/K/V · 18 unités",
    receipt: "RC-2026-0811-010",
    status: "Synchronisée",
    type: "receipt",
  },
  {
    id: "ANN-20260811-001",
    date: "11/08/2026",
    time: "15:08",
    client: "Market Salam",
    locality: "Ain Sebaâ",
    amount: "-300 DH",
    payment: "Annulation",
    products: "Monsieur x3 · Blue VIP x1",
    receipt: "Reçu annulé RC-2026-0811-008",
    reason: "Erreur de quantité saisie",
    status: "Annulée",
    type: "canceled",
  },
  {
    id: "VNT-20260811-009",
    date: "11/08/2026",
    time: "13:40",
    client: "Épicerie Al Manar",
    locality: "Ain Sebaâ",
    amount: "2 450 DH",
    payment: "Chèque",
    products: "Commande complète · 42 unités",
    receipt: "RC-2026-0811-009",
    status: "Synchronisée",
    type: "receipt",
  },
  {
    id: "VNT-20260810-006",
    date: "10/08/2026",
    time: "16:05",
    client: "Bazar Atlas",
    locality: "Tit Mellil",
    amount: "980 DH",
    payment: "Espèces",
    products: "Blue VIP x8 · Miniatures Al Anama x5",
    receipt: "RC-2026-0810-006",
    status: "Synchronisée",
    type: "receipt",
  },
] satisfies Array<{
  id: string;
  date: string;
  time: string;
  client: string;
  locality: string;
  amount: string;
  payment: string;
  products: string;
  receipt: string;
  reason?: string;
  status: string;
  type: "sale" | "receipt" | "canceled";
}>;

const cashBreakdownItems = [
  { label: "Billets 200 DH", quantity: "31", amount: "6 200 DH" },
  { label: "Billets 100 DH", quantity: "16", amount: "1 600 DH" },
  { label: "Billets 50 DH", quantity: "20", amount: "1 000 DH" },
  { label: "Monnaie", quantity: "lot", amount: "400 DH" },
] satisfies Array<{
  label: string;
  quantity: string;
  amount: string;
}>;

const chequeRemittanceItems = [
  {
    reference: "CHQ-7841",
    client: "Bazar Saada",
    bank: "Attijariwafa",
    amount: "3 120 DH",
    status: "Signé",
  },
  {
    reference: "CHQ-7839",
    client: "Épicerie Al Manar",
    bank: "BMCE",
    amount: "2 450 DH",
    status: "Signé",
  },
  {
    reference: "CHQ-7837",
    client: "Pharmacie Hay Nour",
    bank: "CIH",
    amount: "2 990 DH",
    status: "Signé",
  },
  {
    reference: "CHQ-7835",
    client: "Supérette Al Amal",
    bank: "SGMB",
    amount: "1 890 DH",
    status: "À vérifier",
  },
] satisfies Array<{
  reference: string;
  client: string;
  bank: string;
  amount: string;
  status: string;
}>;

const cashClosingChecks = [
  { label: "Ventes du jour", value: "8", detail: "Toutes dans la caisse" },
  { label: "Reçus générés", value: "8", detail: "Aucun reçu manquant" },
  { label: "Écart constaté", value: "0 DH", detail: "Caisse équilibrée", success: true },
] satisfies Array<{
  label: string;
  value: string;
  detail: string;
  success?: boolean;
}>;

function parseDhAmount(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
}

function formatDhAmount(value: number) {
  return `${value.toLocaleString("fr-FR").replace(/\u202f/g, " ")} DH`;
}

// Build app-specific screens and flows in this file. The surrounding mobile
// runtime is template-owned and intentionally lives outside this component.
export default function Prototype() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [screen, setScreen] = useState<ScreenName>(() => {
    const params = new URLSearchParams(window.location.search);
    const initialScreen = params.get("screen");
    if (
      initialScreen === "activation" ||
      initialScreen === "clients" ||
      initialScreen === "carte" ||
      initialScreen === "client" ||
      initialScreen === "catalogue" ||
      initialScreen === "stock" ||
      initialScreen === "panier" ||
      initialScreen === "livraison" ||
      initialScreen === "historique" ||
      initialScreen === "caisse" ||
      initialScreen === "synchronisation"
    ) {
      return initialScreen;
    }
    return "accueil";
  });
  const { setDeviceId } = useMobileDevice();
  const keyboard = useKeyboard();
  const themeLabel = useMemo(
    () => (theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"),
    [theme],
  );

  useEffect(() => {
    setDeviceId("pixel-10");
  }, [setDeviceId]);

  function showScreen(nextScreen: ScreenName) {
    keyboard.hide();
    setScreen(nextScreen);
    const url = new URL(window.location.href);
    if (nextScreen === "accueil") {
      url.searchParams.delete("screen");
    } else {
      url.searchParams.set("screen", nextScreen);
    }
    window.history.replaceState({}, "", url);
  }

  function handleLogin() {
    setIsAuthenticated(true);
    showScreen("accueil");
  }

  function handleLogout() {
    setIsAuthenticated(false);
    showScreen("activation");
  }

  const visibleScreen = isAuthenticated ? screen : "activation";
  const hasBottomNavigation = isAuthenticated && visibleScreen !== "activation";
  const activeBottomScreen =
    visibleScreen === "client"
      ? "clients"
      : visibleScreen === "carte"
        ? "clients"
      : visibleScreen === "livraison"
        ? "panier"
        : visibleScreen === "historique"
          ? "synchronisation"
          : visibleScreen === "caisse"
            ? "synchronisation"
            : visibleScreen === "catalogue"
              ? "stock"
          : visibleScreen;

  return (
    <div className={`seller-app-shell seller-screen theme-${theme} ${hasBottomNavigation ? "seller-app-shell-with-nav" : ""}`}>
      <MobileScroll className="seller-scroll-page">
        {visibleScreen === "activation" ? (
          <ActivationScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onActivate={handleLogin}
          />
        ) : visibleScreen === "clients" ? (
          <ClientsScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "carte" ? (
          <TourMapScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "client" ? (
          <ClientDetailScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "stock" ? (
          <StockDetailScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "catalogue" ? (
          <CatalogueScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "panier" ? (
          <CartScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "livraison" ? (
          <DeliveryPaymentScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "historique" ? (
          <SalesHistoryScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "caisse" ? (
          <CashClosingScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
          />
        ) : visibleScreen === "synchronisation" ? (
          <SynchronisationScreen
            theme={theme}
            themeLabel={themeLabel}
            onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            onNavigate={showScreen}
            onLogout={handleLogout}
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
        src={yaraLogoLockup}
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
  const [pinLogin, setPinLogin] = useState("");
  const pinKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "fingerprint", "0", "delete"];

  function submitLogin() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onActivate();
  }

  function handlePinKey(key: string) {
    if (key === "fingerprint") {
      submitLogin();
      return;
    }

    if (key === "delete") {
      setPinLogin((current) => current.slice(0, -1));
      return;
    }

    setPinLogin((current) => (current.length >= 6 ? current : `${current}${key}`));
  }

  return (
    <main className="activation-shell activation-reference-shell" aria-label="Connexion et activation RS">
      <header className="login-topbar">
        <div className="login-brand-lockup" aria-label="YARA application RS">
          <img className="login-brand-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
          <span className="login-brand-subtitle">Application RS</span>
        </div>

        <div className="login-security-actions">
          <button
            className="login-theme-toggle"
            type="button"
            aria-label={themeLabel}
            onClick={onToggleTheme}
            data-scroll-drag="ignore"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <span className="secure-terminal-chip">
            <CheckCircledIcon />
            Terminal sécurisé
          </span>
        </div>
      </header>

      <section className="login-welcome" aria-labelledby="activation-title">
        <h1 id="activation-title">
          Bienvenue chez <span>YARA</span>
        </h1>
        <p>Connectez-vous pour commencer votre tournée.</p>
      </section>

      <section className="rs-profile-card" aria-label="Responsable de secteur">
        <span className="rs-profile-badge" aria-hidden="true">
          <CheckCircledIcon />
        </span>
        <div className="rs-profile-copy">
          <p>Responsable de secteur</p>
          <h2>Karim BENNANI</h2>
          <div className="rs-profile-list">
            {activationRows.map(({ label, value, icon: Icon }) => (
              <span key={label}>
                <Icon />
                {label} : <strong>{value}</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pin-login-card" aria-label="Connexion par code PIN">
        <h2>Entrez votre code PIN</h2>
        <div className="pin-dots" aria-label={`${pinLogin.length} chiffre(s) saisi(s)`}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={index < pinLogin.length ? "pin-dot pin-dot-filled" : "pin-dot"} key={index} />
          ))}
        </div>

        <div className="pin-keypad" aria-label="Clavier numérique">
          {pinKeys.map((key) => (
            <button
              className={`pin-key ${key === "fingerprint" || key === "delete" ? "pin-key-action" : ""}`}
              type="button"
              key={key}
              aria-label={key === "fingerprint" ? "Connexion par empreinte" : key === "delete" ? "Effacer" : `Chiffre ${key}`}
              onClick={() => handlePinKey(key)}
              data-scroll-drag="ignore"
            >
              {key === "fingerprint" ? <IdCardIcon /> : key === "delete" ? <CrossCircledIcon /> : key}
            </button>
          ))}
        </div>

        <button className="pin-login-button" type="button" onClick={submitLogin} data-scroll-drag="ignore">
          Se connecter
        </button>

        <p className="fingerprint-note">
          <IdCardIcon />
          Empreinte disponible
        </p>
      </section>

      <footer className="login-footer">
        <p>
          <CheckCircledIcon />
          Données chiffrées · Accès personnel · Révocation à distance
        </p>
        <p>
          <ClockIcon />
          Dernière configuration reçue : <strong>aujourd'hui à 08:30</strong>
        </p>
        <p>
          <MobileIcon />
          Besoin d'aide ? <strong>Contacter le superviseur</strong>
        </p>
      </footer>
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
            <img className="home-brand-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
            <span>YARAA.MA</span>
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

        <button className="tour-map-entry-card" type="button" onClick={() => onNavigate("carte")} data-scroll-drag="ignore">
          <span className="tour-map-entry-icon" aria-hidden="true">
            <GlobeIcon />
          </span>
          <span>
            <strong>Carte tournée / GPS</strong>
            <small>5 clients · 13,5 km · prochain arrêt dans 6 min</small>
          </span>
          <ChevronRightIcon />
        </button>

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

function TourMapScreen({
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
  const nextStop = tourMapStops[0];

  return (
    <main className="tour-map-shell" aria-label="Carte tournée GPS">
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
        <img className="detail-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
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
          <button className="header-icon-button" type="button" aria-label="Recentrer carte" data-scroll-drag="ignore">
            <DrawingPinFilledIcon />
          </button>
        </div>
      </header>

      <section className="tour-map-content">
        <div className="tour-map-topline">
          <div>
            <p className="eyebrow">Tournée GPS</p>
            <h1>Carte tournée</h1>
            <p className="assignment-summary">Casa Nord · Départ dépôt 08:30</p>
          </div>
          <span className="tour-gps-chip">
            <GlobeIcon />
            GPS actif
          </span>
        </div>

        <section className="tour-route-summary" aria-label="Résumé itinéraire">
          {tourDistanceStats.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="tour-map-card" aria-label="Carte des clients">
          <div className="tour-map-toolbar">
            <span>
              <SewingPinIcon />
              Itinéraire optimisé
            </span>
            <strong>+18 % rapide</strong>
          </div>

          <div className="tour-map-canvas" aria-hidden="true">
            <div className="tour-map-grid tour-map-grid-a" />
            <div className="tour-map-grid tour-map-grid-b" />
            <div className="tour-map-road tour-map-road-main" />
            <div className="tour-map-road tour-map-road-second" />
            <div className="tour-map-road tour-map-road-third" />
            {routeSegments.map((segment, index) => (
              <span
                className="tour-route-segment"
                style={{
                  width: `${segment.width}px`,
                  left: `${segment.left}px`,
                  top: `${segment.top}px`,
                  transform: `rotate(${segment.rotate}deg)`,
                }}
                key={`${segment.left}-${index}`}
              />
            ))}
            <span className="tour-vehicle-marker">
              <RocketIcon />
            </span>
            {tourMapStops.map((stop) => (
              <span
                className={`tour-client-marker ${stop.priority ? "tour-client-marker-priority" : ""}`}
                style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                key={stop.name}
              >
                {stop.index}
              </span>
            ))}
            <div className="tour-map-zone tour-map-zone-north">Casa Nord</div>
            <div className="tour-map-zone tour-map-zone-east">Sidi Moumen</div>
            <div className="tour-map-zone tour-map-zone-south">Roches Noires</div>
          </div>
        </section>

        <section className="next-stop-card" aria-label="Prochain client">
          <span className="next-stop-icon" aria-hidden="true">
            <DrawingPinFilledIcon />
          </span>
          <div>
            <span className="detail-eyebrow">Prochain arrêt</span>
            <strong>{nextStop.name}</strong>
            <p>{nextStop.locality} · {nextStop.distance} · arrivée estimée {nextStop.eta}</p>
          </div>
          <button type="button" onClick={() => onNavigate("client")} data-scroll-drag="ignore">
            Ouvrir
          </button>
        </section>

        <section className="tour-map-actions" aria-label="Actions GPS">
          <button className="tour-gps-primary" type="button" data-scroll-drag="ignore">
            <RocketIcon />
            Démarrer GPS
          </button>
          <button className="tour-gps-secondary" type="button" data-scroll-drag="ignore">
            <ReloadIcon />
            Optimiser
          </button>
        </section>

        <section className="tour-stop-list-card" aria-label="Itinéraire clients">
          <div className="tour-stop-title">
            <div>
              <span className="detail-eyebrow">Itinéraire</span>
              <h2>5 arrêts programmés</h2>
            </div>
            <button type="button" onClick={() => onNavigate("clients")} data-scroll-drag="ignore">
              Liste
            </button>
          </div>

          <div className="tour-stop-list">
            {tourMapStops.map((stop) => (
              <article className={`tour-stop-row ${stop.priority ? "tour-stop-priority" : ""}`} key={stop.name}>
                <span className="tour-stop-number">{stop.index}</span>
                <div>
                  <strong>{stop.name}</strong>
                  <p>{stop.locality} · {stop.status}</p>
                </div>
                <div className="tour-stop-distance">
                  <strong>{stop.distance}</strong>
                  <em>{stop.eta}</em>
                </div>
              </article>
            ))}
          </div>
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
        <img className="detail-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
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

        <button className="map-action" type="button" onClick={() => onNavigate("carte")} data-scroll-drag="ignore">
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

function StockDetailScreen({
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
  const [activeFilter, setActiveFilter] = useState<StockDetailFilter>("all");
  const displayedStockItems = stockInventoryItems.filter((item) => {
    if (activeFilter === "low") return item.status === "low";
    if (activeFilter === "rupture") return item.status === "rupture";
    return true;
  });

  return (
    <main className="stock-detail-shell" aria-label="Stock détaillé véhicule">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="stock-detail-content">
        <div className="stock-detail-topline">
          <div>
            <p className="eyebrow">Inventaire véhicule</p>
            <h1>Stock détaillé</h1>
            <p className="assignment-summary">Sprinter V-204 · Casa Nord</p>
          </div>
          <span className="stock-status-chip">
            <CubeIcon />
            89 unités
          </span>
        </div>

        <section className="stock-detail-hero-card" aria-label="Valeur du stock véhicule">
          <span className="stock-detail-hero-icon" aria-hidden="true">
            <BoxIcon />
          </span>
          <div>
            <span className="detail-eyebrow">Valeur embarquée</span>
            <strong>48 350 DH</strong>
            <p>26 références · 3 stocks faibles · 2 ruptures à traiter</p>
          </div>
          <em>Contrôle 12:40</em>
        </section>

        <section className="stock-detail-kpi-grid" aria-label="Indicateurs stock">
          <article className="stock-detail-kpi-card">
            <span className="stock-detail-kpi-icon" aria-hidden="true">
              <CubeIcon />
            </span>
            <strong>89</strong>
            <span>Unités restantes</span>
          </article>
          <article className="stock-detail-kpi-card">
            <span className="stock-detail-kpi-icon" aria-hidden="true">
              <CardStackIcon />
            </span>
            <strong>26</strong>
            <span>Références</span>
          </article>
          <article className="stock-detail-kpi-card stock-detail-kpi-warning">
            <span className="stock-detail-kpi-icon" aria-hidden="true">
              <ExclamationTriangleIcon />
            </span>
            <strong>3</strong>
            <span>À recharger</span>
          </article>
          <article className="stock-detail-kpi-card stock-detail-kpi-danger">
            <span className="stock-detail-kpi-icon" aria-hidden="true">
              <CrossCircledIcon />
            </span>
            <strong>2</strong>
            <span>Ruptures</span>
          </article>
        </section>

        <label className="stock-detail-search" htmlFor="stock-detail-search">
          <MagnifyingGlassIcon aria-hidden="true" />
          <KeyboardInput
            id="stock-detail-search"
            aria-label="Rechercher dans le stock détaillé"
            placeholder="Produit, famille, référence..."
            data-testid="stock-detail-search"
          />
        </label>

        <div className="stock-detail-filter-row" aria-label="Filtres stock détaillé">
          {stockDetailFilters.map((filter) => (
            <button
              className={`stock-detail-filter ${filter.key === activeFilter ? "stock-detail-filter-active" : ""}`}
              type="button"
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              data-scroll-drag="ignore"
            >
              {filter.label}
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>

        <section className="stock-inventory-card" aria-label="Inventaire détaillé">
          <div className="stock-detail-section-title">
            <div>
              <span className="detail-eyebrow">Inventaire</span>
              <h2>{displayedStockItems.length} référence(s)</h2>
            </div>
            <strong>{activeFilter === "all" ? "Complet" : stockDetailFilters.find((filter) => filter.key === activeFilter)?.label}</strong>
          </div>

          <div className="stock-inventory-list">
            {displayedStockItems.map((item) => {
              const remainingPercent = Math.min(100, Math.round((item.remaining / Math.max(item.loaded, 1)) * 100));

              return (
                <article className={`stock-inventory-row stock-inventory-${item.status}`} key={item.sku}>
                  <img className="stock-inventory-thumb" src={item.image} alt={item.name} draggable={false} />
                  <div className="stock-inventory-main">
                    <div className="stock-inventory-head">
                      <div>
                        <span>{item.sku}</span>
                        <h2>{item.name}</h2>
                      </div>
                      <span className={`family-badge family-${item.family.toLowerCase()}`}>{item.family}</span>
                    </div>
                    <div className="stock-inventory-meta">
                      <span>Chargé <strong>{item.loaded}</strong></span>
                      <span>Sorti <strong>{item.sold}</strong></span>
                      <span>Réservé <strong>{item.reserved}</strong></span>
                    </div>
                    <div className="stock-progress-line" aria-label={`${item.remaining} unités restantes`}>
                      <span style={{ width: `${remainingPercent}%` }} />
                    </div>
                  </div>
                  <div className="stock-inventory-balance">
                    <strong>{item.remaining}</strong>
                    <span>reste</span>
                    <em className={`stock-detail-status stock-detail-status-${item.status}`}>{item.coverage}</em>
                    <small>{item.value}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="stock-movements-card" aria-label="Mouvements de stock">
          <div className="stock-detail-section-title">
            <div>
              <span className="detail-eyebrow">Mouvements</span>
              <h2>Journal du jour</h2>
            </div>
            <strong>12 août</strong>
          </div>

          <div className="stock-movement-list">
            {stockMovementItems.map((item) => (
              <article className={`stock-movement-row stock-movement-${item.tone}`} key={`${item.time}-${item.title}`}>
                <span className="stock-movement-time">{item.time}</span>
                <span className="stock-movement-icon" aria-hidden="true">
                  {item.tone === "sale" ? <MinusIcon /> : item.tone === "load" ? <PlusIcon /> : <CheckCircledIcon />}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <em>{item.quantity}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="stock-ruptures-card" aria-label="Ruptures et actions">
          <div className="stock-detail-section-title">
            <div>
              <span className="detail-eyebrow">Ruptures</span>
              <h2>À traiter</h2>
            </div>
            <strong>3 alertes</strong>
          </div>

          <div className="stock-rupture-list">
            {stockRuptureItems.map((item) => (
              <article className="stock-rupture-row" key={item.product}>
                <span className="stock-rupture-icon" aria-hidden="true">
                  <ExclamationTriangleIcon />
                </span>
                <div>
                  <strong>{item.product}</strong>
                  <p>{item.detail}</p>
                </div>
                <div className="stock-rupture-need">
                  <strong>{item.needed}</strong>
                  <em>{item.priority}</em>
                </div>
              </article>
            ))}
          </div>
        </section>

        <button className="stock-detail-primary-button" type="button" onClick={() => onNavigate("catalogue")} data-scroll-drag="ignore">
          Ouvrir catalogue vente
          <ChevronRightIcon />
        </button>
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
  const [saleItems, setSaleItems] = useState(() => cartItems);
  const subtotal = saleItems.reduce(
    (sum, item) => sum + parseDhAmount(item.unitPrice) * item.quantity,
    0,
  );
  const totalLabel = formatDhAmount(subtotal);
  const stockNoticeItem = saleItems.find((item) => item.quantity >= item.stock);
  const hasItems = saleItems.length > 0;

  function updateQuantity(name: string, direction: "decrease" | "increase") {
    setSaleItems((currentItems) =>
      currentItems.map((item) => {
        if (item.name !== name) return item;

        const nextQuantity =
          direction === "increase"
            ? Math.min(item.stock, item.quantity + 1)
            : Math.max(1, item.quantity - 1);

        return {
          ...item,
          quantity: nextQuantity,
        };
      }),
    );
  }

  return (
    <main className="cart-shell" aria-label="Panier et vente">
      <BrandHeader theme={theme} themeLabel={themeLabel} onToggleTheme={onToggleTheme} compact />

      <section className="cart-content">
        <div className="cart-topline">
          <div>
            <p className="eyebrow">Étape 1 sur 4</p>
            <h1>Commande</h1>
            <p className="assignment-summary">Préparez la commande avant livraison</p>
          </div>
          <button
            className="cart-trash-button"
            type="button"
            aria-label="Vider le panier"
            onClick={() => setSaleItems([])}
            data-scroll-drag="ignore"
          >
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
          <button
            type="button"
            className="change-client-button"
            onClick={() => onNavigate("clients")}
            data-scroll-drag="ignore"
          >
            Changer
          </button>
        </section>

        <section className="sale-cycle-card" aria-label="Cycle commande livraison encaissement reçu">
          <div className="sale-cycle-title">
            <span className="detail-eyebrow">Cycle de vente</span>
            <strong>Commande → Livraison → Encaissement → Reçu</strong>
          </div>
          <div className="sale-cycle-steps">
            {saleCycleSteps.map(({ key, label, icon: Icon }) => (
              <span
                className={`sale-cycle-step ${
                  key === "commande" ? "sale-cycle-step-active" : "sale-cycle-step-pending"
                }`}
                key={key}
              >
                <Icon />
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="cart-items" aria-label="Produits ajoutés">
          {hasItems ? saleItems.map((item) => {
            const lineTotal = formatDhAmount(parseDhAmount(item.unitPrice) * item.quantity);

            return (
            <article className={`cart-item ${item.adjusted ? "cart-item-adjusted" : ""}`} key={item.name}>
              <div className="cart-item-main">
                <div className="cart-item-title">
                  <h2>{item.name}</h2>
                  <span className={`family-badge family-${item.family.toLowerCase()}`}>{item.family}</span>
                </div>
                <p>Prix TTC : <strong>{item.unitPrice}</strong> · Stock : <strong>{item.stock}</strong></p>
              </div>
              <div className="quantity-row" aria-label={`Quantité ${item.name}`}>
                <button
                  type="button"
                  data-scroll-drag="ignore"
                  aria-label={`Diminuer ${item.name}`}
                  onClick={() => updateQuantity(item.name, "decrease")}
                >
                  <MinusIcon />
                </button>
                <strong>{item.quantity}</strong>
                <button
                  type="button"
                  data-scroll-drag="ignore"
                  aria-label={`Augmenter ${item.name}`}
                  onClick={() => updateQuantity(item.name, "increase")}
                >
                  <PlusIcon />
                </button>
              </div>
              <div className="cart-line-total">
                <span>Total</span>
                <strong>{lineTotal}</strong>
              </div>
            </article>
            );
          }) : (
            <article className="empty-cart-card">
              <strong>Panier vide</strong>
              <p>Ajoutez des produits depuis le catalogue ou changez de client.</p>
              <button type="button" onClick={() => onNavigate("catalogue")} data-scroll-drag="ignore">
                Voir le stock
              </button>
            </article>
          )}
        </section>

        <section className="stock-control-card" aria-label="Contrôle stock">
          <div className="stock-control-main">
            <span className="stock-control-icon" aria-hidden="true">
              <CheckCircledIcon />
            </span>
            <div>
              <strong>{hasItems ? "Stock contrôlé" : "Aucun produit sélectionné"}</strong>
              <p>
                {hasItems
                  ? "Toutes les quantités validables sont disponibles dans le véhicule."
                  : "Le panier est vide, aucune vente à valider pour le moment."}
              </p>
            </div>
          </div>
          {stockNoticeItem ? (
            <div className="stock-warning-line">
              <CrossCircledIcon />
              <span>
                {stockNoticeItem.name} : stock maximum atteint ({stockNoticeItem.stock} disponibles).
              </span>
            </div>
          ) : null}
        </section>

        <section className="cart-total-card" aria-label="Total de la vente">
          <div className="cart-total-row">
            <span>Sous-total TTC</span>
            <strong>{totalLabel}</strong>
          </div>
          <div className="cart-total-row">
            <span>Remise</span>
            <strong>0 DH</strong>
          </div>
          <div className="cart-grand-total">
            <span>Total TTC</span>
            <strong>{totalLabel}</strong>
          </div>
        </section>

        <button
          className="confirm-sale-button"
          type="button"
          onClick={() => {
            if (hasItems) onNavigate("livraison");
          }}
          disabled={!hasItems}
          data-scroll-drag="ignore"
        >
          Enregistrer commande
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
  const [cycleState, setCycleState] = useState<DeliveryCycleState>("livraison");
  const currentCycleStep: SaleCycleStep = cycleState === "termine" ? "recu" : cycleState;
  const currentCycleIndex = saleCycleSteps.findIndex((step) => step.key === currentCycleStep);
  const deliveryDone = cycleState === "encaissement" || cycleState === "recu" || cycleState === "termine";
  const paymentDone = cycleState === "recu" || cycleState === "termine";
  const receiptDone = cycleState === "termine";

  function getCycleStatus(step: SaleCycleStep) {
    const stepIndex = saleCycleSteps.findIndex((item) => item.key === step);
    if (step === "commande") return "done";
    if (cycleState === "termine") return "done";
    if (stepIndex < currentCycleIndex) return "done";
    if (stepIndex === currentCycleIndex) return "current";
    return "pending";
  }

  function handleCycleAction() {
    if (cycleState === "livraison") {
      setCycleState("encaissement");
      return;
    }

    if (cycleState === "encaissement") {
      setCycleState("recu");
      return;
    }

    if (cycleState === "recu") {
      setCycleState("termine");
      return;
    }

    onNavigate("historique");
  }

  const primaryActionLabel =
    cycleState === "livraison"
      ? "Confirmer livraison"
      : cycleState === "encaissement"
        ? "Valider encaissement exact"
        : cycleState === "recu"
          ? "Générer reçu"
          : "Voir historique ventes";

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
        <img className="detail-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
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
            <p className="eyebrow">Cycle de vente</p>
            <h1>Commande à reçu</h1>
            <p className="assignment-summary">CMD-20260812-014 · Épicerie Al Manar</p>
          </div>
          <span className="connection-chip delivery-online-chip">
            <CheckCircledIcon />
            En ligne
          </span>
        </div>

        <section className="cycle-progress-card" aria-label="Progression commande livraison encaissement reçu">
          {saleCycleSteps.map(({ key, label, icon: Icon }) => {
            const status = getCycleStatus(key);

            return (
              <article className={`cycle-progress-step cycle-progress-${status}`} key={key}>
                <span aria-hidden="true">
                  {status === "done" ? <CheckCircledIcon /> : <Icon />}
                </span>
                <strong>{label}</strong>
              </article>
            );
          })}
        </section>

        <section className="delivery-summary-card" aria-label="Résumé vente">
          <div className="delivery-summary-head">
            <span className="delivery-summary-icon" aria-hidden="true">
              <CardStackIcon />
            </span>
            <div>
              <span>Commande enregistrée</span>
              <strong>CMD-20260812-014 · 3 produits</strong>
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

        <section
          className={`delivery-confirmation-card cycle-stage-card ${
            deliveryDone ? "cycle-stage-done" : "cycle-stage-current"
          }`}
          aria-label="Confirmation livraison"
        >
          <span className="delivery-confirmation-icon" aria-hidden="true">
            {deliveryDone ? <CheckCircledIcon /> : <RocketIcon />}
          </span>
          <div>
            <strong>{deliveryDone ? "Livraison confirmée" : "Livraison à confirmer"}</strong>
            <p>
              {deliveryDone
                ? "Commande remise au client à Ain Sebaâ · 12:45."
                : "Remettez les produits au client avant de passer à l'encaissement."}
            </p>
          </div>
        </section>

        <section
          className={`payment-check-card cycle-stage-card ${
            !deliveryDone ? "cycle-stage-locked" : paymentDone ? "cycle-stage-done" : "cycle-stage-current"
          }`}
          aria-label="Validation de l'encaissement"
        >
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
                  disabled={!deliveryDone || paymentDone}
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

          {!deliveryDone ? (
            <div className="cycle-locked-message" role="status">
              <ExclamationTriangleIcon />
              <span>Confirmez d'abord la livraison pour ouvrir l'encaissement.</span>
            </div>
          ) : paymentDone ? (
            <div className="exact-amount-message" role="status">
              <CheckCircledIcon />
              <span>Encaissement validé : 330 DH attendus, 330 DH reçus.</span>
            </div>
          ) : (
            <div className="cycle-active-message" role="status">
              <ValueIcon />
              <span>Le montant encaissé doit être exact avant de générer le reçu.</span>
            </div>
          )}
        </section>

        <section
          className={`receipt-preview-card cycle-stage-card ${
            !paymentDone ? "cycle-stage-locked" : receiptDone ? "cycle-stage-done" : "cycle-stage-current"
          }`}
          aria-label="Aperçu du reçu numéroté"
        >
          <div className="receipt-preview-head">
            <span className="receipt-preview-icon" aria-hidden="true">
              {receiptDone ? <CheckCircledIcon /> : <FileTextIcon />}
            </span>
            <div>
              <span>{receiptDone ? "Reçu généré" : paymentDone ? "Reçu à générer" : "Reçu verrouillé"}</span>
              <strong>{paymentDone ? "Reçu N° RC-2026-0812-014" : "Disponible après encaissement"}</strong>
            </div>
            <em>{receiptDone ? "12:46" : paymentDone ? "Prêt" : "En attente"}</em>
          </div>
          {paymentDone ? (
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
          ) : (
            <div className="cycle-locked-message cycle-locked-message-compact" role="status">
              <ExclamationTriangleIcon />
              <span>Validez l'encaissement exact pour préparer le reçu numéroté.</span>
            </div>
          )}
        </section>

        <button className="generate-receipt-button" type="button" onClick={handleCycleAction} data-scroll-drag="ignore">
          {primaryActionLabel}
        </button>
      </section>
    </main>
  );
}

function SalesHistoryScreen({
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
  const [activeFilter, setActiveFilter] = useState<SalesHistoryFilter>("all");
  const filteredItems = salesHistoryItems.filter((item) => {
    if (activeFilter === "today") return item.date === "12/08/2026";
    if (activeFilter === "receipts") return item.type === "receipt";
    if (activeFilter === "canceled") return item.type === "canceled";
    return true;
  });
  const todaySalesCount = salesHistoryItems.filter((item) => item.date === "12/08/2026" && item.type !== "canceled").length;
  const receiptCount = salesHistoryItems.filter((item) => item.type === "receipt").length;
  const canceledCount = salesHistoryItems.filter((item) => item.type === "canceled").length;

  return (
    <main className="history-shell" aria-label="Historique ventes">
      <header className="detail-header">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Retour à Plus"
          onClick={() => onNavigate("synchronisation")}
          data-scroll-drag="ignore"
        >
          <ArrowLeftIcon />
        </button>
        <img className="detail-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
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
          <button className="header-icon-button" type="button" aria-label="Rechercher une vente" data-scroll-drag="ignore">
            <MagnifyingGlassIcon />
          </button>
        </div>
      </header>

      <section className="history-content">
        <div className="history-topline">
          <div>
            <p className="eyebrow">Journal commercial</p>
            <h1>Historique ventes</h1>
            <p className="assignment-summary">Karim Bennani · Casa Nord</p>
          </div>
          <span className="history-date-chip">
            <CalendarIcon />
            12 août
          </span>
        </div>

        <section className="history-hero-card" aria-label="Résumé des ventes">
          <span className="history-hero-icon" aria-hidden="true">
            <FileTextIcon />
          </span>
          <div>
            <span className="detail-eyebrow">Aujourd'hui</span>
            <strong>19 650 DH</strong>
            <p>{todaySalesCount} ventes validées · {receiptCount} reçus disponibles · {canceledCount} annulations</p>
          </div>
        </section>

        <section className="history-stat-grid" aria-label="Indicateurs historique">
          <article className="history-stat-card history-stat-sales">
            <CheckCircledIcon />
            <strong>{todaySalesCount}</strong>
            <span>Ventes du jour</span>
          </article>
          <article className="history-stat-card history-stat-receipts">
            <FileTextIcon />
            <strong>{receiptCount}</strong>
            <span>Reçus émis</span>
          </article>
          <article className="history-stat-card history-stat-canceled">
            <CrossCircledIcon />
            <strong>{canceledCount}</strong>
            <span>Annulations</span>
          </article>
        </section>

        <div className="history-filter-row" aria-label="Filtres historique ventes">
          {salesHistoryFilters.map((filter) => (
            <button
              className={`history-filter ${filter.key === activeFilter ? "history-filter-active" : ""}`}
              type="button"
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              data-scroll-drag="ignore"
            >
              {filter.label}
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>

        <section className="history-list-card" aria-label="Liste des ventes">
          <div className="history-list-title">
            <div>
              <span className="detail-eyebrow">Transactions</span>
              <h2>{filteredItems.length} opération(s)</h2>
            </div>
            <em>{activeFilter === "all" ? "Toutes" : salesHistoryFilters.find((filter) => filter.key === activeFilter)?.label}</em>
          </div>

          <div className="history-sale-list">
            {filteredItems.map((item) => {
              const isCanceled = item.type === "canceled";
              const isReceipt = item.type === "receipt";
              const StatusIcon = isCanceled ? CrossCircledIcon : isReceipt ? FileTextIcon : CheckCircledIcon;

              return (
                <article className={`history-sale-card history-sale-${item.type}`} key={item.id}>
                  <div className="history-sale-head">
                    <span className="history-sale-icon" aria-hidden="true">
                      <StatusIcon />
                    </span>
                    <div>
                      <span>{item.id}</span>
                      <h2>{item.client}</h2>
                      <p>{item.locality} · {item.time}</p>
                    </div>
                    <strong>{item.amount}</strong>
                  </div>

                  <div className="history-sale-products">
                    <span>Produits</span>
                    <p>{item.products}</p>
                  </div>

                  <div className="history-sale-meta">
                    <span>
                      <CardStackIcon />
                      {item.payment}
                    </span>
                    <span>
                      <FileTextIcon />
                      {item.receipt}
                    </span>
                  </div>

                  {item.reason ? (
                    <div className="history-cancel-reason">
                      <ExclamationTriangleIcon />
                      {item.reason}
                    </div>
                  ) : null}

                  <div className="history-sale-footer">
                    <em>{item.status}</em>
                    <button type="button" data-scroll-drag="ignore">
                      {isCanceled ? "Voir annulation" : "Voir reçu"}
                      <ChevronRightIcon />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

function CashClosingScreen({
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
  const [isClosed, setIsClosed] = useState(false);

  return (
    <main className="cash-shell" aria-label="Caisse et remise de caisse">
      <header className="detail-header">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Retour à Plus"
          onClick={() => onNavigate("synchronisation")}
          data-scroll-drag="ignore"
        >
          <ArrowLeftIcon />
        </button>
        <img className="detail-logo" src={yaraLogoLockup} alt="YARA" draggable={false} />
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
          <button className="header-icon-button" type="button" aria-label="Reçu de remise" data-scroll-drag="ignore">
            <FileTextIcon />
          </button>
        </div>
      </header>

      <section className="cash-content">
        <div className="cash-topline">
          <div>
            <p className="eyebrow">Clôture journée</p>
            <h1>Caisse / Remise</h1>
            <p className="assignment-summary">Karim Bennani · Sprinter V-204</p>
          </div>
          <span className={`cash-status-chip ${isClosed ? "cash-status-closed" : ""}`}>
            {isClosed ? <CheckCircledIcon /> : <ClockIcon />}
            {isClosed ? "Clôturée" : "À remettre"}
          </span>
        </div>

        <section className="cash-hero-card" aria-label="Montant à remettre">
          <span className="cash-hero-icon" aria-hidden="true">
            <ValueIcon />
          </span>
          <div>
            <span className="detail-eyebrow">Montant à remettre</span>
            <strong>19 650 DH</strong>
            <p>Espèces 9 200 DH · Chèques 10 450 DH · Écart 0 DH</p>
          </div>
        </section>

        <section className="cash-mode-grid" aria-label="Répartition de la caisse">
          <article className="cash-mode-card cash-mode-cash">
            <span aria-hidden="true">
              <ValueIcon />
            </span>
            <div>
              <strong>9 200 DH</strong>
              <p>Espèces</p>
            </div>
          </article>
          <article className="cash-mode-card cash-mode-cheque">
            <span aria-hidden="true">
              <FileTextIcon />
            </span>
            <div>
              <strong>10 450 DH</strong>
              <p>Chèques · 4 pièces</p>
            </div>
          </article>
        </section>

        <section className="cash-count-card" aria-label="Détail espèces">
          <div className="cash-section-title">
            <div>
              <span className="detail-eyebrow">Détail espèces</span>
              <h2>Comptage rapide</h2>
            </div>
            <strong>9 200 DH</strong>
          </div>

          <div className="cash-breakdown-list">
            {cashBreakdownItems.map((item) => (
              <article className="cash-breakdown-row" key={item.label}>
                <span>{item.label}</span>
                <em>{item.quantity}</em>
                <strong>{item.amount}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="cheque-card" aria-label="Détail chèques">
          <div className="cash-section-title">
            <div>
              <span className="detail-eyebrow">Détail chèques</span>
              <h2>À déposer</h2>
            </div>
            <strong>10 450 DH</strong>
          </div>

          <div className="cheque-list">
            {chequeRemittanceItems.map((item) => (
              <article className="cheque-row" key={item.reference}>
                <span className="cheque-icon" aria-hidden="true">
                  <FileTextIcon />
                </span>
                <div>
                  <strong>{item.client}</strong>
                  <p>{item.reference} · {item.bank}</p>
                </div>
                <div className="cheque-amount">
                  <strong>{item.amount}</strong>
                  <em>{item.status}</em>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cash-closing-card" aria-label="Clôture de la journée">
          <div className="cash-section-title">
            <div>
              <span className="detail-eyebrow">Validation</span>
              <h2>Clôture journée</h2>
            </div>
            <strong>{isClosed ? "OK" : "Prêt"}</strong>
          </div>

          <div className="cash-input-grid">
            <label className="cash-input-card" htmlFor="cash-counted-amount">
              <span>Montant compté</span>
              <div>
                <KeyboardInput id="cash-counted-amount" defaultValue="19650" inputMode="numeric" aria-label="Montant compté" />
                <em>DH</em>
              </div>
            </label>
            <article className="cash-input-card cash-gap-card">
              <span>Écart</span>
              <strong>0 DH</strong>
            </article>
          </div>

          <div className="cash-check-grid">
            {cashClosingChecks.map((item) => (
              <article className={`cash-check-card ${item.success ? "cash-check-success" : ""}`} key={item.label}>
                {item.success ? <CheckCircledIcon /> : <CardStackIcon />}
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <div className={isClosed ? "cash-final-message cash-final-message-done" : "cash-final-message"}>
            {isClosed ? <CheckCircledIcon /> : <ExclamationTriangleIcon />}
            <span>
              {isClosed
                ? "Journée clôturée. La remise peut être déposée au responsable."
                : "Vérifiez espèces et chèques avant de clôturer la journée."}
            </span>
          </div>
        </section>

        <button className="close-day-button" type="button" onClick={() => setIsClosed(true)} data-scroll-drag="ignore">
          {isClosed ? "Journée clôturée" : "Clôturer la journée"}
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
  onLogout,
}: {
  theme: "light" | "dark";
  themeLabel: string;
  onToggleTheme: () => void;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
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

        <button className="sync-history-shortcut sync-cash-shortcut" type="button" onClick={() => onNavigate("caisse")} data-scroll-drag="ignore">
          <span className="sync-history-icon" aria-hidden="true">
            <ValueIcon />
          </span>
          <span>
            <strong>Caisse / Remise de caisse</strong>
            <small>Espèces, chèques et clôture journée</small>
          </span>
          <ChevronRightIcon />
        </button>

        <button className="sync-history-shortcut" type="button" onClick={() => onNavigate("historique")} data-scroll-drag="ignore">
          <span className="sync-history-icon" aria-hidden="true">
            <FileTextIcon />
          </span>
          <span>
            <strong>Historique ventes</strong>
            <small>Ventes faites, reçus et annulations</small>
          </span>
          <ChevronRightIcon />
        </button>

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

        <button className="logout-button" type="button" onClick={onLogout} data-scroll-drag="ignore">
          <CrossCircledIcon />
          Se déconnecter
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
