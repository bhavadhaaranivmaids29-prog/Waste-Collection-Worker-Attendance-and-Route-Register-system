/* ═══════════════════════════════════════════════════════════
   WasteTrack — Vanilla JS + localStorage (no backend needed)
   ═══════════════════════════════════════════════════════════ */

function today() { return new Date().toISOString().slice(0, 10); }

const PAGE_TITLES = {
  dashboard:  ['Dashboard', 'Overview of today\'s operations'],
  workers:    ['Workers', 'Manage collection workers'],
  attendance: ['Attendance', 'Track daily attendance'],
  routes:     ['Routes', 'Manage collection routes'],
  coverage:   ['Route Coverage', 'Monitor route completion status'],
  history:    ['History', 'View past days\' reports'],
};

let currentPage = 'dashboard';

// ═══════════════════════════════════════════════════════════
// LOCAL STORAGE DATA LAYER
// ═══════════════════════════════════════════════════════════
const DB_KEY = 'wastetrack_db';

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const db = seedData();
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nextId(collection) {
  const db = getDB();
  const items = db[collection] || [];
  if (!items.length) return collection === 'workers' ? 'W001' : collection === 'routes' ? 'R001' : collection === 'attendance' ? 'A001' : 'C001';
  const prefix = items[0].id.replace(/[0-9]+/g, '');
  const nums = items.map(i => parseInt(i.id.replace(/[^0-9]/g, '')));
  return prefix + String(Math.max(...nums) + 1).padStart(3, '0');
}

// ── Seed Data ──────────────────────────────────────────────
function seedData() {
  return {
    workers: [
      {id:"W001",name:"Ravi Kumar",phone:"9876543210",status:"active"},
      {id:"W002",name:"Priya Devi",phone:"9876543211",status:"active"},
      {id:"W003",name:"Suresh Babu",phone:"9876543212",status:"active"},
      {id:"W004",name:"Lakshmi R.",phone:"9876543213",status:"active"},
      {id:"W005",name:"Anand Raj",phone:"9876543214",status:"active"},
      {id:"W006",name:"Meena Kumari",phone:"9876543215",status:"active"},
      {id:"W007",name:"Venkatesh P.",phone:"9876543216",status:"active"},
      {id:"W008",name:"Kavitha S.",phone:"9876543217",status:"active"},
      {id:"W009",name:"Rajesh M.",phone:"9876543218",status:"active"},
      {id:"W010",name:"Sumathi L.",phone:"9876543219",status:"active"},
      {id:"W011",name:"Mani V.",phone:"9876543220",status:"inactive"},
      {id:"W012",name:"Divya N.",phone:"9876543221",status:"active"},
      {id:"W013",name:"Bhava",phone:"7598103740",status:"inactive"},
      {id:"W014",name:"Arun Prasad",phone:"9845100001",status:"active"},
      {id:"W015",name:"Deepa Mohan",phone:"9845100002",status:"active"},
      {id:"W016",name:"Ganesh R.",phone:"9845100003",status:"active"},
      {id:"W017",name:"Hema Malini",phone:"9845100004",status:"active"},
      {id:"W018",name:"Ilango K.",phone:"9845100005",status:"active"},
      {id:"W019",name:"Janani S.",phone:"9845100006",status:"active"},
      {id:"W020",name:"Karthik T.",phone:"9845100007",status:"inactive"},
      {id:"W021",name:"Latha P.",phone:"9845100008",status:"active"},
      {id:"W022",name:"Mohan Das",phone:"9845100009",status:"active"},
      {id:"W023",name:"Nithya R.",phone:"9845100010",status:"active"},
      {id:"W024",name:"Priyanka M.",phone:"9845100011",status:"active"},
      {id:"W025",name:"Vignesh R.",phone:"9845100012",status:"active"},
      {id:"W026",name:"Swathi K.",phone:"9845100013",status:"active"},
      {id:"W027",name:"Thirunavukkarasu S.",phone:"9845100014",status:"inactive"},
      {id:"W028",name:"Uma Shankar",phone:"9845100015",status:"active"},
      {id:"W029",name:"Vasanthi B.",phone:"9845100016",status:"active"},
      {id:"W030",name:"Yogesh P.",phone:"9845100017",status:"active"},
      {id:"W031",name:"Aishwarya R.",phone:"9845100018",status:"active"},
      {id:"W032",name:"Bala Murugan",phone:"9845100019",status:"active"},
      {id:"W033",name:"Chitra Devi",phone:"9845100020",status:"active"},
      {id:"W034",name:"Dinesh Kumar",phone:"9845100021",status:"active"},
      {id:"W035",name:"Ezhil Selvan",phone:"9845100022",status:"inactive"},
      {id:"W036",name:"Fathima Begum",phone:"9845100023",status:"active"},
      {id:"W037",name:"Gopal Krishna",phone:"9845100024",status:"active"},
      {id:"W038",name:"Hari Prasad",phone:"9845100025",status:"active"},
      {id:"W039",name:"Indira Devi",phone:"9845100026",status:"active"},
      {id:"W040",name:"Jeyaraman K.",phone:"9845100027",status:"active"},

    ],
    routes: [
      {id:"R001",name:"Route A - Main Street",assignedWorkerId:"W001",description:"Main Street, Park Road, Lake View, Temple Square"},
      {id:"R002",name:"Route B - Industrial Area",assignedWorkerId:"W002",description:"Industrial Zone, Factory Road, Warehouse District"},
      {id:"R003",name:"Route C - Residential Colony",assignedWorkerId:"W003",description:"Green Colony, Sunrise Nagar, Nehru Street"},
      {id:"R004",name:"Route D - Market Area",assignedWorkerId:"W004",description:"Central Market, Bazaar Road, Flower Market, Fish Market"},
      {id:"R005",name:"Route E - Highway Stretch",assignedWorkerId:"W005",description:"Highway Road, Toll Gate, Outskirts, Petrol Bunk Junction"},
      {id:"R006",name:"Route F - Hospital Zone",assignedWorkerId:"W006",description:"Hospital Road, Clinic Street, Pharmacy Lane, Blood Bank Road"},
      {id:"R007",name:"Route G - School District",assignedWorkerId:"W007",description:"School Road, College Lane, Library Street, Play Ground Road"},
      {id:"R008",name:"Route H - Township",assignedWorkerId:"W008",description:"Township Layout, Sector 1-5, Community Hall Road, Park Avenue"},
      {id:"R009",name:"Route I - Railway Colony",assignedWorkerId:"W009",description:"Railway Station Road, Platform Area, Colony Gate, Staff Quarters"},
      {id:"R010",name:"Route J - Temple Town",assignedWorkerId:"W010",description:"Temple Street, Pilgrim Road, Ghat Road, Prasad Market"},
      {id:"R011",name:"Route K - IT Park",assignedWorkerId:"W012",description:"IT Expressway, Tech Park, Software Layout, Cafeteria Road"},
      {id:"R012",name:"Route L - Garden District",assignedWorkerId:"W014",description:"Botanical Garden Road, Rose Park, Lotus Lane, Fern Avenue"},
      {id:"R013",name:"Route M - Lake View",assignedWorkerId:"W015",description:"Lakefront Road, Boat House Area, Fishermen Colony, Sunset Point"},
      {id:"R014",name:"Route N - Shopping Complex",assignedWorkerId:"W016",description:"Mall Road, Hypermarket Lane, Food Court Street, Parking Area"},
      {id:"R015",name:"Route O - Old City",assignedWorkerId:"W017",description:"Heritage Street, Fort Road, Ancient Bazaar, Clock Tower Area"},
      {id:"R016",name:"Route P - University Campus",assignedWorkerId:"W018",description:"University Gate, Hostel Road, Sports Complex, Research Block"},
      {id:"R017",name:"Route Q - Industrial Estate",assignedWorkerId:"W019",description:"Phase 1-3 Industrial Estate, Power House Road, Logistics Hub"},
      {id:"R018",name:"Route R - Suburban Area",assignedWorkerId:"W021",description:"Suburban Bus Stand, Market Yard, School Zone, Residential Blocks A-D"},
      {id:"R019",name:"Route S - Metro Colony",assignedWorkerId:"W024",description:"Metro Colony East, West Block, Community Park, Shopping Street"},
      {id:"R020",name:"Route T - Green Valley",assignedWorkerId:"W025",description:"Green Valley Road, Hill View, Spring Lane, Water Tank Area"},
      {id:"R021",name:"Route U - Bus Terminal",assignedWorkerId:"W026",description:"Central Bus Terminal, Auto Stand, Taxi Bay, Refreshment Corner"},
      {id:"R022",name:"Route V - Power Station",assignedWorkerId:"W028",description:"Power Station Road, Transformer Colony, Grid Layout, Staff Quarters"},
      {id:"R023",name:"Route W - Fishery Area",assignedWorkerId:"W029",description:"Harbor Road, Fish Market, Ice Plant Lane, Dock Yard"},
      {id:"R024",name:"Route X - Medical Complex",assignedWorkerId:"W030",description:"Medical Complex Road, Specialist Clinic, Diagnostic Center, Ambulance Bay"},
      {id:"R025",name:"Route Y - Craft Village",assignedWorkerId:"W031",description:"Artisan Colony, Handloom Lane, Pottery Street, Weaving Center"},
      {id:"R026",name:"Route Z - Airport Road",assignedWorkerId:"W032",description:"Airport Approach Road, Hangar Area, Cargo Terminal, Radar Colony"},
      {id:"R027",name:"Route AA - Civic Center",assignedWorkerId:"W033",description:"Municipal Office Road, Court Lane, Treasury Building, Post Office Street"},
      {id:"R028",name:"Route AB - River Bank",assignedWorkerId:"W036",description:"Riverfront Promenade, Ghat Steps, Boat Jetty, Riverside Park"},
      {id:"R029",name:"Route AC - Tech Hub",assignedWorkerId:"W037",description:"Startup Lane, Incubator Road, Co-working Street, Venture Park"},
      {id:"R030",name:"Route AD - Heritage Zone",assignedWorkerId:"W038",description:"Museum Road, Gallery Lane, Statue Circle, Archaeological Site"},
    ],
    attendance: [
      {id:"A001",workerId:"W001",date:"2026-07-20",status:"present"},
      {id:"A002",workerId:"W002",date:"2026-07-20",status:"present"},
      {id:"A003",workerId:"W003",date:"2026-07-20",status:"absent"},
      {id:"A004",workerId:"W004",date:"2026-07-20",status:"present"},
      {id:"A005",workerId:"W005",date:"2026-07-20",status:"present"},
      {id:"A006",workerId:"W006",date:"2026-07-20",status:"present"},
      {id:"A007",workerId:"W007",date:"2026-07-20",status:"leave"},
      {id:"A008",workerId:"W008",date:"2026-07-20",status:"present"},
      {id:"A009",workerId:"W001",date:"2026-07-21",status:"present"},
      {id:"A010",workerId:"W002",date:"2026-07-21",status:"absent"},
      {id:"A011",workerId:"W003",date:"2026-07-21",status:"present"},
      {id:"A012",workerId:"W004",date:"2026-07-21",status:"present"},
      {id:"A013",workerId:"W005",date:"2026-07-21",status:"present"},
      {id:"A014",workerId:"W006",date:"2026-07-21",status:"leave"},
      {id:"A015",workerId:"W007",date:"2026-07-21",status:"present"},
      {id:"A016",workerId:"W008",date:"2026-07-21",status:"absent"},
      {id:"A017",workerId:"W001",date:"2026-07-22",status:"present"},
      {id:"A018",workerId:"W002",date:"2026-07-22",status:"present"},
      {id:"A019",workerId:"W003",date:"2026-07-22",status:"present"},
      {id:"A020",workerId:"W004",date:"2026-07-22",status:"absent"},
      {id:"A021",workerId:"W005",date:"2026-07-22",status:"present"},
      {id:"A022",workerId:"W006",date:"2026-07-22",status:"present"},
      {id:"A023",workerId:"W007",date:"2026-07-22",status:"present"},
      {id:"A024",workerId:"W008",date:"2026-07-22",status:"present"},
      {id:"A025",workerId:"W001",date:"2026-07-23",status:"present"},
      {id:"A026",workerId:"W002",date:"2026-07-23",status:"present"},
      {id:"A027",workerId:"W003",date:"2026-07-23",status:"leave"},
      {id:"A028",workerId:"W004",date:"2026-07-23",status:"present"},
      {id:"A029",workerId:"W005",date:"2026-07-23",status:"absent"},
      {id:"A030",workerId:"W006",date:"2026-07-23",status:"present"},
      {id:"A031",workerId:"W007",date:"2026-07-23",status:"present"},
      {id:"A032",workerId:"W008",date:"2026-07-23",status:"present"},
      {id:"A033",workerId:"W001",date:"2026-07-24",status:"present"},
      {id:"A034",workerId:"W002",date:"2026-07-24",status:"absent"},
      {id:"A035",workerId:"W003",date:"2026-07-24",status:"present"},
      {id:"A036",workerId:"W004",date:"2026-07-24",status:"present"},
      {id:"A037",workerId:"W005",date:"2026-07-24",status:"present"},
      {id:"A038",workerId:"W006",date:"2026-07-24",status:"leave"},
      {id:"A039",workerId:"W007",date:"2026-07-24",status:"present"},
      {id:"A040",workerId:"W008",date:"2026-07-24",status:"absent"},
      {id:"A041",workerId:"W001",date:"2026-07-25",status:"present"},
      {id:"A042",workerId:"W002",date:"2026-07-25",status:"present"},
      {id:"A043",workerId:"W003",date:"2026-07-25",status:"absent"},
      {id:"A044",workerId:"W004",date:"2026-07-25",status:"present"},
      {id:"A045",workerId:"W005",date:"2026-07-25",status:"leave"},
      {id:"A046",workerId:"W006",date:"2026-07-25",status:"present"},
      {id:"A047",workerId:"W007",date:"2026-07-25",status:"absent"},
      {id:"A048",workerId:"W008",date:"2026-07-25",status:"present"},
      {id:"A049",workerId:"W009",date:"2026-07-22",status:"present"},
      {id:"A050",workerId:"W010",date:"2026-07-22",status:"present"},
      {id:"A051",workerId:"W009",date:"2026-07-23",status:"absent"},
      {id:"A052",workerId:"W010",date:"2026-07-23",status:"present"},
      {id:"A053",workerId:"W009",date:"2026-07-24",status:"present"},
      {id:"A054",workerId:"W010",date:"2026-07-24",status:"leave"},
      {id:"A055",workerId:"W009",date:"2026-07-25",status:"present"},
      {id:"A056",workerId:"W010",date:"2026-07-25",status:"absent"},
      {id:"A057",workerId:"W012",date:"2026-07-25",status:"present"},
      {id:"A058",workerId:"W014",date:"2026-07-20",status:"present"},
      {id:"A059",workerId:"W015",date:"2026-07-20",status:"present"},
      {id:"A060",workerId:"W016",date:"2026-07-20",status:"absent"},
      {id:"A061",workerId:"W017",date:"2026-07-20",status:"present"},
      {id:"A062",workerId:"W018",date:"2026-07-20",status:"present"},
      {id:"A063",workerId:"W019",date:"2026-07-20",status:"leave"},
      {id:"A064",workerId:"W021",date:"2026-07-20",status:"present"},
      {id:"A065",workerId:"W022",date:"2026-07-20",status:"present"},
      {id:"A066",workerId:"W023",date:"2026-07-20",status:"present"},
      {id:"A067",workerId:"W014",date:"2026-07-21",status:"present"},
      {id:"A068",workerId:"W015",date:"2026-07-21",status:"absent"},
      {id:"A069",workerId:"W016",date:"2026-07-21",status:"present"},
      {id:"A070",workerId:"W017",date:"2026-07-21",status:"present"},
      {id:"A071",workerId:"W018",date:"2026-07-21",status:"leave"},
      {id:"A072",workerId:"W019",date:"2026-07-21",status:"present"},
      {id:"A073",workerId:"W021",date:"2026-07-21",status:"present"},
      {id:"A074",workerId:"W022",date:"2026-07-21",status:"absent"},
      {id:"A075",workerId:"W023",date:"2026-07-21",status:"present"},
      {id:"A076",workerId:"W014",date:"2026-07-22",status:"present"},
      {id:"A077",workerId:"W015",date:"2026-07-22",status:"present"},
      {id:"A078",workerId:"W016",date:"2026-07-22",status:"present"},
      {id:"A079",workerId:"W017",date:"2026-07-22",status:"absent"},
      {id:"A080",workerId:"W018",date:"2026-07-22",status:"present"},
      {id:"A081",workerId:"W019",date:"2026-07-22",status:"present"},
      {id:"A082",workerId:"W021",date:"2026-07-22",status:"present"},
      {id:"A083",workerId:"W022",date:"2026-07-22",status:"present"},
      {id:"A084",workerId:"W023",date:"2026-07-22",status:"leave"},
      {id:"A085",workerId:"W014",date:"2026-07-23",status:"present"},
      {id:"A086",workerId:"W015",date:"2026-07-23",status:"present"},
      {id:"A087",workerId:"W016",date:"2026-07-23",status:"leave"},
      {id:"A088",workerId:"W017",date:"2026-07-23",status:"present"},
      {id:"A089",workerId:"W018",date:"2026-07-23",status:"present"},
      {id:"A090",workerId:"W019",date:"2026-07-23",status:"absent"},
      {id:"A091",workerId:"W021",date:"2026-07-23",status:"present"},
      {id:"A092",workerId:"W022",date:"2026-07-23",status:"present"},
      {id:"A093",workerId:"W023",date:"2026-07-23",status:"present"},
      {id:"A094",workerId:"W014",date:"2026-07-24",status:"absent"},
      {id:"A095",workerId:"W015",date:"2026-07-24",status:"present"},
      {id:"A096",workerId:"W016",date:"2026-07-24",status:"present"},
      {id:"A097",workerId:"W017",date:"2026-07-24",status:"present"},
      {id:"A098",workerId:"W018",date:"2026-07-24",status:"absent"},
      {id:"A099",workerId:"W019",date:"2026-07-24",status:"present"},
      {id:"A100",workerId:"W021",date:"2026-07-24",status:"present"},
      {id:"A101",workerId:"W022",date:"2026-07-24",status:"leave"},
      {id:"A102",workerId:"W023",date:"2026-07-24",status:"present"},
      {id:"A103",workerId:"W014",date:"2026-07-25",status:"present"},
      {id:"A104",workerId:"W015",date:"2026-07-25",status:"present"},
      {id:"A105",workerId:"W016",date:"2026-07-25",status:"present"},
      {id:"A106",workerId:"W017",date:"2026-07-25",status:"absent"},
      {id:"A107",workerId:"W018",date:"2026-07-25",status:"present"},
      {id:"A108",workerId:"W019",date:"2026-07-25",status:"present"},
      {id:"A109",workerId:"W021",date:"2026-07-25",status:"leave"},
      {id:"A110",workerId:"W022",date:"2026-07-25",status:"present"},
      {id:"A111",workerId:"W023",date:"2026-07-25",status:"present"},
      {id:"A112",workerId:"W024",date:"2026-07-20",status:"present"},
      {id:"A113",workerId:"W025",date:"2026-07-20",status:"present"},
      {id:"A114",workerId:"W026",date:"2026-07-20",status:"absent"},
      {id:"A115",workerId:"W028",date:"2026-07-20",status:"present"},
      {id:"A116",workerId:"W029",date:"2026-07-20",status:"present"},
      {id:"A117",workerId:"W030",date:"2026-07-20",status:"leave"},
      {id:"A118",workerId:"W031",date:"2026-07-20",status:"present"},
      {id:"A119",workerId:"W032",date:"2026-07-20",status:"present"},
      {id:"A120",workerId:"W033",date:"2026-07-20",status:"present"},
      {id:"A121",workerId:"W034",date:"2026-07-20",status:"absent"},
      {id:"A122",workerId:"W036",date:"2026-07-20",status:"present"},
      {id:"A123",workerId:"W037",date:"2026-07-20",status:"present"},
      {id:"A124",workerId:"W038",date:"2026-07-20",status:"present"},
      {id:"A125",workerId:"W039",date:"2026-07-20",status:"present"},
      {id:"A126",workerId:"W040",date:"2026-07-20",status:"leave"},

      {id:"A130",workerId:"W024",date:"2026-07-21",status:"present"},
      {id:"A131",workerId:"W025",date:"2026-07-21",status:"absent"},
      {id:"A132",workerId:"W026",date:"2026-07-21",status:"present"},
      {id:"A133",workerId:"W028",date:"2026-07-21",status:"present"},
      {id:"A134",workerId:"W029",date:"2026-07-21",status:"leave"},
      {id:"A135",workerId:"W030",date:"2026-07-21",status:"present"},
      {id:"A136",workerId:"W031",date:"2026-07-21",status:"present"},
      {id:"A137",workerId:"W032",date:"2026-07-21",status:"present"},
      {id:"A138",workerId:"W033",date:"2026-07-21",status:"absent"},
      {id:"A139",workerId:"W034",date:"2026-07-21",status:"present"},
      {id:"A140",workerId:"W036",date:"2026-07-21",status:"present"},
      {id:"A141",workerId:"W037",date:"2026-07-21",status:"present"},
      {id:"A142",workerId:"W038",date:"2026-07-21",status:"leave"},
      {id:"A143",workerId:"W039",date:"2026-07-21",status:"present"},
      {id:"A144",workerId:"W040",date:"2026-07-21",status:"present"},

      {id:"A148",workerId:"W024",date:"2026-07-22",status:"present"},
      {id:"A149",workerId:"W025",date:"2026-07-22",status:"present"},
      {id:"A150",workerId:"W026",date:"2026-07-22",status:"present"},
      {id:"A151",workerId:"W028",date:"2026-07-22",status:"absent"},
      {id:"A152",workerId:"W029",date:"2026-07-22",status:"present"},
      {id:"A153",workerId:"W030",date:"2026-07-22",status:"present"},
      {id:"A154",workerId:"W031",date:"2026-07-22",status:"leave"},
      {id:"A155",workerId:"W032",date:"2026-07-22",status:"present"},
      {id:"A156",workerId:"W033",date:"2026-07-22",status:"present"},
      {id:"A157",workerId:"W034",date:"2026-07-22",status:"present"},
      {id:"A158",workerId:"W036",date:"2026-07-22",status:"absent"},
      {id:"A159",workerId:"W037",date:"2026-07-22",status:"present"},
      {id:"A160",workerId:"W038",date:"2026-07-22",status:"present"},
      {id:"A161",workerId:"W039",date:"2026-07-22",status:"present"},
      {id:"A162",workerId:"W040",date:"2026-07-22",status:"present"},

      {id:"A166",workerId:"W024",date:"2026-07-23",status:"leave"},
      {id:"A167",workerId:"W025",date:"2026-07-23",status:"present"},
      {id:"A168",workerId:"W026",date:"2026-07-23",status:"present"},
      {id:"A169",workerId:"W028",date:"2026-07-23",status:"present"},
      {id:"A170",workerId:"W029",date:"2026-07-23",status:"present"},
      {id:"A171",workerId:"W030",date:"2026-07-23",status:"absent"},
      {id:"A172",workerId:"W031",date:"2026-07-23",status:"present"},
      {id:"A173",workerId:"W032",date:"2026-07-23",status:"present"},
      {id:"A174",workerId:"W033",date:"2026-07-23",status:"present"},
      {id:"A175",workerId:"W034",date:"2026-07-23",status:"leave"},
      {id:"A176",workerId:"W036",date:"2026-07-23",status:"present"},
      {id:"A177",workerId:"W037",date:"2026-07-23",status:"present"},
      {id:"A178",workerId:"W038",date:"2026-07-23",status:"present"},
      {id:"A179",workerId:"W039",date:"2026-07-23",status:"absent"},
      {id:"A180",workerId:"W040",date:"2026-07-23",status:"present"},

      {id:"A184",workerId:"W024",date:"2026-07-24",status:"present"},
      {id:"A185",workerId:"W025",date:"2026-07-24",status:"present"},
      {id:"A186",workerId:"W026",date:"2026-07-24",status:"absent"},
      {id:"A187",workerId:"W028",date:"2026-07-24",status:"present"},
      {id:"A188",workerId:"W029",date:"2026-07-24",status:"present"},
      {id:"A189",workerId:"W030",date:"2026-07-24",status:"present"},
      {id:"A190",workerId:"W031",date:"2026-07-24",status:"present"},
      {id:"A191",workerId:"W032",date:"2026-07-24",status:"absent"},
      {id:"A192",workerId:"W033",date:"2026-07-24",status:"present"},
      {id:"A193",workerId:"W034",date:"2026-07-24",status:"present"},
      {id:"A194",workerId:"W036",date:"2026-07-24",status:"present"},
      {id:"A195",workerId:"W037",date:"2026-07-24",status:"leave"},
      {id:"A196",workerId:"W038",date:"2026-07-24",status:"present"},
      {id:"A197",workerId:"W039",date:"2026-07-24",status:"present"},
      {id:"A198",workerId:"W040",date:"2026-07-24",status:"absent"},

      {id:"A202",workerId:"W024",date:"2026-07-25",status:"present"},
      {id:"A203",workerId:"W025",date:"2026-07-25",status:"present"},
      {id:"A204",workerId:"W026",date:"2026-07-25",status:"present"},
      {id:"A205",workerId:"W028",date:"2026-07-25",status:"present"},
      {id:"A206",workerId:"W029",date:"2026-07-25",status:"absent"},
      {id:"A207",workerId:"W030",date:"2026-07-25",status:"present"},
      {id:"A208",workerId:"W031",date:"2026-07-25",status:"present"},
      {id:"A209",workerId:"W032",date:"2026-07-25",status:"present"},
      {id:"A210",workerId:"W033",date:"2026-07-25",status:"leave"},
      {id:"A211",workerId:"W034",date:"2026-07-25",status:"present"},
      {id:"A212",workerId:"W036",date:"2026-07-25",status:"present"},
      {id:"A213",workerId:"W037",date:"2026-07-25",status:"present"},
      {id:"A214",workerId:"W038",date:"2026-07-25",status:"present"},
      {id:"A215",workerId:"W039",date:"2026-07-25",status:"present"},
      {id:"A216",workerId:"W040",date:"2026-07-25",status:"present"},

    ],
    routeCoverage: [
      {id:"C001",routeId:"R001",date:"2026-07-20",status:"covered",notes:"Completed all 4 collection points on time"},
      {id:"C002",routeId:"R002",date:"2026-07-20",status:"covered",notes:"All industrial bins cleared"},
      {id:"C003",routeId:"R003",date:"2026-07-20",status:"not_covered",notes:"Worker absent, no substitute"},
      {id:"C004",routeId:"R004",date:"2026-07-20",status:"covered",notes:"Market cleaned before opening hours"},
      {id:"C005",routeId:"R005",date:"2026-07-20",status:"covered",notes:"Highway stretch fully covered"},
      {id:"C006",routeId:"R006",date:"2026-07-20",status:"covered",notes:"Hospital zone cleared on schedule"},
      {id:"C007",routeId:"R007",date:"2026-07-20",status:"partial",notes:"Only school road done, college lane skipped"},
      {id:"C008",routeId:"R008",date:"2026-07-20",status:"covered",notes:"Township all sectors done"},
      {id:"C009",routeId:"R001",date:"2026-07-21",status:"covered",notes:"On time, all points collected"},
      {id:"C010",routeId:"R002",date:"2026-07-21",status:"not_covered",notes:"Worker on leave, route skipped"},
      {id:"C011",routeId:"R003",date:"2026-07-21",status:"covered",notes:"Residential colony fully serviced"},
      {id:"C012",routeId:"R004",date:"2026-07-21",status:"covered",notes:"All market areas covered"},
      {id:"C013",routeId:"R005",date:"2026-07-21",status:"partial",notes:"Toll gate area skipped due to road block"},
      {id:"C014",routeId:"R006",date:"2026-07-21",status:"covered",notes:"Hospital waste collected on time"},
      {id:"C015",routeId:"R007",date:"2026-07-21",status:"covered",notes:"Full route completed"},
      {id:"C016",routeId:"R008",date:"2026-07-21",status:"not_covered",notes:"Worker absent, emergency coverage failed"},
      {id:"C017",routeId:"R001",date:"2026-07-22",status:"covered",notes:"All done before 10 AM"},
      {id:"C018",routeId:"R002",date:"2026-07-22",status:"covered",notes:"Industrial area fully cleared"},
      {id:"C019",routeId:"R003",date:"2026-07-22",status:"covered",notes:"Green Colony and Sunrise Nagar done"},
      {id:"C020",routeId:"R004",date:"2026-07-22",status:"not_covered",notes:"Worker sick, no replacement"},
      {id:"C021",routeId:"R005",date:"2026-07-22",status:"covered",notes:"Highway route done"},
      {id:"C022",routeId:"R006",date:"2026-07-22",status:"partial",notes:"Blood bank road skipped"},
      {id:"C023",routeId:"R007",date:"2026-07-22",status:"covered",notes:"School district fully serviced"},
      {id:"C024",routeId:"R008",date:"2026-07-22",status:"covered",notes:"All township sectors done"},
      {id:"C025",routeId:"R001",date:"2026-07-23",status:"covered",notes:"Completed on schedule"},
      {id:"C026",routeId:"R002",date:"2026-07-23",status:"covered",notes:"All factory bins cleared"},
      {id:"C027",routeId:"R003",date:"2026-07-23",status:"partial",notes:"Nehru Street skipped, rest done"},
      {id:"C028",routeId:"R004",date:"2026-07-23",status:"covered",notes:"Market area fully clean"},
      {id:"C029",routeId:"R005",date:"2026-07-23",status:"not_covered",notes:"Worker absent"},
      {id:"C030",routeId:"R006",date:"2026-07-23",status:"covered",notes:"Hospital zone done"},
      {id:"C031",routeId:"R007",date:"2026-07-23",status:"covered",notes:"All school roads done"},
      {id:"C032",routeId:"R008",date:"2026-07-23",status:"covered",notes:"Township layout serviced"},
      {id:"C033",routeId:"R001",date:"2026-07-24",status:"covered",notes:"On time, all done"},
      {id:"C034",routeId:"R002",date:"2026-07-24",status:"not_covered",notes:"Worker absent, route skipped"},
      {id:"C035",routeId:"R003",date:"2026-07-24",status:"covered",notes:"All residential areas covered"},
      {id:"C036",routeId:"R004",date:"2026-07-24",status:"covered",notes:"Bazaar Road cleaned early"},
      {id:"C037",routeId:"R005",date:"2026-07-24",status:"partial",notes:"Outskirts not covered, limited time"},
      {id:"C038",routeId:"R006",date:"2026-07-24",status:"covered",notes:"Full hospital route done"},
      {id:"C039",routeId:"R007",date:"2026-07-24",status:"covered",notes:"School district clean"},
      {id:"C040",routeId:"R008",date:"2026-07-24",status:"not_covered",notes:"Worker absent"},
      {id:"C041",routeId:"R001",date:"2026-07-25",status:"covered",notes:"Completed all collection points"},
      {id:"C042",routeId:"R002",date:"2026-07-25",status:"covered",notes:"All points collected"},
      {id:"C043",routeId:"R003",date:"2026-07-25",status:"not_covered",notes:"Worker absent, no substitute"},
      {id:"C044",routeId:"R004",date:"2026-07-25",status:"covered",notes:"Market area fully serviced"},
      {id:"C045",routeId:"R005",date:"2026-07-25",status:"partial",notes:"Half route covered by substitute"},
      {id:"C046",routeId:"R006",date:"2026-07-25",status:"covered",notes:"Hospital waste on time"},
      {id:"C047",routeId:"R007",date:"2026-07-25",status:"covered",notes:"Full school route done"},
      {id:"C048",routeId:"R008",date:"2026-07-25",status:"covered",notes:"All township sectors done"},
      {id:"C049",routeId:"R009",date:"2026-07-20",status:"covered",notes:"Railway colony fully serviced"},
      {id:"C050",routeId:"R010",date:"2026-07-20",status:"covered",notes:"Temple area cleaned before morning rush"},
      {id:"C051",routeId:"R011",date:"2026-07-20",status:"partial",notes:"Cafeteria road skipped due to event"},
      {id:"C052",routeId:"R012",date:"2026-07-20",status:"covered",notes:"Garden district fully cleared"},
      {id:"C053",routeId:"R013",date:"2026-07-20",status:"covered",notes:"Lakefront cleaned early morning"},
      {id:"C054",routeId:"R014",date:"2026-07-20",status:"not_covered",notes:"Worker absent, mall area skipped"},
      {id:"C055",routeId:"R015",date:"2026-07-20",status:"covered",notes:"Old city heritage area fully covered"},
      {id:"C056",routeId:"R016",date:"2026-07-20",status:"covered",notes:"University campus cleaned after classes"},
      {id:"C057",routeId:"R017",date:"2026-07-20",status:"covered",notes:"All industrial estate phases cleared"},
      {id:"C058",routeId:"R018",date:"2026-07-20",status:"covered",notes:"Suburban area fully serviced"},
      {id:"C059",routeId:"R009",date:"2026-07-21",status:"covered",notes:"All railway points done"},
      {id:"C060",routeId:"R010",date:"2026-07-21",status:"covered",notes:"Temple town route completed"},
      {id:"C061",routeId:"R011",date:"2026-07-21",status:"covered",notes:"IT Park fully serviced"},
      {id:"C062",routeId:"R012",date:"2026-07-21",status:"not_covered",notes:"Worker absent, garden area skipped"},
      {id:"C063",routeId:"R013",date:"2026-07-21",status:"partial",notes:"Boat house area skipped"},
      {id:"C064",routeId:"R014",date:"2026-07-21",status:"covered",notes:"Shopping complex cleaned before opening"},
      {id:"C065",routeId:"R015",date:"2026-07-21",status:"covered",notes:"Old city all lanes covered"},
      {id:"C066",routeId:"R016",date:"2026-07-21",status:"not_covered",notes:"Worker on leave, route skipped"},
      {id:"C067",routeId:"R017",date:"2026-07-21",status:"covered",notes:"Industrial estate fully cleared"},
      {id:"C068",routeId:"R018",date:"2026-07-21",status:"covered",notes:"All suburban blocks done"},
      {id:"C069",routeId:"R009",date:"2026-07-22",status:"covered",notes:"Railway station area done"},
      {id:"C070",routeId:"R010",date:"2026-07-22",status:"partial",notes:"Pilgrim road partially done"},
      {id:"C071",routeId:"R011",date:"2026-07-22",status:"covered",notes:"Tech park all buildings covered"},
      {id:"C072",routeId:"R012",date:"2026-07-22",status:"covered",notes:"Rose park and fern avenue done"},
      {id:"C073",routeId:"R013",date:"2026-07-22",status:"covered",notes:"Lakefront and sunset point done"},
      {id:"C074",routeId:"R014",date:"2026-07-22",status:"covered",notes:"Shopping complex fully cleaned"},
      {id:"C075",routeId:"R015",date:"2026-07-22",status:"covered",notes:"Fort road and clock tower done"},
      {id:"C076",routeId:"R016",date:"2026-07-22",status:"covered",notes:"University hostel area done"},
      {id:"C077",routeId:"R017",date:"2026-07-22",status:"not_covered",notes:"Worker absent, no coverage"},
      {id:"C078",routeId:"R018",date:"2026-07-22",status:"partial",notes:"Blocks A-C done, Block D skipped"},
      {id:"C079",routeId:"R009",date:"2026-07-23",status:"covered",notes:"Railway colony done on time"},
      {id:"C080",routeId:"R010",date:"2026-07-23",status:"covered",notes:"Temple area fully covered"},
      {id:"C081",routeId:"R011",date:"2026-07-23",status:"covered",notes:"IT Expressway fully serviced"},
      {id:"C082",routeId:"R012",date:"2026-07-23",status:"partial",notes:"Lotus lane skipped due to rain"},
      {id:"C083",routeId:"R013",date:"2026-07-23",status:"covered",notes:"Lake view full route done"},
      {id:"C084",routeId:"R014",date:"2026-07-23",status:"covered",notes:"Mall and food court cleaned"},
      {id:"C085",routeId:"R015",date:"2026-07-23",status:"not_covered",notes:"Worker absent, old city skipped"},
      {id:"C086",routeId:"R016",date:"2026-07-23",status:"covered",notes:"Campus and sports complex done"},
      {id:"C087",routeId:"R017",date:"2026-07-23",status:"covered",notes:"Power house road cleared"},
      {id:"C088",routeId:"R018",date:"2026-07-23",status:"covered",notes:"All suburban blocks done"},
      {id:"C089",routeId:"R009",date:"2026-07-24",status:"covered",notes:"Platform area and quarters done"},
      {id:"C090",routeId:"R010",date:"2026-07-24",status:"covered",notes:"Temple and prasad market done"},
      {id:"C091",routeId:"R011",date:"2026-07-24",status:"partial",notes:"Software layout partially covered"},
      {id:"C092",routeId:"R012",date:"2026-07-24",status:"covered",notes:"Botanical garden area done"},
      {id:"C093",routeId:"R013",date:"2026-07-24",status:"covered",notes:"Fishermen colony cleaned"},
      {id:"C094",routeId:"R014",date:"2026-07-24",status:"not_covered",notes:"Worker absent, shopping area skipped"},
      {id:"C095",routeId:"R015",date:"2026-07-24",status:"covered",notes:"Heritage street fully covered"},
      {id:"C096",routeId:"R016",date:"2026-07-24",status:"not_covered",notes:"Worker absent, campus not serviced"},
      {id:"C097",routeId:"R017",date:"2026-07-24",status:"covered",notes:"Logistics hub fully cleared"},
      {id:"C098",routeId:"R018",date:"2026-07-24",status:"covered",notes:"Bus stand and market yard done"},
      {id:"C099",routeId:"R009",date:"2026-07-25",status:"covered",notes:"Full railway colony done"},
      {id:"C100",routeId:"R010",date:"2026-07-25",status:"covered",notes:"Temple town all points done"},
      {id:"C101",routeId:"R011",date:"2026-07-25",status:"covered",notes:"Tech park and cafeteria road done"},
      {id:"C102",routeId:"R012",date:"2026-07-25",status:"covered",notes:"All garden areas serviced"},
      {id:"C103",routeId:"R013",date:"2026-07-25",status:"covered",notes:"Lake view fully completed"},
      {id:"C104",routeId:"R014",date:"2026-07-25",status:"covered",notes:"Shopping complex all zones done"},
      {id:"C105",routeId:"R015",date:"2026-07-25",status:"partial",notes:"Clock tower area only, rest delayed"},
      {id:"C106",routeId:"R016",date:"2026-07-25",status:"covered",notes:"University research block done"},
      {id:"C107",routeId:"R017",date:"2026-07-25",status:"not_covered",notes:"Worker absent, industrial skipped"},
      {id:"C108",routeId:"R018",date:"2026-07-25",status:"covered",notes:"Suburban school zone and blocks done"},
      {id:"C109",routeId:"R019",date:"2026-07-20",status:"covered",notes:"Metro colony fully serviced"},
      {id:"C110",routeId:"R020",date:"2026-07-20",status:"covered",notes:"Green valley all points cleared"},
      {id:"C111",routeId:"R021",date:"2026-07-20",status:"not_covered",notes:"Worker absent, terminal skipped"},
      {id:"C112",routeId:"R022",date:"2026-07-20",status:"covered",notes:"Power station road cleared"},
      {id:"C113",routeId:"R023",date:"2026-07-20",status:"covered",notes:"Harbor and fish market done"},
      {id:"C114",routeId:"R024",date:"2026-07-20",status:"partial",notes:"Medical complex done, diagnostic center skipped"},
      {id:"C115",routeId:"R025",date:"2026-07-20",status:"covered",notes:"Artisan colony fully cleaned"},
      {id:"C116",routeId:"R026",date:"2026-07-20",status:"covered",notes:"Airport road all zones cleared"},
      {id:"C117",routeId:"R027",date:"2026-07-20",status:"covered",notes:"Civic center fully serviced"},
      {id:"C118",routeId:"R028",date:"2026-07-20",status:"covered",notes:"Riverfront promenade cleaned"},
      {id:"C119",routeId:"R029",date:"2026-07-20",status:"covered",notes:"Tech hub all areas done"},
      {id:"C120",routeId:"R030",date:"2026-07-20",status:"partial",notes:"Museum road done, gallery lane partial"},
      {id:"C121",routeId:"R019",date:"2026-07-21",status:"covered",notes:"All metro colony blocks done"},
      {id:"C122",routeId:"R020",date:"2026-07-21",status:"partial",notes:"Hill view area skipped due to rain"},
      {id:"C123",routeId:"R021",date:"2026-07-21",status:"covered",notes:"Bus terminal and auto stand done"},
      {id:"C124",routeId:"R022",date:"2026-07-21",status:"not_covered",notes:"Worker on leave, route skipped"},
      {id:"C125",routeId:"R023",date:"2026-07-21",status:"covered",notes:"Dock yard and harbor fully cleared"},
      {id:"C126",routeId:"R024",date:"2026-07-21",status:"covered",notes:"Full medical complex serviced"},
      {id:"C127",routeId:"R025",date:"2026-07-21",status:"covered",notes:"Craft village all lanes done"},
      {id:"C128",routeId:"R026",date:"2026-07-21",status:"covered",notes:"Airport approach and cargo done"},
      {id:"C129",routeId:"R027",date:"2026-07-21",status:"not_covered",notes:"Worker absent, civic center skipped"},
      {id:"C130",routeId:"R028",date:"2026-07-21",status:"covered",notes:"River bank all points done"},
      {id:"C131",routeId:"R029",date:"2026-07-21",status:"partial",notes:"Startup lane done, venture park skipped"},
      {id:"C132",routeId:"R030",date:"2026-07-21",status:"covered",notes:"Heritage zone fully serviced"},
      {id:"C133",routeId:"R019",date:"2026-07-22",status:"covered",notes:"Metro colony all points collected"},
      {id:"C134",routeId:"R020",date:"2026-07-22",status:"covered",notes:"Green valley full route done"},
      {id:"C135",routeId:"R021",date:"2026-07-22",status:"covered",notes:"Bus terminal cleaned before rush"},
      {id:"C136",routeId:"R022",date:"2026-07-22",status:"covered",notes:"Power station and grid layout done"},
      {id:"C137",routeId:"R023",date:"2026-07-22",status:"not_covered",notes:"Worker absent, harbor skipped"},
      {id:"C138",routeId:"R024",date:"2026-07-22",status:"covered",notes:"Medical complex fully cleaned"},
      {id:"C139",routeId:"R025",date:"2026-07-22",status:"covered",notes:"All artisan areas serviced"},
      {id:"C140",routeId:"R026",date:"2026-07-22",status:"covered",notes:"Airport road fully cleared"},
      {id:"C141",routeId:"R027",date:"2026-07-22",status:"covered",notes:"Court lane and post office done"},
      {id:"C142",routeId:"R028",date:"2026-07-22",status:"partial",notes:"Boat jetty skipped, rest done"},
      {id:"C143",routeId:"R029",date:"2026-07-22",status:"covered",notes:"Tech hub all areas covered"},
      {id:"C144",routeId:"R030",date:"2026-07-22",status:"covered",notes:"Heritage zone fully covered"},
      {id:"C145",routeId:"R019",date:"2026-07-23",status:"partial",notes:"West block skipped, east and park done"},
      {id:"C146",routeId:"R020",date:"2026-07-23",status:"covered",notes:"All green valley points done"},
      {id:"C147",routeId:"R021",date:"2026-07-23",status:"covered",notes:"Terminal and taxi bay cleared"},
      {id:"C148",routeId:"R022",date:"2026-07-23",status:"covered",notes:"Full power station route done"},
      {id:"C149",routeId:"R023",date:"2026-07-23",status:"covered",notes:"Harbor and ice plant lane done"},
      {id:"C150",routeId:"R024",date:"2026-07-23",status:"not_covered",notes:"Worker absent, medical zone skipped"},
      {id:"C151",routeId:"R025",date:"2026-07-23",status:"covered",notes:"Pottery street and weaving center done"},
      {id:"C152",routeId:"R026",date:"2026-07-23",status:"covered",notes:"Hangar area and radar colony done"},
      {id:"C153",routeId:"R027",date:"2026-07-23",status:"partial",notes:"Municipal office done, treasury partial"},
      {id:"C154",routeId:"R028",date:"2026-07-23",status:"covered",notes:"Riverfront and ghat steps done"},
      {id:"C155",routeId:"R029",date:"2026-07-23",status:"covered",notes:"Co-working street and incubator done"},
      {id:"C156",routeId:"R030",date:"2026-07-23",status:"covered",notes:"Gallery lane and statue circle done"},
      {id:"C157",routeId:"R019",date:"2026-07-24",status:"covered",notes:"Metro colony fully serviced"},
      {id:"C158",routeId:"R020",date:"2026-07-24",status:"not_covered",notes:"Worker absent, route skipped"},
      {id:"C159",routeId:"R021",date:"2026-07-24",status:"covered",notes:"Bus terminal all areas done"},
      {id:"C160",routeId:"R022",date:"2026-07-24",status:"partial",notes:"Staff quarters skipped, rest done"},
      {id:"C161",routeId:"R023",date:"2026-07-24",status:"covered",notes:"Full fishery area covered"},
      {id:"C162",routeId:"R024",date:"2026-07-24",status:"covered",notes:"Medical complex fully cleared"},
      {id:"C163",routeId:"R025",date:"2026-07-24",status:"covered",notes:"All craft village areas done"},
      {id:"C164",routeId:"R026",date:"2026-07-24",status:"covered",notes:"Airport approach road fully done"},
      {id:"C165",routeId:"R027",date:"2026-07-24",status:"covered",notes:"Civic center all buildings done"},
      {id:"C166",routeId:"R028",date:"2026-07-24",status:"covered",notes:"River bank and park done"},
      {id:"C167",routeId:"R029",date:"2026-07-24",status:"covered",notes:"Tech hub fully serviced"},
      {id:"C168",routeId:"R030",date:"2026-07-24",status:"not_covered",notes:"Worker absent, heritage zone skipped"},
      {id:"C169",routeId:"R019",date:"2026-07-25",status:"covered",notes:"All metro colony blocks done"},
      {id:"C170",routeId:"R020",date:"2026-07-25",status:"covered",notes:"Green valley full route completed"},
      {id:"C171",routeId:"R021",date:"2026-07-25",status:"covered",notes:"Bus terminal and refreshment done"},
      {id:"C172",routeId:"R022",date:"2026-07-25",status:"covered",notes:"Power station and transformer colony done"},
      {id:"C173",routeId:"R023",date:"2026-07-25",status:"partial",notes:"Dock yard partial, rest done"},
      {id:"C174",routeId:"R024",date:"2026-07-25",status:"covered",notes:"Full medical complex route done"},
      {id:"C175",routeId:"R025",date:"2026-07-25",status:"covered",notes:"Artisan colony and handloom lane done"},
      {id:"C176",routeId:"R026",date:"2026-07-25",status:"covered",notes:"Airport road all zones cleared"},
      {id:"C177",routeId:"R027",date:"2026-07-25",status:"covered",notes:"Civic center fully cleaned"},
      {id:"C178",routeId:"R028",date:"2026-07-25",status:"covered",notes:"Riverfront promenade all done"},
      {id:"C179",routeId:"R029",date:"2026-07-25",status:"covered",notes:"Startup lane and venture park done"},
      {id:"C180",routeId:"R030",date:"2026-07-25",status:"covered",notes:"Museum road and archaeological site done"},
    ],
  };
}

// ── API helpers (local) ────────────────────────────────────
function dbGetWorkers() { return getDB().workers; }
function dbGetRoutes() { return getDB().routes; }
function dbGetAttendance(date) {
  let recs = getDB().attendance;
  if (date) recs = recs.filter(a => a.date === date);
  const workers = getDB().workers;
  return recs.map(a => ({...a, worker: workers.find(w => w.id === a.workerId) || null}));
}
function dbGetCoverage(date) {
  let recs = getDB().routeCoverage;
  if (date) recs = recs.filter(c => c.date === date);
  const routes = getDB().routes;
  const workers = getDB().workers;
  return recs.map(c => {
    const route = routes.find(r => r.id === c.routeId) || null;
    const worker = route ? workers.find(w => w.id === route.assignedWorkerId) || null : null;
    return {...c, route, worker};
  });
}

function dbGetDashboard(date) {
  const db = getDB();
  const active = db.workers.filter(w => w.status === 'active');
  const att = db.attendance.filter(a => a.date === date);
  const cov = db.routeCoverage.filter(c => c.date === date);
  return {
    totalWorkers: active.length,
    attendance: {
      present: att.filter(a => a.status === 'present').length,
      absent: att.filter(a => a.status === 'absent').length,
      onLeave: att.filter(a => a.status === 'leave').length,
      total: att.length,
    },
    routeCoverage: {
      covered: cov.filter(c => c.status === 'covered').length,
      partial: cov.filter(c => c.status === 'partial').length,
      notCovered: cov.filter(c => c.status === 'not_covered').length,
      total: cov.length,
      totalRoutes: db.routes.length,
    },
  };
}

function dbGetHistory(from, to) {
  const db = getDB();
  const dates = [...new Set([...db.attendance.map(a=>a.date), ...db.routeCoverage.map(c=>c.date)])]
    .filter(d => (!from || d >= from) && (!to || d <= to)).sort().reverse();
  return dates.map(date => {
    const dayAtt = db.attendance.filter(a => a.date === date);
    const dayCov = db.routeCoverage.filter(c => c.date === date);
    return {
      date,
      attendance: { present: dayAtt.filter(a=>a.status==='present').length, absent: dayAtt.filter(a=>a.status==='absent').length, onLeave: dayAtt.filter(a=>a.status==='leave').length },
      coverage: { covered: dayCov.filter(c=>c.status==='covered').length, partial: dayCov.filter(c=>c.status==='partial').length, notCovered: dayCov.filter(c=>c.status==='not_covered').length },
    };
  });
}

function dbSaveWorker(id, data) {
  const db = getDB();
  if (id) { const i = db.workers.findIndex(w=>w.id===id); if(i>=0) Object.assign(db.workers[i], data); }
  else { data.id = nextId('workers'); db.workers.push(data); }
  saveDB(db);
}
function dbDeleteWorker(id) { const db=getDB(); db.workers=db.workers.filter(w=>w.id!==id); saveDB(db); }

function dbSaveAttendance(workerId, date, status) {
  const db = getDB();
  const ex = db.attendance.find(a=>a.workerId===workerId && a.date===date);
  if (ex) ex.status = status;
  else db.attendance.push({id: nextId('attendance'), workerId, date, status});
  saveDB(db);
}
function dbDeleteAttendance(id) { const db=getDB(); db.attendance=db.attendance.filter(a=>a.id!==id); saveDB(db); }

function dbSaveRoute(id, data) {
  const db = getDB();
  if (id) { const i = db.routes.findIndex(r=>r.id===id); if(i>=0) Object.assign(db.routes[i], data); }
  else { data.id = nextId('routes'); db.routes.push(data); }
  saveDB(db);
}
function dbDeleteRoute(id) { const db=getDB(); db.routes=db.routes.filter(r=>r.id!==id); saveDB(db); }

function dbSaveCoverage(routeId, date, status, notes) {
  const db = getDB();
  const ex = db.routeCoverage.find(c=>c.routeId===routeId && c.date===date);
  if (ex) { ex.status = status; ex.notes = notes; }
  else db.routeCoverage.push({id: nextId('routeCoverage'), routeId, date, status, notes});
  saveDB(db);
}
function dbDeleteCoverage(id) { const db=getDB(); db.routeCoverage=db.routeCoverage.filter(c=>c.id!==id); saveDB(db); }

// ═══════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════
function initTheme() {
  const t = localStorage.getItem('wt-theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  updateThemeIcon(t);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wt-theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  document.getElementById('themeIconSun').style.display = theme === 'dark' ? 'none' : 'block';
  document.getElementById('themeIconMoon').style.display = theme === 'dark' ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }

function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  const [title, sub] = PAGE_TITLES[page];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = sub;
  closeSidebar();
  renderPage();
}

function toast(msg, isError) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => { el.style.animation = 'toastOut .3s ease forwards'; }, 2700);
  setTimeout(() => el.remove(), 3000);
}

function openModal(title, bodyHTML, footerHTML, wide) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalFooter').innerHTML = footerHTML;
  document.getElementById('modalBox').style.maxWidth = wide || '500px';
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

const ICO = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>',
};

// ── Animated Number ────────────────────────────────────────
function animNum(el, target, dur) {
  dur = dur || 800;
  let start = parseInt(el.textContent) || 0;
  let diff = target - start;
  if (diff === 0) { el.textContent = target; return; }
  let t0 = performance.now();
  function tick(now) {
    let p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(start + diff * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Donut ──────────────────────────────────────────────────
function donutHTML(segments, number, label) {
  let size = 120, stroke = 10, r = (size-stroke)/2, circ = 2*Math.PI*r;
  let total = segments.reduce((s,x)=>s+x.value,0)||1, offset = 0;
  let circles = segments.map((seg,i) => {
    let pct = seg.value/total, dash = pct*circ, gap = circ-dash, o = offset;
    offset += pct;
    return `<circle cx="${size/2}" cy="${size/2}" r="${r}" class="donut-ring" stroke="${seg.color}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-o*circ}" stroke-linecap="round" style="transition:stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1) ${i*.15}s"/>`;
  }).join('');
  return `<div class="donut-wrapper"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">${circles}</svg><div class="donut-center"><span class="donut-number" data-count="${number}">0</span><span class="donut-label">${label}</span></div></div>`;
}

// ── Bar Chart ──────────────────────────────────────────────
function barChartHTML(data) {
  let max = Math.max(...data.map(d=>d.value),1);
  return `<div class="bar-chart">${data.map(d=>
    `<div class="bar-row"><span class="bar-label">${d.label}</span><div class="bar-track"><div class="bar-fill ${d.cls}" data-pct="${(d.value/max)*100}" style="width:0"></div></div><span class="bar-value">${d.value}</span></div>`
  ).join('')}</div>`;
}

function statCard(cls, icon, value, label, barCls, delay) {
  return `<div class="stat-card ${cls} animate-in" style="animation-delay:${delay*.1}s"><div class="stat-icon">${icon}</div><div class="stat-info"><span class="stat-number" data-count="${typeof value==='number'?value:''}">${value}</span><span class="stat-label">${label}</span></div><div class="stat-bar ${barCls}"></div></div>`;
}

// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════
function renderPage() {
  const date = document.getElementById('globalDate').value;
  const el = document.getElementById('pageContent');
  switch (currentPage) {
    case 'dashboard':  renderDashboard(el, date); break;
    case 'workers':    renderWorkers(el); break;
    case 'attendance': renderAttendance(el, date); break;
    case 'routes':     renderRoutes(el); break;
    case 'coverage':   renderCoverage(el, date); break;
    case 'history':    renderHistory(el); break;
  }
}

// ── Dashboard ──────────────────────────────────────────────
function renderDashboard(el, date) {
  const dash = dbGetDashboard(date);
  const attRecords = dbGetAttendance(date);
  const workers = dbGetWorkers();
  const a = dash.attendance, c = dash.routeCoverage;
  const attMap = {};
  attRecords.forEach(x => attMap[x.workerId] = x.status);

  el.innerHTML = `
    <div class="stats-grid">
      ${statCard('stat-present',ICO.check,a.present,'Present Today','bar-green',0)}
      ${statCard('stat-absent',ICO.x,a.absent,'Absent Today','bar-red',1)}
      ${statCard('stat-leave',ICO.alert,a.onLeave,'On Leave','bar-amber',2)}
      ${statCard('stat-routes',ICO.compass,c.covered+'/<span class="stat-total">'+c.totalRoutes+'</span>','Routes Covered','bar-teal',3)}
    </div>
    <div class="dashboard-grid">
      <div class="card animate-in animate-delay-1">
        <div class="card-header"><h2>Attendance Breakdown</h2><div class="chart-legend"><span class="legend-item"><span class="dot dot-green"></span>Present</span><span class="legend-item"><span class="dot dot-red"></span>Absent</span><span class="legend-item"><span class="dot dot-amber"></span>Leave</span></div></div>
        <div class="card-body"><div class="chart-area">
          ${barChartHTML([{label:'Present',value:a.present,cls:'bar-fill-green'},{label:'Absent',value:a.absent,cls:'bar-fill-red'},{label:'Leave',value:a.onLeave,cls:'bar-fill-amber'}])}
          ${donutHTML([{value:a.present,color:'#a855f7'},{value:a.absent,color:'#ef4444'},{value:a.onLeave,color:'#f59e0b'}],a.present,'present')}
        </div></div>
      </div>
      <div class="card animate-in animate-delay-2">
        <div class="card-header"><h2>Route Coverage</h2><div class="chart-legend"><span class="legend-item"><span class="dot dot-teal"></span>Covered</span><span class="legend-item"><span class="dot dot-amber"></span>Partial</span><span class="legend-item"><span class="dot dot-red"></span>Not Covered</span></div></div>
        <div class="card-body"><div class="chart-area">
          ${barChartHTML([{label:'Covered',value:c.covered,cls:'bar-fill-teal'},{label:'Partial',value:c.partial,cls:'bar-fill-amber'},{label:'Uncovered',value:c.notCovered,cls:'bar-fill-red'}])}
          ${donutHTML([{value:c.covered,color:'#a855f7'},{value:c.partial,color:'#f59e0b'},{value:c.notCovered,color:'#ef4444'}],c.covered,'covered')}
        </div></div>
      </div>
    </div>
    <div class="card animate-in animate-delay-3">
      <div class="card-header"><h2>Quick Status</h2></div>
      <div class="card-body"><div class="quick-status-grid">
        ${workers.filter(w=>w.status==='active').map((w,i)=>{
          let st=attMap[w.id]||'notmarked';
          let ini=w.name.split(' ').map(n=>n[0]).join('').slice(0,2);
          let colors={present:'#a855f7',absent:'#ef4444',leave:'#f59e0b',notmarked:'#94a3b8'};
          return `<div class="worker-status-pill" style="animation-delay:${i*.06}s"><div class="pill-avatar" style="background:${colors[st]}">${ini}</div><div class="pill-info"><span class="pill-name">${w.name}</span><span class="pill-route">${w.id}</span></div><span class="pill-badge badge-${st}">${st==='notmarked'?'Not Marked':st}</span></div>`;
        }).join('')}
      </div></div>
    </div>`;
  setTimeout(()=>{
    el.querySelectorAll('.bar-fill[data-pct]').forEach(b=>{b.style.width=b.dataset.pct+'%'});
    el.querySelectorAll('.donut-number[data-count]').forEach(n=>animNum(n,parseInt(n.dataset.count)));
  },100);
}

// ── Workers ────────────────────────────────────────────────
function renderWorkers(el) {
  const workers = dbGetWorkers();
  el.innerHTML = `
    <div class="page-actions animate-in"><button class="btn btn-primary" onclick="showWorkerModal()">${ICO.plus} Add Worker</button></div>
    <div class="card animate-in animate-delay-1"><div class="table-wrapper"><table class="data-table">
      <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${workers.map((w,i)=>`<tr style="animation-delay:${i*.04}s"><td><strong>${w.id}</strong></td><td>${w.name}</td><td>${w.phone}</td><td><span class="status-chip chip-${w.status}"><span class="chip-dot"></span>${w.status}</span></td><td><div class="action-btns"><button class="action-btn" title="Edit" onclick='showWorkerModal(${JSON.stringify(w).replace(/'/g,"&#39;")})'>${ICO.edit}</button><button class="action-btn delete" title="Delete" onclick="deleteWorker('${w.id}')">${ICO.del}</button></div></td></tr>`).join('')}
      </tbody></table></div></div>`;
}

function showWorkerModal(worker) {
  const isEdit=!!worker;
  openModal(isEdit?'Edit Worker':'Add Worker',
    `<div class="form-group"><label>Name</label><input class="form-input" id="wName" value="${worker?worker.name:''}" placeholder="Worker name"></div>
     <div class="form-group"><label>Phone</label><input class="form-input" id="wPhone" value="${worker?worker.phone:''}" placeholder="Phone number"></div>
     <div class="form-group"><label>Status</label><select class="form-select" id="wStatus"><option value="active" ${worker&&worker.status==='active'?'selected':''}>Active</option><option value="inactive" ${worker&&worker.status==='inactive'?'selected':''}>Inactive</option></select></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveWorker('${isEdit?worker.id:''}')">Save</button>`);
}

function saveWorker(id) {
  dbSaveWorker(id||null, {name:document.getElementById('wName').value, phone:document.getElementById('wPhone').value, status:document.getElementById('wStatus').value});
  closeModal(); toast('Worker saved'); renderPage();
}

function deleteWorker(id) {
  if(!confirm('Delete this worker?')) return;
  dbDeleteWorker(id); toast('Worker deleted'); renderPage();
}

// ── Attendance ─────────────────────────────────────────────
function renderAttendance(el, date) {
  const records = dbGetAttendance(date);
  el.innerHTML = `
    <div class="page-actions animate-in"><button class="btn btn-primary" onclick="showAttendanceModal('${date}')">${ICO.plus} Mark Attendance</button></div>
    <div class="card animate-in animate-delay-1"><div class="table-wrapper"><table class="data-table">
      <thead><tr><th>Worker</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${records.map((r,i)=>`<tr style="animation-delay:${i*.04}s"><td><strong>${r.worker?r.worker.name:r.workerId}</strong></td><td>${r.date}</td><td><span class="status-chip chip-${r.status}"><span class="chip-dot"></span>${r.status}</span></td><td><div class="action-btns"><button class="action-btn delete" onclick="deleteAttendance('${r.id}')">${ICO.del}</button></div></td></tr>`).join('')}
      </tbody></table></div></div>`;
}

function showAttendanceModal(date) {
  const workers = dbGetWorkers();
  openModal(`Mark Attendance — ${date}`,
    workers.map(w=>`<div class="att-row" data-wid="${w.id}" data-wname="${w.name}" data-status="present">
      <span style="flex:1;font-weight:600;font-size:.9rem;color:var(--text)">${w.name}</span>
      <button class="btn btn-sm btn-primary att-btn" onclick="pickAtt(this,'present')">present</button>
      <button class="btn btn-sm btn-ghost att-btn" onclick="pickAtt(this,'absent')">absent</button>
      <button class="btn btn-sm btn-ghost att-btn" onclick="pickAtt(this,'leave')">leave</button>
    </div>`).join(''),
    `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveAllAttendance('${date}')">Save All</button>`,
    '600px');
}

function pickAtt(btn, status) {
  const row = btn.closest('.att-row');
  row.dataset.status = status;
  row.querySelectorAll('.att-btn').forEach(b=>{b.classList.remove('btn-primary','active');b.classList.add('btn-ghost')});
  btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary','active');
}

function saveAllAttendance(date) {
  const rows = document.querySelectorAll('.att-row');
  const payloads = Array.from(rows).map(r => ({
    workerId: r.dataset.wid,
    workerName: r.dataset.wname,
    date,
    status: r.dataset.status
  }));
  const errors = [];
  let saved = 0;
  const sendNext = (i) => {
    if (i >= payloads.length) {
      closeModal();
      if (errors.length) {
        errors.forEach(e => toast(e, true));
      } else {
        toast('Attendance marked');
      }
      renderPage();
      return;
    }
    const p = payloads[i];
    fetch('/api/attendance', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(p)
    })
    .then(resp => resp.json().then(body => ({status: resp.status, body})))
    .then(({status, body}) => {
      if (status >= 400) {
        errors.push(body.error || 'Failed to save attendance');
      } else {
        dbSaveAttendance(p.workerId, date, p.status);
        saved++;
      }
      sendNext(i + 1);
    })
    .catch(() => {
      errors.push('Network error — could not reach server');
      sendNext(i + 1);
    });
  };
  sendNext(0);
}

function deleteAttendance(id) { dbDeleteAttendance(id); toast('Record deleted'); renderPage(); }

// ── Routes ─────────────────────────────────────────────────
function renderRoutes(el) {
  const routes = dbGetRoutes();
  const workers = dbGetWorkers();
  el.innerHTML = `
    <div class="page-actions animate-in"><button class="btn btn-primary" onclick="showRouteModal()">${ICO.plus} Add Route</button></div>
    <div class="card animate-in animate-delay-1"><div class="table-wrapper"><table class="data-table">
      <thead><tr><th>ID</th><th>Route Name</th><th>Assigned Worker</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>${routes.map((r,i)=>{
        const w = workers.find(x=>x.id===r.assignedWorkerId);
        return `<tr style="animation-delay:${i*.04}s"><td><strong>${r.id}</strong></td><td>${r.name}</td><td>${w?w.name:r.assignedWorkerId}</td><td style="max-width:250px">${r.description}</td><td><div class="action-btns"><button class="action-btn" onclick='showRouteModal(${JSON.stringify(r).replace(/'/g,"&#39;")})'>${ICO.edit}</button><button class="action-btn delete" onclick="deleteRoute('${r.id}')">${ICO.del}</button></div></td></tr>`;
      }).join('')}
      </tbody></table></div></div>`;
}

function showRouteModal(route) {
  const workers = dbGetWorkers();
  openModal(route?'Edit Route':'Add Route',
    `<div class="form-group"><label>Route Name</label><input class="form-input" id="rName" value="${route?route.name:''}" placeholder="e.g. Route F - Downtown"></div>
     <div class="form-group"><label>Assigned Worker</label><select class="form-select" id="rWorker"><option value="">Select worker</option>${workers.map(w=>`<option value="${w.id}" ${route&&route.assignedWorkerId===w.id?'selected':''}>${w.name} (${w.id})</option>`).join('')}</select></div>
     <div class="form-group"><label>Description</label><input class="form-input" id="rDesc" value="${route?route.description:''}" placeholder="Areas covered"></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveRoute('${route?route.id:''}')">Save</button>`);
}

function saveRoute(id) {
  dbSaveRoute(id||null, {name:document.getElementById('rName').value, assignedWorkerId:document.getElementById('rWorker').value, description:document.getElementById('rDesc').value});
  closeModal(); toast('Route saved'); renderPage();
}

function deleteRoute(id) { if(!confirm('Delete?'))return; dbDeleteRoute(id); toast('Route deleted'); renderPage(); }

// ── Coverage ───────────────────────────────────────────────
function renderCoverage(el, date) {
  const records = dbGetCoverage(date);
  el.innerHTML = `
    <div class="page-actions animate-in"><button class="btn btn-primary" onclick="showCoverageModal('${date}')">${ICO.plus} Update Coverage</button></div>
    <div class="card animate-in animate-delay-1"><div class="table-wrapper"><table class="data-table">
      <thead><tr><th>Route</th><th>Worker</th><th>Date</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
      <tbody>${records.map((r,i)=>`<tr style="animation-delay:${i*.04}s"><td><strong>${r.route?r.route.name:r.routeId}</strong></td><td>${r.worker?r.worker.name:'-'}</td><td>${r.date}</td><td><span class="status-chip chip-${r.status}"><span class="chip-dot"></span>${r.status.replace('_',' ')}</span></td><td style="max-width:200px;color:var(--text-muted)">${r.notes}</td><td><div class="action-btns"><button class="action-btn delete" onclick="deleteCoverage('${r.id}')">${ICO.del}</button></div></td></tr>`).join('')}
      </tbody></table></div></div>`;
}

function showCoverageModal(date) {
  const routes = dbGetRoutes();
  openModal('Update Coverage',
    `<div class="form-group"><label>Route</label><select class="form-select" id="cRoute"><option value="">Select route</option>${routes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}</select></div>
     <div class="form-group"><label>Status</label><select class="form-select" id="cStatus"><option value="covered">Covered</option><option value="partial">Partial</option><option value="not_covered">Not Covered</option></select></div>
     <div class="form-group"><label>Notes</label><input class="form-input" id="cNotes" placeholder="Any notes..."></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveCoverage('${date}')">Save</button>`);
}

function saveCoverage(date) {
  dbSaveCoverage(document.getElementById('cRoute').value, date, document.getElementById('cStatus').value, document.getElementById('cNotes').value);
  closeModal(); toast('Coverage updated'); renderPage();
}

function deleteCoverage(id) { dbDeleteCoverage(id); toast('Record deleted'); renderPage(); }

// ── History ────────────────────────────────────────────────
function renderHistory(el) {
  const from = document.getElementById('histFrom') ? document.getElementById('histFrom').value : (()=>{let d=new Date();d.setDate(d.getDate()-7);return d.toISOString().slice(0,10)})();
  const to = document.getElementById('histTo') ? document.getElementById('histTo').value : today();
  const data = dbGetHistory(from, to);

  el.innerHTML = `
    <div class="page-actions animate-in"><div class="date-range-picker">
      <label>From</label><input type="date" id="histFrom" value="${from}" onchange="renderHistory(document.getElementById('pageContent'))">
      <label>To</label><input type="date" id="histTo" value="${to}" onchange="renderHistory(document.getElementById('pageContent'))">
    </div></div>
    <div class="history-timeline">
      ${data.map((day,i)=>{
        let totalR=(day.coverage.covered+day.coverage.partial+day.coverage.notCovered)||1;
        let totalW=(day.attendance.present+day.attendance.absent+day.attendance.onLeave)||1;
        let nice=new Date(day.date+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
        return `<div class="history-day animate-in" style="animation-delay:${i*.08}s">
          <div class="history-day-header"><h3>${nice}</h3><span style="font-size:.8rem;color:var(--text-dim)">${day.attendance.present+day.attendance.absent+day.attendance.onLeave} workers</span></div>
          <div class="history-day-stats">
            <div class="history-stat"><span class="dot dot-green"></span><span class="history-stat-label">Present:</span><span class="history-stat-value">${day.attendance.present}</span></div>
            <div class="history-stat"><span class="dot dot-red"></span><span class="history-stat-label">Absent:</span><span class="history-stat-value">${day.attendance.absent}</span></div>
            <div class="history-stat"><span class="dot dot-amber"></span><span class="history-stat-label">Leave:</span><span class="history-stat-value">${day.attendance.onLeave}</span></div>
            <div style="width:1px;height:20px;background:var(--border)"></div>
            <div class="history-stat"><span class="dot dot-teal"></span><span class="history-stat-label">Routes Covered:</span><span class="history-stat-value">${day.coverage.covered}/${totalR}</span></div>
            <div class="history-stat"><span class="dot dot-amber"></span><span class="history-stat-label">Partial:</span><span class="history-stat-value">${day.coverage.partial}</span></div>
            <div class="history-stat"><span class="dot dot-red"></span><span class="history-stat-label">Uncovered:</span><span class="history-stat-value">${day.coverage.notCovered}</span></div>
          </div>
          <div style="padding:0 24px 16px"><div class="history-bar">
            <div class="history-bar-fill" style="width:${(day.attendance.present/totalW)*100}%;background:#a855f7"></div>
            <div class="history-bar-fill" style="width:${(day.attendance.absent/totalW)*100}%;background:#ef4444"></div>
            <div class="history-bar-fill" style="width:${(day.attendance.onLeave/totalW)*100}%;background:#f59e0b"></div>
          </div></div>
        </div>`;
      }).join('')}
      ${!data.length?'<div class="empty-state animate-in"><p>No history data in this range</p></div>':''}
    </div>`;
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('globalDate').value = today();
  document.getElementById('globalDate').addEventListener('change', renderPage);
  document.getElementById('sidebarNav').addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    e.preventDefault();
    switchPage(item.dataset.page);
  });
  renderPage();
});
