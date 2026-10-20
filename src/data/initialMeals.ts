import { Meal } from '../types/meal';

export const INITIAL_MEALS: Meal[] = [
  {
    id: "m0",
    name: "Sirloin Gyukatsu Set",
    restaurant: "Gyukatsu Motomura",
    location: "Orchard",
    date: "2026-10-03",
    category: "Dinner",
    recordedCount: 1,
    components: [
      "Medium-rare breaded sirloin beef cutlet (130 g)",
      "Barley rice bowl (180 g)",
      "Finely shredded white cabbage with yuzu dressing",
      "Red miso soup with tofu cubes",
      "Wasabi and rock salt condiment duo"
    ],
    notes: [
      "Seared slices on stone grill for 10 seconds per side",
      "Left half the dressing on the side for lighter seasoning",
      "Finished all cabbage; left about two bites of rice"
    ],
    nutrition: {
      calories: 780,
      protein: 42,
      fat: 36,
      carbs: 68,
      fiber: 5,
      sodium: 890,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09103",
      loggedAt: "2026-10-03T19:42:00Z",
      entryMethod: "Quick journal preset",
      internalNotes: "Standard set #2; receipt verified"
    },
    isFavorite: true
  },
  {
    id: "m1",
    name: "Crispy Tofu Bento",
    restaurant: "Maple Kitchen",
    location: "Orchard Central",
    date: "2026-10-03",
    category: "Lunch",
    recordedCount: 2,
    components: [
      "Crispy pressed tofu with sesame crust (120 g)",
      "Steamed jasmine rice (150 g)",
      "Pickled Japanese cucumber sunomono",
      "Wakame miso soup"
    ],
    notes: [
      "Chilli sauce requested on the side to monitor heat",
      "Left about a quarter cup of steamed rice",
      "Soup was pleasantly light with low salinity"
    ],
    nutrition: {
      calories: 620,
      protein: 24,
      fat: 18,
      carbs: 82,
      fiber: 6,
      sodium: 980,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09101",
      loggedAt: "2026-10-03T12:30:00Z",
      entryMethod: "Manual journal entry",
      internalNotes: "Bento series v3.1"
    },
    isFavorite: false
  },
  {
    id: "m2",
    name: "Iced Oat Latte",
    restaurant: "North Pier Coffee",
    location: "Waterfront Quay",
    date: "2026-10-04",
    category: "Drink",
    recordedCount: 5,
    components: [
      "Double origin espresso shot (60 mL)",
      "Barista-grade oat milk (180 mL)",
      "Chilled clear ice cubes"
    ],
    notes: [
      "Strictly unsweetened, zero flavored syrups",
      "Drank right after a 4 km morning walk along the pier",
      "Very silky microfoam despite cold temperature"
    ],
    nutrition: {
      calories: 110,
      protein: 3,
      fat: 5,
      carbs: 12,
      fiber: 1,
      sodium: 85,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09102",
      loggedAt: "2026-10-04T08:45:00Z",
      entryMethod: "Barcode / quick repeat",
      internalNotes: "House oat base: minor figures"
    },
    isFavorite: true
  },
  {
    id: "m3",
    name: "Mushroom Noodle Bowl",
    restaurant: "Maple Kitchen",
    location: "Orchard Central",
    date: "2026-10-05",
    category: "Dinner",
    recordedCount: 1,
    components: [
      "Fresh pulled wheat noodles (160 g)",
      "Braised shiitake & king oyster mushrooms",
      "Baby bok choy cluster",
      "Clear kelp and mushroom broth"
    ],
    notes: [
      "Asked for extra steamed bok choy greens without oil",
      "Ate almost all broth; very comforting on a rainy evening",
      "Pleasant natural umami without heavy MSG aftertaste"
    ],
    nutrition: {
      calories: 480,
      protein: 17,
      fat: 12,
      carbs: 71,
      fiber: 7,
      sodium: 1050,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09105",
      loggedAt: "2026-10-05T19:15:00Z",
      entryMethod: "Manual journal entry",
      internalNotes: "Standard kitchen bowl item #4"
    },
    isFavorite: false
  },
  {
    id: "m4",
    name: "Berry Yogurt Bowl",
    restaurant: "Harbour Breakfast Bar",
    location: "Pier 4",
    date: "2026-10-10",
    category: "Breakfast",
    recordedCount: 3,
    components: [
      "Unsweetened whole milk Greek yogurt (150 g)",
      "Fresh wild blueberries (40 g)",
      "Sliced organic strawberries (50 g)",
      "Slow-toasted rolled oats and chia seed sprinkle"
    ],
    notes: [
      "Honey drizzle was offered by server but declined",
      "Berries were perfectly tart and fresh",
      "Felt very satiating until well past noon"
    ],
    nutrition: {
      calories: 340,
      protein: 18,
      fat: 9,
      carbs: 45,
      fiber: 5,
      sodium: 95,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09110",
      loggedAt: "2026-10-10T09:00:00Z",
      entryMethod: "Quick journal preset",
      internalNotes: "Breakfast roster standard"
    },
    isFavorite: true
  },
  {
    id: "m5",
    name: "Grilled Salmon Plate",
    restaurant: "Harbour Breakfast Bar",
    location: "Pier 4",
    date: "2026-10-11",
    category: "Lunch",
    recordedCount: 1,
    components: [
      "Wild Atlantic grilled salmon fillet (140 g)",
      "Rosemary roasted baby potatoes (120 g)",
      "Steamed tender green beans with sea salt"
    ],
    notes: [
      "Lemon wedges served on the side; squeezed thoroughly over greens",
      "Crisp skin was eaten, avoided the creamy tartar dip entirely",
      "Very balanced post-lunch energy without afternoon slump"
    ],
    nutrition: {
      calories: 590,
      protein: 39,
      fat: 28,
      carbs: 41,
      fiber: 6,
      sodium: 540,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09111",
      loggedAt: "2026-10-11T13:10:00Z",
      entryMethod: "Manual journal entry",
      internalNotes: "Daily special fish platter"
    },
    isFavorite: false
  },
  {
    id: "m6",
    name: "Spiced Chickpea Wrap",
    restaurant: "Garden Counter",
    location: "Millenia Walk",
    date: "2026-10-12",
    category: "Lunch",
    recordedCount: 2,
    components: [
      "Cumin & paprika roasted chickpeas (110 g)",
      "Wholewheat soft tortilla wrap (8-inch)",
      "Crisp romaine lettuce & cherry tomatoes",
      "Toasted sesame tahini drizzle"
    ],
    notes: [
      "Asked for dressing on the side and used only half a tablespoon",
      "Eaten at office desk during lunch break",
      "High fiber content kept energy stable"
    ],
    nutrition: {
      calories: 520,
      protein: 20,
      fat: 16,
      carbs: 68,
      fiber: 10,
      sodium: 710,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09112",
      loggedAt: "2026-10-12T12:45:00Z",
      entryMethod: "Manual journal entry",
      internalNotes: "Counter takeaway SKU #88"
    },
    isFavorite: false
  },
  {
    id: "m7",
    name: "Artisan Sourdough Toast & Soft Scramble",
    restaurant: "Common Grounds",
    location: "Tanjong Pagar",
    date: "2026-10-14",
    category: "Breakfast",
    recordedCount: 1,
    components: [
      "Seeded artisan country sourdough (1 thick slice)",
      "Free-range eggs soft scrambled with cultured butter",
      "Micro greens and coarse sea salt",
      "Roasted vine tomatoes"
    ],
    notes: [
      "Light butter on toast, no bacon requested",
      "Crust had wonderful blistered crunch"
    ],
    nutrition: {
      calories: 410,
      protein: 21,
      fat: 19,
      carbs: 37,
      fiber: 4,
      sodium: 490,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09114",
      loggedAt: "2026-10-14T08:15:00Z",
      entryMethod: "Manual journal entry"
    },
    isFavorite: false
  },
  {
    id: "m8",
    name: "Street Style Pho Ga (Estimated Recipe)",
    restaurant: "Street Hawker Stall #14",
    location: "Old Airport Road",
    date: "2026-10-16",
    category: "Dinner",
    recordedCount: 1,
    components: [
      "Rice noodles in aromatic spiced chicken broth",
      "Poached chicken breast & thigh strips (~90 g)",
      "Thai basil, bean sprouts, sawtooth coriander",
      "Fresh bird's eye chilli and lime wedge"
    ],
    notes: [
      "Broth clarity indicates low rendered fat",
      "Left about a third of the noodles in the bowl",
      "Added zero additional sweet hoisin sauce"
    ],
    nutrition: {
      calories: 460,
      protein: 28,
      fat: 11,
      carbs: 62,
      fiber: 3,
      sodium: 1180,
      isEstimated: true
    },
    uncertainIdentity: true,
    uncertaintyNote: "Hawker preparation; cutlet weight & broth sodium are approximate estimates",
    originalRecord: {
      id: "raw_rec_09116",
      loggedAt: "2026-10-16T19:50:00Z",
      entryMethod: "Quick estimate journal entry",
      internalNotes: "Hawker stall with unlisted nutrition facts"
    },
    isFavorite: false
  },
  {
    id: "m9",
    name: "Ceremonial Matcha Cortado",
    restaurant: "North Pier Coffee",
    location: "Waterfront Quay",
    date: "2026-10-17",
    category: "Drink",
    recordedCount: 2,
    components: [
      "Single-estate Uji matcha whisked with 80°C water",
      "Steamed whole oat milk (100 mL)"
    ],
    notes: [
      "Zero added cane sugar or agave syrup",
      "Enjoyed during late afternoon quiet reading hour"
    ],
    nutrition: {
      calories: 85,
      protein: 2,
      fat: 3,
      carbs: 10,
      fiber: 2,
      sodium: 45,
      isEstimated: false
    },
    uncertainIdentity: false,
    originalRecord: {
      id: "raw_rec_09117",
      loggedAt: "2026-10-17T16:20:00Z",
      entryMethod: "Quick journal preset"
    },
    isFavorite: true
  }
];
