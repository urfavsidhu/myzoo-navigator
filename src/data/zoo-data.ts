export type ConservationStatus =
  | "Least Concern"
  | "Vulnerable"
  | "Endangered"
  | "Critically Endangered";

export type Animal = {
  id: string;
  name: string;
  scientificName: string;
  emoji: string;
  image: string;
  habitat: string;
  diet: string;
  facts: string[];
  status: ConservationStatus;
  feedingTime: string;
  enclosure: string;
  /** position on the zoo map, in percent */
  x: number;
  y: number;
};

export type FacilityKind =
  | "gate"
  | "restroom"
  | "food"
  | "water"
  | "firstaid"
  | "parking"
  | "accessible";

export type Facility = {
  id: string;
  name: string;
  kind: FacilityKind;
  description: string;
  x: number;
  y: number;
};

export type Tickets = {
  adult: string;
  child: string;
  student: string;
  foreign: string;
};

export type Show = {
  id: string;
  name: string;
  time: string;
  venue: string;
};

export type Zoo = {
  id: string;
  name: string;
  city: string;
  image: string;
  hours: string;
  closedOn: string;
  ticket: string;
  tickets: Tickets;
  shows: Show[];
  blurb: string;
  animalIds: string[];
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=60`;

export const animals: Animal[] = [
  {
    id: "royal-bengal-tiger",
    name: "Royal Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    emoji: "🐅",
    image: img("photo-1561731216-c3a4d99437d5"),
    habitat: "Sal forests, mangroves and grasslands of the Indian subcontinent",
    diet: "Carnivore — chital, sambar, wild boar",
    facts: [
      "No two tigers share the same stripe pattern.",
      "A tiger's roar carries up to 3 km through dense forest.",
      "It is the national animal of India.",
    ],
    status: "Endangered",
    feedingTime: "4:30 PM",
    enclosure: "Tiger Enclosure, Zone A",
    x: 24,
    y: 30,
  },
  {
    id: "asiatic-lion",
    name: "Asiatic Lion",
    scientificName: "Panthera leo persica",
    emoji: "🦁",
    image: img("photo-1546182990-dffeafbe841d"),
    habitat: "Dry deciduous scrub of the Gir landscape",
    diet: "Carnivore — deer, nilgai, buffalo",
    facts: [
      "Asiatic lions have a distinctive belly fold not seen in African lions.",
      "Males keep smaller manes, so their ears stay visible.",
    ],
    status: "Endangered",
    feedingTime: "5:00 PM",
    enclosure: "Lion Safari, Zone A",
    x: 40,
    y: 22,
  },
  {
    id: "indian-elephant",
    name: "Indian Elephant",
    scientificName: "Elephas maximus indicus",
    emoji: "🐘",
    image: img("photo-1557050543-4d5f4e07ef46"),
    habitat: "Tropical forests and grasslands",
    diet: "Herbivore — grass, bark, sugarcane, fruit",
    facts: [
      "An adult eats up to 150 kg of plants every day.",
      "Elephants greet each other by touching trunks.",
      "They communicate through rumbles below human hearing.",
    ],
    status: "Endangered",
    feedingTime: "11:00 AM",
    enclosure: "Elephant Yard, Zone B",
    x: 62,
    y: 33,
  },
  {
    id: "giraffe",
    name: "Giraffe",
    scientificName: "Giraffa camelopardalis",
    emoji: "🦒",
    image: img("photo-1547721064-da6cfb341d50"),
    habitat: "African savannah and open woodland",
    diet: "Herbivore — acacia leaves and shoots",
    facts: [
      "A giraffe's tongue is around 50 cm long and blue-black.",
      "They sleep for as little as 30 minutes a day.",
    ],
    status: "Vulnerable",
    feedingTime: "12:30 PM",
    enclosure: "Savannah Paddock, Zone B",
    x: 74,
    y: 24,
  },
  {
    id: "indian-leopard",
    name: "Indian Leopard",
    scientificName: "Panthera pardus fusca",
    emoji: "🐆",
    image: img("photo-1456926631375-92c8ce872def"),
    habitat: "Forests, rocky hills and farmland edges",
    diet: "Carnivore — monkeys, deer, small mammals",
    facts: [
      "Leopards haul kills into trees to keep them from scavengers.",
      "Their rosettes work as camouflage in dappled light.",
    ],
    status: "Vulnerable",
    feedingTime: "4:00 PM",
    enclosure: "Leopard Rock, Zone A",
    x: 16,
    y: 52,
  },
  {
    id: "sloth-bear",
    name: "Sloth Bear",
    scientificName: "Melursus ursinus",
    emoji: "🐻",
    image: img("photo-1530595467537-0b5996c41f2d"),
    habitat: "Dry forests and grasslands of India",
    diet: "Omnivore — termites, ants, honey, fruit",
    facts: [
      "It can close its nostrils to keep termites out while feeding.",
      "Cubs ride on their mother's back for months.",
    ],
    status: "Vulnerable",
    feedingTime: "3:30 PM",
    enclosure: "Bear House, Zone C",
    x: 34,
    y: 66,
  },
  {
    id: "mugger-crocodile",
    name: "Mugger Crocodile",
    scientificName: "Crocodylus palustris",
    emoji: "🐊",
    image: img("photo-1544890225-2f3faec4cd60"),
    habitat: "Rivers, marshes and village ponds",
    diet: "Carnivore — fish, turtles, birds",
    facts: [
      "Muggers dig burrows to escape summer heat.",
      "The sex of hatchlings depends on nest temperature.",
    ],
    status: "Vulnerable",
    feedingTime: "2:00 PM",
    enclosure: "Reptile Pool, Zone C",
    x: 55,
    y: 70,
  },
  {
    id: "indian-peafowl",
    name: "Indian Peafowl",
    scientificName: "Pavo cristatus",
    emoji: "🦚",
    image: img("photo-1518709766631-a6a7f45921c3"),
    habitat: "Open forest, farmland and village groves",
    diet: "Omnivore — seeds, insects, small snakes",
    facts: [
      "The train has around 200 feathers with shimmering eyespots.",
      "Peafowl call loudly before monsoon rain.",
    ],
    status: "Least Concern",
    feedingTime: "10:00 AM",
    enclosure: "Aviary Walk, Zone D",
    x: 80,
    y: 58,
  },
  {
    id: "spotted-deer",
    name: "Spotted Deer",
    scientificName: "Axis axis",
    emoji: "🦌",
    image: img("photo-1484406566174-9da000fda645"),
    habitat: "Grasslands and open forest",
    diet: "Herbivore — grass, leaves, fallen fruit",
    facts: [
      "Chital often feed under langur troops to catch dropped fruit.",
      "Herds warn each other with a sharp alarm bark.",
    ],
    status: "Least Concern",
    feedingTime: "9:30 AM",
    enclosure: "Deer Meadow, Zone D",
    x: 68,
    y: 50,
  },
  {
    id: "rhesus-macaque",
    name: "Rhesus Macaque",
    scientificName: "Macaca mulatta",
    emoji: "🐒",
    image: img("photo-1540573133985-87b6da6d54a9"),
    habitat: "Forests, towns and temple complexes",
    diet: "Omnivore — fruit, seeds, insects",
    facts: [
      "They store food in cheek pouches to eat later.",
      "Troops use over 20 distinct calls.",
    ],
    status: "Least Concern",
    feedingTime: "1:00 PM",
    enclosure: "Primate Island, Zone C",
    x: 46,
    y: 47,
  },
  {
    id: "hippopotamus",
    name: "Hippopotamus",
    scientificName: "Hippopotamus amphibius",
    emoji: "🦛",
    image: img("photo-1520302630591-fd1c66edc19d"),
    habitat: "Slow rivers and lakes of sub-Saharan Africa",
    diet: "Herbivore — grasses",
    facts: [
      "Hippos secrete a red oily 'sunscreen' from their skin.",
      "They can hold their breath for five minutes.",
    ],
    status: "Vulnerable",
    feedingTime: "3:00 PM",
    enclosure: "Hippo Pool, Zone B",
    x: 86,
    y: 38,
  },
  {
    id: "gharial",
    name: "Gharial",
    scientificName: "Gavialis gangeticus",
    emoji: "🐊",
    image: img("photo-1544890225-2f3faec4cd60"),
    habitat: "Deep, fast-flowing stretches of the Ganga and Chambal",
    diet: "Piscivore — fish",
    facts: [
      "Males grow a pot-shaped 'ghara' on the snout.",
      "The Chambal river holds the largest wild population.",
    ],
    status: "Critically Endangered",
    feedingTime: "2:30 PM",
    enclosure: "Gharial Channel, Zone C",
    x: 60,
    y: 82,
  },
];

export const facilities: Facility[] = [
  {
    id: "main-gate",
    name: "Main Entry Gate",
    kind: "gate",
    description: "Ticket counters, cloak room and visitor help desk.",
    x: 50,
    y: 93,
  },
  {
    id: "exit-gate",
    name: "Exit Gate 2",
    kind: "gate",
    description: "Nearest exit to the parking lot and bus stand.",
    x: 12,
    y: 88,
  },
  {
    id: "restroom-a",
    name: "Restroom — Zone A",
    kind: "restroom",
    description: "Washrooms with baby-changing station.",
    x: 30,
    y: 42,
  },
  {
    id: "restroom-c",
    name: "Restroom — Zone C",
    kind: "restroom",
    description: "Washrooms near the reptile section.",
    x: 44,
    y: 74,
  },
  {
    id: "food-court",
    name: "Jungle Food Court",
    kind: "food",
    description: "Snacks, thali, chai and cold drinks. Open 10 AM – 5 PM.",
    x: 58,
    y: 58,
  },
  {
    id: "water-1",
    name: "Drinking Water Point",
    kind: "water",
    description: "Chilled RO water, free for all visitors.",
    x: 36,
    y: 20,
  },
  {
    id: "water-2",
    name: "Drinking Water Point 2",
    kind: "water",
    description: "Water cooler beside the deer meadow.",
    x: 74,
    y: 66,
  },
  {
    id: "first-aid",
    name: "First Aid Centre",
    kind: "firstaid",
    description: "Nurse on duty, wheelchair and stretcher available.",
    x: 66,
    y: 88,
  },
  {
    id: "parking",
    name: "Visitor Parking",
    kind: "parking",
    description: "Two-wheeler and car parking, ₹20 – ₹50.",
    x: 88,
    y: 92,
  },
  {
    id: "accessible-route",
    name: "Wheelchair Route Start",
    kind: "accessible",
    description: "Step-free ramp path covering Zones A, B and the food court.",
    x: 22,
    y: 72,
  },
];

export const zoos: Zoo[] = [
  {
    id: "lucknow",
    name: "Nawab Wajid Ali Shah Zoological Garden",
    city: "Lucknow",
    image: img("photo-1534567110243-8875d64ca8ff"),
    hours: "8:00 AM – 5:00 PM",
    closedOn: "Mondays",
    ticket: "₹60 adult · ₹30 child",
    tickets: {
      adult: "₹60",
      child: "₹30",
      student: "₹40",
      foreign: "₹300",
    },
    shows: [
      { id: "lucknow-0", name: "Elephant Bath Show", time: "11:30 AM", venue: "Elephant Yard, Zone B" },
      { id: "lucknow-1", name: "Keeper Talk — Big Cats", time: "4:15 PM", venue: "Tiger Enclosure, Zone A" },
      { id: "lucknow-2", name: "Bird Flight Display", time: "10:15 AM", venue: "Aviary Walk, Zone D" },
    ],
    blurb: "Uttar Pradesh's oldest zoo, spread over 71 acres in the heart of Lucknow.",
    animalIds: animals.map((a) => a.id),
  },
  {
    id: "kanpur",
    name: "Kanpur Zoological Park",
    city: "Kanpur",
    image: img("photo-1503656142023-618e7d1f435a"),
    hours: "8:30 AM – 5:30 PM",
    closedOn: "Mondays",
    ticket: "₹50 adult · ₹25 child",
    tickets: {
      adult: "₹50",
      child: "₹25",
      student: "₹35",
      foreign: "₹250",
    },
    shows: [
      { id: "kanpur-0", name: "Elephant Bath Show", time: "11:00 AM", venue: "Elephant Yard, Zone B" },
      { id: "kanpur-1", name: "Keeper Talk — Sloth Bear", time: "3:45 PM", venue: "Bear House, Zone C" },
      { id: "kanpur-2", name: "Toy Train Ride", time: "1:30 PM", venue: "Central Plaza" },
    ],
    blurb: "One of Asia's largest forested zoos, built around natural woodland and lakes.",
    animalIds: [
      "royal-bengal-tiger",
      "asiatic-lion",
      "indian-elephant",
      "indian-leopard",
      "sloth-bear",
      "spotted-deer",
      "rhesus-macaque",
      "indian-peafowl",
      "mugger-crocodile",
      "hippopotamus",
    ],
  },
  {
    id: "etawah",
    name: "Etawah Safari Park",
    city: "Etawah",
    image: img("photo-1549366021-9f761d450615"),
    hours: "9:00 AM – 5:00 PM",
    closedOn: "Tuesdays",
    ticket: "₹150 adult · ₹75 child",
    tickets: {
      adult: "₹150",
      child: "₹75",
      student: "₹100",
      foreign: "₹500",
    },
    shows: [
      { id: "etawah-0", name: "Lion Safari Drive", time: "9:30 AM", venue: "Lion Safari, Zone A" },
      { id: "etawah-1", name: "Keeper Talk — Leopard", time: "4:00 PM", venue: "Leopard Rock, Zone A" },
      { id: "etawah-2", name: "Gharial Feeding Demo", time: "2:30 PM", venue: "Gharial Channel, Zone C" },
    ],
    blurb: "A lion breeding and safari park on the Chambal ravines.",
    animalIds: [
      "asiatic-lion",
      "royal-bengal-tiger",
      "indian-leopard",
      "sloth-bear",
      "spotted-deer",
      "gharial",
      "mugger-crocodile",
      "indian-peafowl",
    ],
  },
  {
    id: "gorakhpur",
    name: "Shaheed Ashfaqullah Khan Zoological Park",
    city: "Gorakhpur",
    image: img("photo-1520315342629-6ea920342047"),
    hours: "9:00 AM – 5:00 PM",
    closedOn: "Mondays",
    ticket: "₹70 adult · ₹35 child",
    tickets: {
      adult: "₹70",
      child: "₹35",
      student: "₹45",
      foreign: "₹350",
    },
    shows: [
      { id: "gorakhpur-0", name: "Night House Walk", time: "10:30 AM", venue: "Night House" },
      { id: "gorakhpur-1", name: "Keeper Talk — Tigers", time: "4:30 PM", venue: "Tiger Enclosure, Zone A" },
      { id: "gorakhpur-2", name: "Deer Feeding Demo", time: "9:30 AM", venue: "Deer Meadow, Zone D" },
    ],
    blurb: "The newest zoo in the state, with wide walkways and a night-house.",
    animalIds: [
      "royal-bengal-tiger",
      "indian-leopard",
      "sloth-bear",
      "spotted-deer",
      "rhesus-macaque",
      "indian-peafowl",
      "gharial",
      "giraffe",
      "hippopotamus",
    ],
  },
];

/** mock "you are here" position, in map percent */
export const youAreHere = { x: 50, y: 84 };

export const getAnimal = (id: string) => animals.find((a) => a.id === id);
export const getZoo = (id: string): Zoo =>
  zoos.find((z) => z.id === id) ?? (zoos[0] as Zoo);
export const zooAnimals = (zooId: string) => {
  const zoo = getZoo(zooId);
  return animals.filter((a) => zoo.animalIds.includes(a.id));
};

export const statusTone: Record<ConservationStatus, string> = {
  "Least Concern": "bg-leaf/15 text-leaf border-leaf/30",
  Vulnerable: "bg-sun/20 text-clay border-sun/40",
  Endangered: "bg-clay/15 text-clay border-clay/30",
  "Critically Endangered": "bg-destructive/15 text-destructive border-destructive/30",
};

const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.round(Math.hypot(ax - bx, ay - by) * 6.4);

export const distanceFrom = (
  from: { x: number; y: number },
  to: { x: number; y: number },
) => dist(from.x, from.y, to.x, to.y);

export const nearbyAnimals = (zooId: string, animalId: string) => {
  const target = getAnimal(animalId);
  if (!target) return [];
  return zooAnimals(zooId)
    .filter((a) => a.id !== animalId)
    .map((a) => ({ animal: a, distance: distanceFrom(target, a) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
};

export type Directions = {
  distance: number;
  minutes: number;
  steps: string[];
};

export const buildDirections = (
  to: { x: number; y: number; name: string },
): Directions => {
  const distance = distanceFrom(youAreHere, to);
  const minutes = Math.max(1, Math.round(distance / 75));
  const first = Math.max(20, Math.round(distance * 0.55 * 0.1) * 10);
  const second = Math.max(20, distance - first);
  const turn = to.x < youAreHere.x ? "Turn Left" : "Turn Right";
  return {
    distance,
    minutes,
    steps: [
      "You are here — Central Plaza",
      `Walk ${first} m along the main path`,
      turn,
      `Continue ${second} m past the signboards`,
      `Arrive at ${to.name}`,
    ],
  };
};
export const facilityLabels: Record<FacilityKind, string> = {
  gate: "Gates & Exits",
  restroom: "Washrooms",
  food: "Food Court",
  water: "Drinking Water",
  firstaid: "First Aid",
  parking: "Parking",
  accessible: "Wheelchair Route",
};

export const facilityOrder: FacilityKind[] = [
  "restroom",
  "food",
  "water",
  "firstaid",
  "parking",
  "gate",
  "accessible",
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const emergencyContacts = [
  { id: "control", label: "Zoo Control Room", number: "1800-180-5555" },
  { id: "security", label: "Security Desk", number: "+91 98765 43210" },
  { id: "ambulance", label: "Ambulance", number: "108" },
];

export const bookingUrl = "https://upforest.gov.in/";

export const getFacility = (id: string) => facilities.find((f) => f.id === id);

export const feedingSchedule = (zooId: string) =>
  zooAnimals(zooId)
    .slice()
    .sort(
      (a, b) =>
        new Date(`1970/01/01 ${a.feedingTime}`).getTime() -
        new Date(`1970/01/01 ${b.feedingTime}`).getTime(),
    );
