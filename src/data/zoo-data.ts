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
  /** Hindi name (demo translation) */
  nameHi?: string;
  /** Hindi fun facts (demo translation) */
  factsHi?: string[];
  /** mock live crowd level, only on popular animals */
  crowdLevel?: CrowdLevel;
};

export type CrowdLevel = "Low" | "Medium" | "Heavy";

export type Weather = {
  tempC: number;
  condition: "sunny" | "cloudy" | "rainy";
  rainChance: number;
  summary: string;
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
  /** mock weather for the zoo's city */
  weather?: Weather;
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

/** Map scale: how many metres one map unit (1% of the map) represents. Used by the map, directions and the chatbot. */
export const METERS_PER_MAP_UNIT = 6.4;
/** Average walking speed in metres per minute. */
export const WALK_METERS_PER_MIN = 75;

const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.round(Math.hypot(ax - bx, ay - by) * METERS_PER_MAP_UNIT);

export const walkMinutes = (distance: number) =>
  Math.max(1, Math.round(distance / WALK_METERS_PER_MIN));

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
  const minutes = walkMinutes(distance);
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

/* ---------------------------------------------------------------
 * Additive extensions: Hindi copy, crowd levels, weather, photo
 * spots, treasure hunt, quiz and seed reviews.
 * ------------------------------------------------------------- */

const hindiCopy: Record<string, { nameHi: string; factsHi: string[] }> = {
  "royal-bengal-tiger": {
    nameHi: "रॉयल बंगाल टाइगर",
    factsHi: ["किन्हीं दो बाघों की धारियाँ एक जैसी नहीं होतीं।"],
  },
  "asiatic-lion": {
    nameHi: "एशियाई सिंह",
    factsHi: ["एशियाई शेरों के पेट पर एक खास तह होती है।"],
  },
  "indian-elephant": {
    nameHi: "भारतीय हाथी",
    factsHi: ["एक वयस्क हाथी रोज़ 150 किलो तक पौधे खाता है।"],
  },
  giraffe: {
    nameHi: "जिराफ़",
    factsHi: ["जिराफ़ की जीभ लगभग 50 सेंटीमीटर लंबी होती है।"],
  },
  "indian-leopard": {
    nameHi: "भारतीय तेंदुआ",
    factsHi: ["तेंदुआ अपना शिकार पेड़ पर ले जाकर खाता है।"],
  },
  "sloth-bear": {
    nameHi: "भालू",
    factsHi: ["दीमक खाते समय यह अपने नथुने बंद कर लेता है।"],
  },
  "mugger-crocodile": {
    nameHi: "मगरमच्छ",
    factsHi: ["गर्मी से बचने के लिए मगर बिल खोदते हैं।"],
  },
  "indian-peafowl": {
    nameHi: "मोर",
    factsHi: ["मोर के पंखों में करीब 200 चमकीले नेत्र-चिह्न होते हैं।"],
  },
  "spotted-deer": {
    nameHi: "चीतल",
    factsHi: ["चीतल लंगूरों के नीचे गिरे फल खाने पहुँच जाते हैं।"],
  },
  "rhesus-macaque": {
    nameHi: "लाल मुँह बंदर",
    factsHi: ["ये गालों की थैली में खाना जमा कर लेते हैं।"],
  },
  hippopotamus: {
    nameHi: "दरियाई घोड़ा",
    factsHi: ["इनकी त्वचा से लाल रंग का प्राकृतिक सनस्क्रीन निकलता है।"],
  },
};

const crowdLevels: Record<string, CrowdLevel> = {
  "royal-bengal-tiger": "Heavy",
  "asiatic-lion": "Heavy",
  "indian-elephant": "Medium",
  "indian-peafowl": "Low",
};

for (const a of animals) {
  const h = hindiCopy[a.id];
  if (h) {
    a.nameHi = h.nameHi;
    a.factsHi = h.factsHi;
  }
  const c = crowdLevels[a.id];
  if (c) a.crowdLevel = c;
}

export const crowdTone: Record<CrowdLevel, string> = {
  Low: "bg-leaf/15 text-leaf border-leaf/30",
  Medium: "bg-sun/25 text-clay border-sun/50",
  Heavy: "bg-destructive/15 text-destructive border-destructive/30",
};

export const crowdLabelHi: Record<CrowdLevel, string> = {
  Low: "कम भीड़",
  Medium: "मध्यम भीड़",
  Heavy: "भारी भीड़",
};

const weatherByZoo: Record<string, Weather> = {
  kanpur: { tempC: 31, condition: "cloudy", rainChance: 35, summary: "Partly cloudy" },
};

for (const z of zoos) {
  z.weather = weatherByZoo[z.id] ?? weatherByZoo["kanpur"]!;
}

for (const z of zoos) {
  z.weather = weatherByZoo[z.id] ?? weatherByZoo["lucknow"]!;
}

export type PhotoSpot = {
  id: string;
  name: string;
  nameHi: string;
  caption: string;
  image: string;
  x: number;
  y: number;
};

export const photoSpots: PhotoSpot[] = [
  {
    id: "tiger-glass-wall",
    name: "Tiger Glass Wall",
    nameHi: "बाघ काँच दीवार",
    caption: "Crouch low for an eye-level frame with the big cat behind you.",
    image: img("photo-1561731216-c3a4d99437d5"),
    x: 26,
    y: 34,
  },
  {
    id: "banyan-arch",
    name: "Old Banyan Arch",
    nameHi: "पुराना बरगद मेहराब",
    caption: "Hanging roots make a natural green frame — best in morning light.",
    image: img("photo-1441974231531-c6227db76b6e"),
    x: 38,
    y: 58,
  },
  {
    id: "lake-deck",
    name: "Lake View Deck",
    nameHi: "झील व्यू डेक",
    caption: "Wooden deck over the lake with hippos in the background.",
    image: img("photo-1520302630591-fd1c66edc19d"),
    x: 84,
    y: 42,
  },
  {
    id: "peacock-lawn",
    name: "Peacock Lawn",
    nameHi: "मोर लॉन",
    caption: "Free-roaming peafowl often fan out here around noon.",
    image: img("photo-1518709766631-a6a7f45921c3"),
    x: 78,
    y: 60,
  },
  {
    id: "toy-train-bridge",
    name: "Toy Train Bridge",
    nameHi: "टॉय ट्रेन पुल",
    caption: "Catch the little train crossing behind you for a fun action shot.",
    image: img("photo-1503656142023-618e7d1f435a"),
    x: 52,
    y: 78,
  },
];

/** the 5 animals in the active treasure hunt */
export const huntAnimalIds = [
  "royal-bengal-tiger",
  "indian-elephant",
  "indian-peafowl",
  "sloth-bear",
  "gharial",
];

export const huntAnimals = () =>
  huntAnimalIds.map((id) => getAnimal(id)).filter(Boolean) as Animal[];

export type QuizQuestion = {
  id: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  answer: number;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which animal is called the king of the jungle?",
    questionHi: "किस जानवर को जंगल का राजा कहा जाता है?",
    options: ["Lion", "Deer", "Peacock", "Crocodile"],
    optionsHi: ["शेर", "हिरण", "मोर", "मगरमच्छ"],
    answer: 0,
  },
  {
    id: "q2",
    question: "Which animal has a very long blue-black tongue?",
    questionHi: "किस जानवर की जीभ बहुत लंबी और नीली-काली होती है?",
    options: ["Tiger", "Giraffe", "Monkey", "Bear"],
    optionsHi: ["बाघ", "जिराफ़", "बंदर", "भालू"],
    answer: 1,
  },
  {
    id: "q3",
    question: "Which bird is the national bird of India?",
    questionHi: "भारत का राष्ट्रीय पक्षी कौन सा है?",
    options: ["Parrot", "Crow", "Peacock", "Owl"],
    optionsHi: ["तोता", "कौआ", "मोर", "उल्लू"],
    answer: 2,
  },
  {
    id: "q4",
    question: "Which animal eats up to 150 kg of plants a day?",
    questionHi: "कौन सा जानवर रोज़ 150 किलो तक पौधे खाता है?",
    options: ["Elephant", "Leopard", "Gharial", "Macaque"],
    optionsHi: ["हाथी", "तेंदुआ", "घड़ियाल", "बंदर"],
    answer: 0,
  },
];

export type Review = {
  id: string;
  animalId: string;
  name: string;
  rating: number;
  text: string;
};

export const seedReviews: Review[] = [
  { id: "r1", animalId: "royal-bengal-tiger", name: "Ananya", rating: 5, text: "Saw him pacing right at the glass. Unforgettable!" },
  { id: "r2", animalId: "royal-bengal-tiger", name: "Rahul", rating: 4, text: "Go at 4:30 PM feeding, much more active." },
  { id: "r3", animalId: "asiatic-lion", name: "Meera", rating: 5, text: "The safari drive was the highlight of our trip." },
  { id: "r4", animalId: "asiatic-lion", name: "Imran", rating: 4, text: "Great enclosure, a bit crowded on Sunday." },
  { id: "r5", animalId: "indian-elephant", name: "Priya", rating: 5, text: "Bath show at 11:30 is lovely for kids." },
  { id: "r6", animalId: "indian-elephant", name: "Sunil", rating: 4, text: "Very calm and well cared for." },
  { id: "r7", animalId: "gharial", name: "Kavya", rating: 4, text: "Rare to see one up close — worth the walk." },
  { id: "r8", animalId: "indian-peafowl", name: "Dev", rating: 5, text: "They walk freely near the aviary. Beautiful." },
  { id: "r9", animalId: "spotted-deer", name: "Nisha", rating: 4, text: "Peaceful meadow, great for a slow stroll." },
  { id: "r10", animalId: "sloth-bear", name: "Arjun", rating: 4, text: "Funny to watch it dig for termites." },
];

export const defaultReviewsFor = (animalId: string) =>
  seedReviews.filter((r) => r.animalId === animalId);
