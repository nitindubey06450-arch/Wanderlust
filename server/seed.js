const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Review = require('./models/Review');

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE 100% INDIA DESTINATIONS (ALL 28 STATES + 8 UNION TERRITORIES)
// Zero out-of-India places. Complete pan-India tourist coverage with real images.
// ─────────────────────────────────────────────────────────────────────────────
const sampleDestinations = [
  // ── 28 STATES OF INDIA ──────────────────────────────────────────────────────
  
  // 1. ANDHRA PRADESH
  {
    name: "Visakhapatnam & Araku Valley",
    country: "India",
    region: "Andhra Pradesh",
    category: "Beach",
    rating: 4.8,
    estimatedBudget: 350,
    bestTimeToVisit: "October to March",
    description: "The 'Jewel of the East Coast', featuring pristine golden beaches like Rushikonda alongside lush coffee plantations, tribal culture, and million-year-old Borra Caves in Araku Valley.",
    images: [
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Rushikonda Beach", "Borra Caves", "Araku Valley Coffee Gardens", "INS Kursura Submarine Museum", "Kailasagiri Hilltop"],
    thingsToDo: ["Scenic Vistadome train ride to Araku", "Beach surfing and water sports", "Taste aromatic Araku tribal coffee"],
    travelTips: ["Book Vistadome train tickets weeks in advance", "Try Andhra style bamboo chicken in Araku"],
    latitude: 17.6868,
    longitude: 83.2185
  },

  // 2. ARUNACHAL PRADESH
  {
    name: "Tawang & Ziro Valley",
    country: "India",
    region: "Arunachal Pradesh",
    category: "Mountain",
    rating: 4.9,
    estimatedBudget: 600,
    bestTimeToVisit: "March to October",
    description: "The Land of Dawn-Lit Mountains, home to the second largest Buddhist monastery in the world in Tawang, snow-clad Sela Pass, and the picturesque Apatani pine valleys of Ziro.",
    images: [
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Tawang Monastery", "Sela Pass (13,700 ft)", "Madhuri Lake (Shonga-tser)", "Nuranang Waterfalls", "Ziro Valley Pine Groves"],
    thingsToDo: ["Attend morning prayers at Tawang Monastery", "Ziro Music Festival", "Trek around high-altitude glacial lakes"],
    travelTips: ["Inner Line Permit (ILP) is mandatory for domestic visitors", "Carry heavy woolens even in summer"],
    latitude: 27.5861,
    longitude: 91.8594
  },

  // 3. ASSAM
  {
    name: "Kaziranga & Majuli Island",
    country: "India",
    region: "Assam",
    category: "Nature",
    rating: 4.85,
    estimatedBudget: 450,
    bestTimeToVisit: "November to April",
    description: "A UNESCO World Heritage sanctuary safeguarding two-thirds of the world's great one-horned rhinoceroses, paired with Majuli—the world's largest river island on the mighty Brahmaputra.",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Kaziranga National Park", "Majuli River Island", "Kamakhya Devi Temple", "Tea Plantations of Jorhat"],
    thingsToDo: ["Early morning Elephant safari in Kaziranga", "Ferry cruise on Brahmaputra", "Explore ancient Vaishnavite Satras in Majuli"],
    travelTips: ["Kaziranga is closed during monsoon (May-Oct)", "Savor authentic Assamese fish tenga and Assam orthodox tea"],
    latitude: 26.5775,
    longitude: 93.1711
  },

  // 4. BIHAR
  {
    name: "Bodh Gaya & Nalanda",
    country: "India",
    region: "Bihar",
    category: "Cultural",
    rating: 4.75,
    estimatedBudget: 300,
    bestTimeToVisit: "October to March",
    description: "The supreme cradle of world Buddhism and enlightenment under the sacred Bodhi Tree at Mahabodhi Temple, combined with the legendary 5th-century ruins of ancient Nalanda University.",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Mahabodhi Temple UNESCO", "Sacred Bodhi Tree", "Great Buddha Statue (80 ft)", "Nalanda Mahavihara Ruins", "Rajgir Ropeway & Gridhakuta Peak"],
    thingsToDo: ["Meditation in the Mahabodhi temple garden", "Explore Nalanda Archaeological Museum", "Ride aerial ropeway to Vishwa Shanti Stupa"],
    travelTips: ["Dress respectfully covering shoulders and knees", "Taste traditional Bihari Litti Chokha"],
    latitude: 24.6961,
    longitude: 84.9912
  },

  // 5. CHHATTISGARH
  {
    name: "Bastar & Chitrakote Falls",
    country: "India",
    region: "Chhattisgarh",
    category: "Nature",
    rating: 4.7,
    estimatedBudget: 350,
    bestTimeToVisit: "July to February",
    description: "Revered as the 'Niagara Falls of India', the majestic horseshoe Chitrakote Falls roars across the Indravati River amidst Bastar's vibrant indigenous tribal art, bell metal crafts, and dense sal forests.",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Chitrakote Falls", "Tirathgarh Waterfalls", "Kanger Valley National Park", "Kotumsar Limestone Caves", "Bastar Palace"],
    thingsToDo: ["Boat ride right near the base of Chitrakote Falls", "Shop for Dhokra brass handicrafts", "Witness the 75-day Bastar Dussehra celebration"],
    travelTips: ["Post-monsoon (August-November) offers the most dramatic waterfall spray", "Carry local cash for rural tribal weekly markets (haats)"],
    latitude: 19.2064,
    longitude: 81.7042
  },

  // 6. GOA
  {
    name: "Goa Coast & Dudhsagar",
    country: "India",
    region: "Goa",
    category: "Beach",
    rating: 4.85,
    estimatedBudget: 500,
    bestTimeToVisit: "November to March",
    description: "India's premier coastal paradise, celebrated for golden sands, vibrant flea markets, Latin Quarter heritage in Fontainhas, and the four-tiered milky cascade of Dudhsagar Waterfalls.",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Palolem Beach", "Baga & Calangute Beaches", "Dudhsagar Falls", "Basilica of Bom Jesus", "Aguada Fort"],
    thingsToDo: ["Sunset cruise on Mandovi River", "Scuba diving and dolphin spotting", "Heritage walking tour of Fontainhas Latin Quarter"],
    travelTips: ["Rent a two-wheeler for effortless scenic coast hopping", "Try authentic Goan prawn curry with poi bread"],
    latitude: 15.2993,
    longitude: 74.1240
  },

  // 7. GUJARAT
  {
    name: "Rann of Kutch & Gir Forest",
    country: "India",
    region: "Gujarat",
    category: "Cultural",
    rating: 4.85,
    estimatedBudget: 550,
    bestTimeToVisit: "November to February",
    description: "The world's largest salt marsh turning into an ethereal glowing white wonderland under moonlight during the Rann Utsav, paired with Gir National Park—the sole home of Asiatic Lions.",
    images: [
      "https://images.unsplash.com/photo-1609946850025-a13f2a893049?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["White Desert Rann", "Kalo Dungar (Black Hill)", "Gir National Park", "Statue of Unity (182m)", "Somnath Temple"],
    thingsToDo: ["Full moon night walk on the shimmering white salt desert", "Open jeep safari to spot wild Asiatic Lions", "Explore Kutchi mirror-work embroidery villages"],
    travelTips: ["Register online for the Kutch desert entrance permit in advance", "Book tent city stays well ahead for Rann Utsav"],
    latitude: 23.7337,
    longitude: 69.8597
  },

  // 8. HARYANA
  {
    name: "Kurukshetra & Sultanpur",
    country: "India",
    region: "Haryana",
    category: "Historical",
    rating: 4.65,
    estimatedBudget: 280,
    bestTimeToVisit: "October to March",
    description: "The epic battlefield of Mahabharata where Lord Krishna delivered the holy Bhagavad Gita at Jyotisar, alongside the thriving avian haven of Sultanpur National Park hosting thousands of migratory Siberian birds.",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Brahma Sarovar", "Jyotisar Gita Birthplace", "Sultanpur Bird Sanctuary", "Panorama and Science Centre", "Sheikh Chilli Tomb"],
    thingsToDo: ["Witness evening Aarti at Brahma Sarovar", "Birdwatching with binoculars in Sultanpur", "Explore the Gita Heritage museum"],
    travelTips: ["Visit during Gita Jayanti festival in December for grand celebrations", "Taste authentic Haryanvi Bajra khichdi with fresh white butter"],
    latitude: 29.9695,
    longitude: 76.8783
  },

  // 9. HIMACHAL PRADESH
  {
    name: "Manali & Spiti Valley",
    country: "India",
    region: "Himachal Pradesh",
    category: "Mountain",
    rating: 4.9,
    estimatedBudget: 480,
    bestTimeToVisit: "May to October (Spiti) & Year-round (Manali)",
    description: "Towering snow peaks, cedar valleys, and adrenaline-pumping adventures in Manali, extending into the otherworldly Tibetan high desert plateau and thousand-year-old monasteries of Spiti Valley.",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Solang Valley", "Rohtang Pass", "Key Monastery Spiti", "Chandratal Glacial Lake", "Atal Tunnel"],
    thingsToDo: ["Paragliding and skiing at Solang", "Stargazing at Chandratal high-altitude lake", "Send a postcard from Hikkim (world's highest post office)"],
    travelTips: ["Acclimatize in Kaza before visiting high passes", "Book Rohtang permits online prior to travel"],
    latitude: 32.2432,
    longitude: 77.1892
  },

  // 10. JHARKHAND
  {
    name: "Netarhat & Hundru Falls",
    country: "India",
    region: "Jharkhand",
    category: "Nature",
    rating: 4.65,
    estimatedBudget: 300,
    bestTimeToVisit: "September to March",
    description: "The 'Queen of Chotanagpur' celebrated for misty sunrise viewpoints, dense pine forests, and breathtaking 320-foot plunging cascades along the Subarnarekha River.",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Netarhat Sunset Point (Magnolia)", "Hundru Falls", "Dassam Falls", "Betla National Park", "Tagore Hill Ranchi"],
    thingsToDo: ["Watch the mesmerizing sun dip behind the Chotanagpur plateau", "Tiger & elephant safari in Betla National Park", "Trek through the Sal forest reserves"],
    travelTips: ["Netarhat mornings and evenings are cool even during summer", "Taste local Jharkhandi Dhuska and Arsa"],
    latitude: 23.4794,
    longitude: 84.2709
  },

  // 11. KARNATAKA
  {
    name: "Hampi, Coorg & Mysore",
    country: "India",
    region: "Karnataka",
    category: "Historical",
    rating: 4.9,
    estimatedBudget: 500,
    bestTimeToVisit: "October to March",
    description: "The colossal boulder-strewn UNESCO world heritage ruins of the medieval Vijayanagara Empire in Hampi, paired with the misty coffee estates of Coorg and opulent Mysore Palace.",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Stone Chariot & Virupaksha Temple Hampi", "Mysore Palace", "Abbey Falls Coorg", "Namdroling Golden Temple", "Dubare Elephant Camp"],
    thingsToDo: ["Coracle round-boat ride across the Tungabhadra River", "Coffee plantation guided tour in Madikeri", "Witness 100,000 bulbs illuminating Mysore Palace on Sunday evening"],
    travelTips: ["Rent a bicycle or moped to discover Hampi's vast ruined monuments", "Buy genuine Mysore silk sarees and Coorg spices"],
    latitude: 15.3350,
    longitude: 76.4600
  },

  // 12. KERALA
  {
    name: "Munnar Tea Hills & Alleppey",
    country: "India",
    region: "Kerala",
    category: "Nature",
    rating: 4.95,
    estimatedBudget: 550,
    bestTimeToVisit: "September to March",
    description: "God's Own Country: emerald-carpeted tea hills and cool mountain breezes in Munnar, alongside tranquil palm-fringed backwaters explored on luxurious traditional kettuvallam houseboats in Alleppey.",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Alleppey Houseboat Backwaters", "Tea Gardens of Munnar", "Eravikulam National Park (Nilgiri Tahr)", "Athirappilly Waterfalls", "Marari Beach"],
    thingsToDo: ["Overnight cruise on a wooden houseboat with freshly prepared Kerala Karimeen fish", "Authentic Ayurvedic rejuvenation massage", "Watch Kathakali dance and Kalaripayattu martial arts"],
    travelTips: ["Book certified houseboats in advance", "Feast on Kerala Onam Sadhya served on fresh banana leaves"],
    latitude: 10.0889,
    longitude: 77.0595
  },

  // 13. MADHYA PRADESH
  {
    name: "Khajuraho, Ujjain & Pachmarhi",
    country: "India",
    region: "Madhya Pradesh",
    category: "Historical",
    rating: 4.8,
    estimatedBudget: 420,
    bestTimeToVisit: "October to March",
    description: "The heart of India: UNESCO-listed 10th-century temples of Khajuraho famed for intricate stone sculptures, the holy Jyotirlinga Mahakaleshwar temple of Ujjain, and the tranquil Queen of Satpura hill station in Pachmarhi.",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Kandariya Mahadeva Temple", "Mahakaleshwar Jyotirlinga Ujjain", "Bhedaghat Marble Rocks & Dhuandhar Falls", "Bandhavgarh Tiger Reserve", "Bee Falls Pachmarhi"],
    thingsToDo: ["Witness early morning Bhasma Aarti at Mahakaleshwar", "Boat cruise through the white marble gorge in Jabalpur", "Spot Bengal tigers in Bandhavgarh"],
    travelTips: ["Book Bhasma Aarti online weeks prior", "Sound & Light show at Khajuraho western group of temples is a must"],
    latitude: 24.8318,
    longitude: 79.9199
  },

  // 14. MAHARASHTRA
  {
    name: "Mumbai & Ajanta-Ellora Caves",
    country: "India",
    region: "Maharashtra",
    category: "Cultural",
    rating: 4.85,
    estimatedBudget: 600,
    bestTimeToVisit: "October to March",
    description: "The Maximum City: dynamic Marine Drive and colonial Gateway of India, complemented by the awe-inspiring monolithic rock-cut Buddhist, Hindu, and Jain cave architecture of UNESCO Ajanta and Ellora.",
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Kailasa Temple Ellora Cave 16", "Ajanta Frescoes", "Gateway of India & Taj Mahal Palace", "Marine Drive (Queen's Necklace)", "Elephanta Caves"],
    thingsToDo: ["Sunset stroll on Marine Drive promenade", "Ferry to Elephanta Island", "Marvel at the single-rock carved Kailash Temple"],
    travelTips: ["Ajanta is closed on Mondays; Ellora on Tuesdays", "Try Mumbai Pav Bhaji at Juhu Beach and Irani chai in Fort"],
    latitude: 18.9220,
    longitude: 72.8347
  },

  // 15. MANIPUR
  {
    name: "Loktak Lake & Imphal",
    country: "India",
    region: "Manipur",
    category: "Nature",
    rating: 4.75,
    estimatedBudget: 380,
    bestTimeToVisit: "October to March",
    description: "The Jewel of India, famous for Loktak Lake—the only floating lake in the world, covered by circular biomass islands (Phumdis), and Keibul Lamjao—the world's only floating national park sheltering the endangered Sangai brow-antlered deer.",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Loktak Lake & Sendra Island", "Keibul Lamjao Floating National Park", "Kangla Fort Imphal", "Ima Keithel (Mother's Market - run 100% by women)"],
    thingsToDo: ["Canoe boating among the floating Phumdi rings", "Spot the dancing Sangai deer in the wild", "Shop handloom shawls at the historic women-run Ima Keithel market"],
    travelTips: ["Stay at Sendra tourist cottages for panoramic sunrise views over Loktak", "Sample authentic Manipuri Kangshoi and Singju salad"],
    latitude: 24.5500,
    longitude: 93.7833
  },

  // 16. MEGHALAYA
  {
    name: "Shillong, Cherrapunji & Dawki",
    country: "India",
    region: "Meghalaya",
    category: "Adventure",
    rating: 4.9,
    estimatedBudget: 480,
    bestTimeToVisit: "October to May",
    description: "The Abode of the Clouds: mist-draped pine hills of the 'Scotland of the East' (Shillong), centuries-old living root bridges intertwined by the Khasi tribe, and boats floating in air on the mirror-clear Umngot River in Dawki.",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Double Decker Living Root Bridge Nongriat", "Dawki Umngot Crystal River", "Nohkalikai Falls (tallest plunge in India)", "Mawlynnong (Cleanest Village in Asia)", "Umiam Lake"],
    thingsToDo: ["Boat ride on transparent crystal waters of Dawki", "Trek down 3,500 stone steps to the Double Decker Root Bridge", "Caving in Mawsmai and Krem Liat Prah limestone caverns"],
    travelTips: ["Wear sturdy waterproof trekking shoes for root bridge treks", "Respect the matrilineal and nature-protective local culture"],
    latitude: 25.5788,
    longitude: 91.8933
  },

  // 17. MIZORAM
  {
    name: "Aizawl & Reiek Tlang",
    country: "India",
    region: "Mizoram",
    category: "Mountain",
    rating: 4.7,
    estimatedBudget: 360,
    bestTimeToVisit: "November to March",
    description: "A tranquil hill city perched on dramatic ridge lines, boasting temperate weather, vibrant Bamboo Dance (Cheraw), cloud-kissed Reiek Peak, and Vantawng Falls cascading through bamboo jungle.",
    images: [
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Reiek Tlang Mountain Peak", "Solomon's Temple", "Vantawng Falls (750 ft)", "Dampa Tiger Reserve", "Bara Bazar Aizawl"],
    thingsToDo: ["Hike to the dramatic vertical cliff of Reiek Peak", "Experience the festive Chapchar Kut spring festival", "Discover the rich Mizo weaving heritage in Thenzawl"],
    travelTips: ["Inner Line Permit (ILP) required for non-residents", "Traffic in Aizawl is famously disciplined and honk-free"],
    latitude: 23.7271,
    longitude: 92.7176
  },

  // 18. NAGALAND
  {
    name: "Kohima & Dzukou Valley",
    country: "India",
    region: "Nagaland",
    category: "Adventure",
    rating: 4.85,
    estimatedBudget: 450,
    bestTimeToVisit: "October to May (December for Hornbill Festival)",
    description: "The Land of Festivals: the vibrant cultural confluence of 16 indigenous warrior tribes celebrated at the world-famous Hornbill Festival, paired with the surreal rolling green meadows and endemic lilies of Dzukou Valley.",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Dzukou Valley (Valley of Flowers of the East)", "Kisama Heritage Village (Hornbill venue)", "Kohima WWII Commonwealth War Cemetery", "Khonoma Green Village", "Dzuleke Eco Village"],
    thingsToDo: ["Camp under the stars in Dzukou Valley", "Experience tribal dances, music and crafts at Hornbill Festival (Dec 1-10)", "Village walk in Khonoma—India's first green village"],
    travelTips: ["Book accommodation months in advance if attending Hornbill Festival", "ILP is required for Indian tourists"],
    latitude: 25.6751,
    longitude: 94.1086
  },

  // 19. ODISHA
  {
    name: "Puri, Konark & Chilika Lake",
    country: "India",
    region: "Odisha",
    category: "Cultural",
    rating: 4.8,
    estimatedBudget: 380,
    bestTimeToVisit: "October to March",
    description: "The sacred Char Dham pilgrimage city of Lord Jagannath on the Bay of Bengal, the colossal 13th-century stone-carved Sun Temple chariot at Konark, and Chilika—Asia's largest brackish lagoon harboring playful Irrawaddy dolphins.",
    images: [
      "https://images.unsplash.com/photo-1609946850025-a13f2a893049?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Jagannath Temple Puri", "Konark Sun Temple UNESCO", "Golden Beach Puri (Blue Flag certified)", "Chilika Lake Dolphin Sanctuary", "Raghurajpur Heritage Crafts Village"],
    thingsToDo: ["Spot rare Irrawaddy dolphins in Chilika Lake near Satapada", "Learn ancient Pattachitra scroll painting in Raghurajpur", "Taste holy temple Mahaprasad and authentic Odia Chhena Poda dessert"],
    travelTips: ["Dress conservatively at Jagannath Temple", "Enjoy surfing at Puri's uncrowded coastline"],
    latitude: 19.8135,
    longitude: 85.8312
  },

  // 20. PUNJAB
  {
    name: "Amritsar Golden Temple",
    country: "India",
    region: "Punjab",
    category: "Spiritual",
    rating: 4.95,
    estimatedBudget: 350,
    bestTimeToVisit: "October to March",
    description: "The spiritual heart of Sikhism centered around the resplendent, gold-plated Harmandir Sahib rising from the holy Amrit Sarovar, surrounded by historic Jallianwala Bagh and the electric patriotism of Wagah Border.",
    images: [
      "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Sri Harmandir Sahib (Golden Temple)", "Wagah Border Beating Retreat Ceremony", "Jallianwala Bagh Memorial", "Partition Museum", "Gobindgarh Fort"],
    thingsToDo: ["Volunteer or partake in the Langar (world's largest free community kitchen serving 100,000+ meals daily)", "Witness the high-energy military flag lowering ceremony at Wagah Border", "Feast on piping hot butter-drenched Amritsari Kulcha with Chole"],
    travelTips: ["Cover head with cloth and remove footwear before entering the temple complex", "Visit late at night when the golden dome glows majestically over the water"],
    latitude: 31.6200,
    longitude: 74.8765
  },

  // 21. RAJASTHAN
  {
    name: "Jaipur, Udaipur & Jaisalmer",
    country: "India",
    region: "Rajasthan",
    category: "Cultural",
    rating: 4.95,
    estimatedBudget: 600,
    bestTimeToVisit: "October to March",
    description: "The royal realm of maharajas: Jaipur's Pink City palaces, romantic Udaipur's marble lake havelis, and the golden sandstone living fort rising like a mirage over the Thar desert dunes in Jaisalmer.",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Hawa Mahal & Amer Fort Jaipur", "City Palace & Lake Pichola Udaipur", "Jaisalmer Golden Fort", "Sam Sand Dunes", "Mehrangarh Fort Jodhpur"],
    thingsToDo: ["Sunset boat ride on Lake Pichola in Udaipur", "Camel safari and desert camping under Arabian-like starry skies in Jaisalmer", "Hot air balloon flight over ancient forts in Jaipur"],
    travelTips: ["Reserve heritage haveli hotel stays for an authentic royal ambiance", "Savor rich Dal Baati Churma, Gatte ki Sabzi, and Laal Maas"],
    latitude: 26.9124,
    longitude: 75.7873
  },

  // 22. SIKKIM
  {
    name: "Gangtok, Pelling & Nathula",
    country: "India",
    region: "Sikkim",
    category: "Mountain",
    rating: 4.9,
    estimatedBudget: 500,
    bestTimeToVisit: "March to May & October to December",
    description: "India's first 100% organic state, framed by the towering massif of Mount Kanchenjunga (world's 3rd highest peak), alpine glacial lakes at Tsomgo, and historic mountain passes on the ancient Indo-China Silk Route.",
    images: [
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Tsomgo Glacial Lake", "Nathula Pass (14,140 ft)", "Rumtek Monastery", "Pelling Skywalk & Chenrezig Statue", "Gurudongmar Lake (17,800 ft)"],
    thingsToDo: ["Yak safari along the frozen margins of Tsomgo Lake", "Cable car ropeway ride over Gangtok valley", "Taste steaming Tibetan momos, thukpa and fermented Gundruk"],
    travelTips: ["Inner Line Permit (ILP) required for Nathula and North Sikkim", "Strict no-plastic policy enforced across the state"],
    latitude: 27.3389,
    longitude: 88.6065
  },

  // 23. TAMIL NADU
  {
    name: "Ooty, Madurai & Kanyakumari",
    country: "India",
    region: "Tamil Nadu",
    category: "Cultural",
    rating: 4.85,
    estimatedBudget: 420,
    bestTimeToVisit: "October to March",
    description: "Dravidian temple splendor at the thousand-pillared Meenakshi Temple, UNESCO Nilgiri Mountain Toy Train climbing misty tea peaks, and the southernmost tip of mainland India where the Arabian Sea, Indian Ocean, and Bay of Bengal converge.",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Meenakshi Amman Temple Madurai", "Nilgiri Mountain Railway (UNESCO Toy Train)", "Vivekananda Rock Memorial Kanyakumari", "Brihadeeswarar Big Temple Thanjavur", "Ooty Botanical Gardens"],
    thingsToDo: ["Ride the blue UNESCO heritage steam train from Mettupalayam to Ooty", "Watch simultaneous sunrise and moonrise over the ocean at Kanyakumari", "Witness night palliyarai procession at Meenakshi temple"],
    travelTips: ["Book Toy Train tickets months in advance", "Enjoy filter coffee and crispy Chettinad dosas"],
    latitude: 9.9195,
    longitude: 78.1193
  },

  // 24. TELANGANA
  {
    name: "Hyderabad & Ramoji City",
    country: "India",
    region: "Telangana",
    category: "City",
    rating: 4.8,
    estimatedBudget: 450,
    bestTimeToVisit: "October to March",
    description: "The legendary City of Pearls, where 400-year-old Charminar and majestic acoustic Golconda Fort sit alongside futuristic Cyberabad and the Guinness-record-holding Ramoji Film City.",
    images: [
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Charminar", "Golconda Fort & Sound-Light Show", "Ramoji Film City (World's Largest)", "Chowmahalla Palace", "Hussain Sagar Lake & Buddha Statue"],
    thingsToDo: ["Indulge in authentic slow-cooked dum biryani at Paradise or Shadab", "Test your whisper across the clapping portico of Golconda Fort", "Full-day behind-the-scenes movie set tour at Ramoji"],
    travelTips: ["Visit Laad Bazaar next to Charminar for exquisite lacquer and pearl bangles", "Evenings at Hussain Sagar offer cool breezes and boat rides"],
    latitude: 17.3850,
    longitude: 78.4867
  },

  // 25. TRIPURA
  {
    name: "Agartala & Unakoti Rock Carvings",
    country: "India",
    region: "Tripura",
    category: "Cultural",
    rating: 4.7,
    estimatedBudget: 320,
    bestTimeToVisit: "October to March",
    description: "A tranquil northeastern state home to the floating water palace Neermahal on Rudrasagar Lake, the palatial Mughal-classical Ujjayanta Palace, and the monumental 7th-century rock-cut Shiva bas-reliefs of Unakoti ('one less than a crore').",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Unakoti Rock Carvings", "Ujjayanta Palace", "Neermahal Water Palace", "Tripura Sundari Temple Udaipur", "Jampui Hills (Orange Bowl)"],
    thingsToDo: ["Boat ride across Rudrasagar Lake to explore inside Neermahal", "Hike among the giant stone-carved faces in the jungles of Unakoti", "Taste fresh oranges and trek through panoramic viewpoints in Jampui Hills"],
    travelTips: ["Neermahal is best photographed during sunset golden hour", "Sample traditional Tripuri fermented bamboo shoot delicacies like Mui Borok"],
    latitude: 23.8315,
    longitude: 91.2868
  },

  // 26. UTTAR PRADESH
  {
    name: "Varanasi, Agra & Ayodhya",
    country: "India",
    region: "Uttar Pradesh",
    category: "Spiritual",
    rating: 4.95,
    estimatedBudget: 420,
    bestTimeToVisit: "October to March",
    description: "The spiritual soul of India: ancient Varanasi on the sacred banks of the Ganges, the eternal marble poetry of the Taj Mahal in Agra (one of the Seven Wonders of the World), and the grand holy birthplace of Lord Rama in Ayodhya.",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Taj Mahal & Agra Fort", "Kashi Vishwanath Corridor & Ghats", "Dashashwamedh Ghat Ganga Aarti", "Shri Ram Janmabhoomi Temple Ayodhya", "Sarnath Buddhist Park"],
    thingsToDo: ["Sunrise wooden boat ride along the 84 ghats of Varanasi", "Experience the hypnotic evening Ganga Aarti fire ceremony", "Admire the Taj Mahal at dawn when the white Makrana marble glows pink"],
    travelTips: ["Book Taj Mahal tickets online to bypass ticket booth queues", "Savor Banarasi Paan, Malaiyo (winter foam dessert), and Agra Petha"],
    latitude: 25.3176,
    longitude: 82.9739
  },

  // 27. UTTARAKHAND
  {
    name: "Rishikesh, Nainital & Kedarnath",
    country: "India",
    region: "Uttarakhand",
    category: "Adventure",
    rating: 4.95,
    estimatedBudget: 450,
    bestTimeToVisit: "March to June & September to November",
    description: "Devbhoomi (Land of the Gods): the Yoga Capital of the World and white-water rapids along the turquoise Ganga in Rishikesh, emerald crescent Naini Lake, and the majestic high-Himalayan shrine of Kedarnath.",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Lakshman Jhula & Beatles Ashram", "Kedarnath Dham Temple (11,755 ft)", "Naini Lake & Naina Devi Temple", "Jim Corbett National Park (India's 1st Tiger Reserve)", "Auli Ski Resort"],
    thingsToDo: ["Grade IV white-water river rafting on the holy Ganga", "Bungee jumping from India's highest platform (83m) in Mohan Chatti", "Skiing on powdery slopes with views of Nanda Devi in Auli"],
    travelTips: ["Rishikesh is strictly vegetarian and alcohol-free", "Register early on the Uttarakhand tourism portal for Char Dham biometric passes"],
    latitude: 30.0869,
    longitude: 78.2676
  },

  // 28. WEST BENGAL
  {
    name: "Darjeeling & Sundarbans Delta",
    country: "India",
    region: "West Bengal",
    category: "Nature",
    rating: 4.85,
    estimatedBudget: 480,
    bestTimeToVisit: "October to April",
    description: "The Queen of the Hills: panoramic views of the third-highest mountain peak Kanchenjunga across fragrant tea gardens in Darjeeling, combined with the world's largest mangrove delta—the wild realm of the Royal Bengal Tiger in Sundarbans.",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Tiger Hill Sunrise (Kanchenjunga view)", "Darjeeling Himalayan Railway UNESCO Toy Train", "Sundarbans Tiger Reserve", "Batasia Loop & War Memorial", "Victoria Memorial Kolkata"],
    thingsToDo: ["Watch golden dawn light up Kanchenjunga from Tiger Hill", "Ride the historic 1881 steam-powered Toy Train", "Silent boat cruise through mangrove creeks to spot wild swimming Royal Bengal Tigers"],
    travelTips: ["Sip authentic Darjeeling first-flush Muscatel tea", "Tasting Kolkata Kathi rolls and soft Rossogolla is essential"],
    latitude: 27.0410,
    longitude: 88.2663
  },

  // ── 8 UNION TERRITORIES OF INDIA ───────────────────────────────────────────

  // 29. ANDAMAN & NICOBAR ISLANDS
  {
    name: "Havelock & Radhanagar Beach",
    country: "India",
    region: "Andaman & Nicobar Islands",
    category: "Beach",
    rating: 4.95,
    estimatedBudget: 750,
    bestTimeToVisit: "October to May",
    description: "An archipelago of emerald tropical islands, turquoise coral lagoons, world-class scuba diving, and Radhanagar Beach—crowned as the Best Beach in Asia by Time Magazine.",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Radhanagar Beach (Beach No. 7)", "Elephant Beach Coral Reef", "Cellular Jail National Memorial Port Blair", "Neil Island Natural Bridge", "Baratang Limestone Caves"],
    thingsToDo: ["Scuba diving and sea-walking among colorful coral reefs", "Kayaking through bioluminescent night waters in Havelock", "Sound & Light emotional tribute at historic Cellular Jail"],
    travelTips: ["Book private catamaran ferries (Makruzz/Green Ocean) between islands ahead of time", "Water activity operators require medical fitness declaration"],
    latitude: 11.9761,
    longitude: 92.9876
  },

  // 30. CHANDIGARH
  {
    name: "Chandigarh Rock Garden",
    country: "India",
    region: "Chandigarh",
    category: "City",
    rating: 4.75,
    estimatedBudget: 350,
    bestTimeToVisit: "October to March",
    description: "India's first planned modern city designed by legendary Swiss-French architect Le Corbusier, famous for Nek Chand's whimsical 40-acre Rock Garden made entirely of recycled industrial waste, and tranquil Sukhna Lake.",
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Nek Chand's Rock Garden", "Sukhna Lake", "Zakir Hussain Rose Garden (Asia's Largest)", "Capitol Complex UNESCO", "Sector 17 Open Plaza"],
    thingsToDo: ["Pedal boating during sunset on Sukhna Lake", "Walk through thousands of ceramic and glass humanoid sculptures in Rock Garden", "Explore 1,600 varieties of blooming roses in spring"],
    travelTips: ["Rent a SmartBike for eco-friendly cycling across designated city bike paths", "Enjoy the vibrant café culture in Sector 7 and 26"],
    latitude: 30.7333,
    longitude: 76.7794
  },

  // 31. DADRA AND NAGAR HAVELI AND DAMAN AND DIU
  {
    name: "Diu Fort & Nagoa Beach",
    country: "India",
    region: "Dadra and Nagar Haveli and Daman and Diu",
    category: "Beach",
    rating: 4.7,
    estimatedBudget: 380,
    bestTimeToVisit: "October to March",
    description: "A tranquil Portuguese-era coastal enclave boasting historic sea-facing stone ramparts with cannons, colorful whitewashed churches, and the horseshoe-shaped, palm-fringed Nagoa Beach.",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Diu Fort (Sea Fortress)", "Nagoa Beach", "St. Paul's Church", "Naida Caves (Sunlit Labyrinth)", "Gangeshwar Mahadev (Sea Shivalingas)"],
    thingsToDo: ["Explore the sun-drenched chambers of natural Naida Caves", "Water sports including parasailing and jet-skiing at Nagoa Beach", "Cycling along the breezy seaside cliff promenade"],
    travelTips: ["The island is compact and best explored on a hired moped", "Taste fresh seafood and Portuguese-influenced coastal delicacies"],
    latitude: 20.7144,
    longitude: 70.9874
  },

  // 32. DELHI
  {
    name: "New Delhi & Historic Monuments",
    country: "India",
    region: "Delhi",
    category: "Historical",
    rating: 4.85,
    estimatedBudget: 450,
    bestTimeToVisit: "October to March",
    description: "India's capital city, spanning millennia of historic empires: the colossal Red Fort, soaring Qutub Minar, tranquil Lotus Temple, and the electric street-food lanes of Old Delhi's Chandni Chowk.",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Red Fort (Lal Qila)", "Qutub Minar UNESCO", "Humayun's Tomb", "India Gate & Kartavya Path", "Lotus Temple & Akshardham"],
    thingsToDo: ["Cycle rickshaw tour through the spice lanes of Khari Baoli", "Witness sunset ceremony at the iconic India Gate war memorial", "Taste parathas at Paranthe Wali Gali and chaat at Bengali Market"],
    travelTips: ["Use the world-class Delhi Metro for fast, air-conditioned travel", "Book monument tickets through ASI website to avoid queues"],
    latitude: 28.6139,
    longitude: 77.2090
  },

  // 33. JAMMU & KASHMIR
  {
    name: "Srinagar, Gulmarg & Pahalgam",
    country: "India",
    region: "Jammu & Kashmir",
    category: "Mountain",
    rating: 4.95,
    estimatedBudget: 650,
    bestTimeToVisit: "April to October (Gardens) & Dec to March (Snow)",
    description: "Paradise on Earth: gliding in wood-carved Shikaras across shimmering Dal Lake against snow-topped Zabarwan peaks, world-class skiing on Apharwat peak in Gulmarg, and saffron fields in Pahalgam.",
    images: [
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Dal Lake & Floating Vegetable Market", "Gulmarg Gondola (World's 2nd Highest Cable Car)", "Betaab Valley & Aru Valley Pahalgam", "Mughal Gardens (Shalimar & Nishat)", "Indira Gandhi Memorial Tulip Garden"],
    thingsToDo: ["Stay in a handcrafted cedar houseboat on Dal Lake", "Take the Phase II Gondola ride to 13,780 feet for skiing and snow views", "Sip steaming saffron Kahwa with almonds beside a wood stove"],
    travelTips: ["Book Gulmarg Gondola Phase 2 tickets weeks ahead online", "Buy certified GI-tagged Kashmir saffron and walnut wood carvings"],
    latitude: 34.0837,
    longitude: 74.7973
  },

  // 34. LADAKH
  {
    name: "Leh, Pangong Tso & Nubra",
    country: "India",
    region: "Ladakh",
    category: "Adventure",
    rating: 4.98,
    estimatedBudget: 750,
    bestTimeToVisit: "May to September",
    description: "The Roof of the World: high-altitude desert plateaus, changing hues of the 134-km long Pangong Tso lake, white sand dunes with Bactrian two-humped camels in Nubra, and high passes like Khardung La.",
    images: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Pangong Tso Lake (14,270 ft)", "Nubra Valley & Hunder Sand Dunes", "Khardung La Pass (17,982 ft)", "Thiksey & Diskit Monasteries", "Magnetic Hill"],
    thingsToDo: ["Double-humped camel safari across cold desert dunes in Hunder", "Stargazing under the clearest Bortle-1 night skies at Hanle Dark Sky Reserve", "Motorbike expedition across high Himalayan mountain passes"],
    travelTips: ["Mandatory 48-hour rest upon arrival in Leh to prevent Acute Mountain Sickness (AMS)", "Carry warm windproof jackets and sunscreen"],
    latitude: 34.1526,
    longitude: 77.5771
  },

  // 35. LAKSHADWEEP
  {
    name: "Agatti Island & Bangaram Atoll",
    country: "India",
    region: "Lakshadweep",
    category: "Beach",
    rating: 4.95,
    estimatedBudget: 850,
    bestTimeToVisit: "October to mid-May",
    description: "India's secluded coral atoll paradise in the Arabian Sea: crystal-clear turquoise lagoons, vibrant live coral reefs, coconut palm groves, and uninhabited tropical sandspits.",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["Bangaram Coral Atoll", "Agatti Island Lagoon", "Thinnakara Island", "Kavaratti Marine Aquarium", "Kalpeni Atoll"],
    thingsToDo: ["Snorkel and scuba dive alongside sea turtles and manta rays in crystal shallows", "Kayaking on bioluminescent lagoons", "Deep-sea game fishing and island beach picnics"],
    travelTips: ["Entry permit is mandatory for all visitors to Lakshadweep", "Flights operate daily from Kochi to Agatti airstrip"],
    latitude: 10.8530,
    longitude: 72.1948
  },

  // 36. PUDUCHERRY
  {
    name: "Puducherry French Quarter",
    country: "India",
    region: "Puducherry",
    category: "Beach",
    rating: 4.8,
    estimatedBudget: 400,
    bestTimeToVisit: "October to March",
    description: "The French Riviera of the East: charming pastel yellow colonial mansions, bougainvillea-draped balconies, chic seaside cafés in White Town, and the universal spiritual city of Auroville centered on the golden Matrimandir.",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
    ],
    attractions: ["White Town (French Quarter)", "Promenade Beachfront", "Auroville & Matrimandir", "Sri Aurobindo Ashram", "Paradise Beach (accessible by boat)"],
    thingsToDo: ["Stroll along vehicle-free Promenade Beach at sunset", "Rent a vintage bicycle to explore French bakeries and boutique cafés", "Meditate in the tranquil peace gardens of the golden Matrimandir"],
    travelTips: ["Book Matrimandir inner chamber passes days in advance", "Taste authentic wood-fired sourdough pizzas and French croissants"],
    latitude: 11.9416,
    longitude: 79.8083
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderlust');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Destination.deleteMany();
    await Review.deleteMany();
    console.log('Cleared previous DB collections...');

    // Seed Admin User
    const adminUser = await User.create({
      name: 'Wanderlust Admin',
      email: 'admin@wanderlust.com',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });
    console.log('Admin user seeded: admin@wanderlust.com / Admin@123');

    // Seed 2 Regular Users
    const user1 = await User.create({
      name: 'Aarav Sharma',
      email: 'user1@wanderlust.com',
      password: 'User@123',
      role: 'user',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });

    const user2 = await User.create({
      name: 'Diya Patel',
      email: 'user2@wanderlust.com',
      password: 'User@123',
      role: 'user',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    });
    console.log('Regular users seeded: user1@wanderlust.com & user2@wanderlust.com');

    // Attach owners alternating between user1 and admin
    const destinationsWithOwner = sampleDestinations.map((dest, idx) => ({
      ...dest,
      owner: idx % 2 === 0 ? user1._id : adminUser._id
    }));

    const createdDestinations = await Destination.insertMany(destinationsWithOwner);
    console.log(`Seeded ${createdDestinations.length} destinations covering ALL 28 States + 8 Union Territories of India!`);

    // Add user1 favorites (e.g. first 3 destinations)
    user1.favorites = [createdDestinations[0]._id, createdDestinations[5]._id, createdDestinations[8]._id];
    await user1.save();
    console.log('Added initial favorites for user1.');

    // Seed Reviews
    const sampleReviews = [
      {
        user: user1._id,
        destination: createdDestinations[0]._id,
        rating: 5,
        title: "Spectacular coastal scenery & hills!",
        comment: "The beaches in Vizag and the mountain drive to Araku are unforgettable. The Borra Caves are truly awe-inspiring."
      },
      {
        user: user2._id,
        destination: createdDestinations[5]._id,
        rating: 5,
        title: "Mesmerizing waterfalls and relaxing beaches",
        comment: "Dudhsagar falls was in full glory! Goan hospitality and seafood were top-notch."
      },
      {
        user: user1._id,
        destination: createdDestinations[8]._id,
        rating: 5,
        title: "Heaven on Earth",
        comment: "The snow peaks of Solang Valley and the serene monastery in Spiti are deeply magical. Truly unmissable."
      }
    ];

    await Review.insertMany(sampleReviews);
    console.log('Sample reviews seeded successfully.');

    console.log('Database seeding complete: 100% Incredible India destinations loaded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
