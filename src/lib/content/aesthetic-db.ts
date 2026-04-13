import type { ContentItem } from "@/lib/store";
import { getImageUrl } from "./image-urls";

export interface AestheticPerson {
  id: string;
  name: string;
  nameJa?: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  bio: string;
  categories: string[];
  imageUrl: string;
  notableWorks: string[];
  sourceUrl?: string;
}

export interface AestheticWork {
  id: string;
  title: string;
  creator: string;
  year: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  movement?: string;
  sourceUrl?: string;
}

export interface AestheticMovement {
  id: string;
  name: string;
  period: string;
  description: string;
  keyFigures: string[];
  characteristics: string[];
  imageUrl: string;
  sourceUrl?: string;
}

export interface AestheticEvent {
  id: string;
  name: string;
  year: string;
  location: string;
  description: string;
  significance: string;
  imageUrl: string;
  category: string;
  sourceUrl?: string;
}

const PEOPLE: AestheticPerson[] = [
  {
    id: "dieter-rams",
    name: "Dieter Rams",
    nationality: "German",
    birthYear: 1932,
    bio: "Industrial designer whose ten principles of good design became the foundation of modern product design. His work at Braun defined a generation of objects that proved restraint could be radical.",
    categories: ["industrial_design"],
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
    notableWorks: ["Braun SK4", "Braun T3", "606 Universal Shelving System", "Braun ET66"],
  },
  {
    id: "tadao-ando",
    name: "Tadao Ando",
    nationality: "Japanese",
    birthYear: 1941,
    bio: "Self-taught architect who transforms raw concrete into spaces of profound spiritual beauty. His buildings are meditations on light, water, and the relationship between nature and geometry.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600",
    notableWorks: ["Church of the Light", "Chichu Art Museum", "Row House in Sumiyoshi", "Water Temple"],
  },
  {
    id: "charlotte-perriand",
    name: "Charlotte Perriand",
    nationality: "French",
    birthYear: 1903,
    deathYear: 1999,
    bio: "Pioneer of modernist furniture whose work with Le Corbusier redefined how we inhabit domestic space. Her designs bridge European rationalism with Japanese sensitivity to natural materials.",
    categories: ["industrial_design", "interior_design"],
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    notableWorks: ["LC4 Chaise Longue", "Bibliothèque Nuage", "Tokyo Chaise"],
  },
  {
    id: "kenya-hara",
    name: "Kenya Hara",
    nationality: "Japanese",
    birthYear: 1958,
    bio: "Graphic designer and curator who redefined MUJI's visual identity. His philosophy of 'emptiness' celebrates the beauty of negative space and the potential of the unmarked.",
    categories: ["graphic_design", "book_design"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    notableWorks: ["MUJI Identity", "Designing Design", "White", "Ex-formation"],
  },
  {
    id: "carlo-scarpa",
    name: "Carlo Scarpa",
    nationality: "Italian",
    birthYear: 1906,
    deathYear: 1978,
    bio: "Architect and designer whose obsessive attention to material joints and transitions created spaces of extraordinary tactile richness. Every detail in his work tells a story of craft meeting idea.",
    categories: ["architecture", "interior_design"],
    imageUrl: "https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=600",
    notableWorks: ["Brion Cemetery", "Olivetti Showroom", "Castelvecchio Museum", "Querini Stampalia"],
  },
  {
    id: "lucie-rie",
    name: "Lucie Rie",
    nationality: "Austrian-British",
    birthYear: 1902,
    deathYear: 1995,
    bio: "Ceramicist whose thin-walled vessels achieved a tension between precision and organic beauty. Her glazes — volcanic, cratered, luminous — transformed pottery into sculpture.",
    categories: ["ceramics", "art"],
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
    notableWorks: ["Conical Bowl", "Squeezed Vases", "Knitted Vases"],
  },
  {
    id: "josef-muller-brockmann",
    name: "Josef Müller-Brockmann",
    nationality: "Swiss",
    birthYear: 1914,
    deathYear: 1996,
    bio: "Father of Swiss graphic design who proved that the grid is not a constraint but a liberation. His concert posters for Zurich Tonhalle remain the purest expression of visual music.",
    categories: ["graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    notableWorks: ["Musica Viva Posters", "Grid Systems in Graphic Design", "Zurich Tonhalle Posters"],
  },
  {
    id: "axel-vervoordt",
    name: "Axel Vervoordt",
    nationality: "Belgian",
    birthYear: 1947,
    bio: "Antiquarian and interior designer whose spaces achieve a timeless quality by layering centuries of objects. His philosophy of wabi-sabi merges Eastern imperfection with European grandeur.",
    categories: ["interior_design", "antiques"],
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600",
    notableWorks: ["Kanaal Complex", "Greenwich Hotel Penthouse", "Castello di Reschio"],
  },
  {
    id: "naoto-fukasawa",
    name: "Naoto Fukasawa",
    nationality: "Japanese",
    birthYear: 1956,
    bio: "Industrial designer whose concept of 'Without Thought' captures the beauty of objects so intuitive they dissolve into daily life. His MUJI wall-mounted CD player is an icon of unconscious design.",
    categories: ["industrial_design"],
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    notableWorks: ["MUJI CD Player", "MUJI Kitchen Appliances", "±0 Humidifier", "Infobar Phone"],
  },
  {
    id: "peter-zumthor",
    name: "Peter Zumthor",
    nationality: "Swiss",
    birthYear: 1943,
    bio: "Architect who designs with atmosphere. His buildings are sensory experiences — the sound of footsteps, the weight of a door handle, the way light falls on stone. Pritzker Prize laureate who builds slowly and rarely.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600",
    notableWorks: ["Therme Vals", "Bruder Klaus Chapel", "Kolumba Museum", "Zinc Mine Museum"],
  },
  {
    id: "shoji-hamada",
    name: "Shōji Hamada",
    nationality: "Japanese",
    birthYear: 1894,
    deathYear: 1978,
    bio: "Master potter and co-founder of the Mingei folk craft movement. His work celebrates the beauty of anonymous, functional objects made with deep craft knowledge.",
    categories: ["ceramics", "antiques"],
    imageUrl: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600",
    notableWorks: ["Mashiko Pottery", "Salt-glazed Plates", "Kaki Glaze Jars"],
  },
  {
    id: "bruno-munari",
    name: "Bruno Munari",
    nationality: "Italian",
    birthYear: 1907,
    deathYear: 1998,
    bio: "Artist, designer, and inventor who saw no boundary between play and design. His books, mobiles, and visual experiments taught generations that creativity begins with curiosity.",
    categories: ["graphic_design", "art", "book_design"],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    notableWorks: ["Useless Machines", "Design as Art", "Libri Illeggibili", "Falkland Lamp"],
  },
  {
    id: "irma-boom",
    name: "Irma Boom",
    nationality: "Dutch",
    birthYear: 1960,
    bio: "Book designer who treats the codex as a sculptural object. Her 2,136-page SHV Think Book is a monument to the belief that books are the ultimate design medium.",
    categories: ["book_design", "graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600",
    notableWorks: ["SHV Think Book", "Colour Based on Nature", "Chanel Catalogue"],
  },
  {
    id: "charles-ray-eames",
    name: "Charles & Ray Eames",
    nationality: "American",
    birthYear: 1907,
    deathYear: 1978,
    bio: "Design duo who believed in 'the best for the most for the least.' Their furniture, films, exhibitions, and toys created a democratic vision of modern design that remains unmatched.",
    categories: ["industrial_design", "architecture"],
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
    notableWorks: ["Eames Lounge Chair", "Powers of Ten", "Case Study House #8", "Eames House Bird"],
  },
  {
    id: "john-pawson",
    name: "John Pawson",
    nationality: "British",
    birthYear: 1949,
    bio: "Architect of radical minimalism whose spaces achieve serenity through rigorous reduction. Trained briefly in Japan, his work distills architecture to its essential experience of light, proportion, and material.",
    categories: ["architecture", "interior_design"],
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
    notableWorks: ["Novy Dvur Monastery", "Calvin Klein Flagship", "Design Museum London"],
    sourceUrl: "https://www.johnpawson.com/",
  },
  // ── Japan: Industrial Design ──
  {
    id: "uchida-shigeru",
    name: "Shigeru Uchida",
    nameJa: "内田繁",
    nationality: "Japanese",
    birthYear: 1943,
    deathYear: 2016,
    bio: "Interior and furniture designer who bridged Japanese spatial philosophy with postmodern expression. His 'September' chair and Bar Oblomov interiors achieved a theatrical minimalism — spaces that feel like inhabitable poetry.",
    categories: ["interior_design", "industrial_design"],
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
    notableWorks: ["September Chair", "Bar Oblomov", "Triennale di Milano installations", "Hotel Il Palazzo"],
    sourceUrl: "https://ja.wikipedia.org/wiki/%E5%86%85%E7%94%B0%E7%B9%81",
  },
  {
    id: "kenmochi-isamu",
    name: "Isamu Kenmochi",
    nameJa: "剣持勇",
    nationality: "Japanese",
    birthYear: 1912,
    deathYear: 1971,
    bio: "Father of modern Japanese furniture design. His rattan 'Round Chair' for Yamakawa Rattan married Japanese craft tradition with international modernism, proving that local materials could speak a global language.",
    categories: ["industrial_design"],
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    notableWorks: ["Round Chair (Rattan)", "Kashiwado Chair", "Hotel New Japan furniture"],
    sourceUrl: "https://ja.wikipedia.org/wiki/%E5%89%A3%E6%8C%81%E5%8B%87",
  },
  {
    id: "kuramata-shiro",
    name: "Shiro Kuramata",
    nameJa: "倉俣史朗",
    nationality: "Japanese",
    birthYear: 1934,
    deathYear: 1991,
    bio: "Visionary furniture designer whose work dissolved the boundary between design and art. His 'Miss Blanche' chair — acrylic resin embedded with paper roses — is one of the most poetic objects of the 20th century. Mentored by Ettore Sottsass.",
    categories: ["industrial_design", "interior_design"],
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    notableWorks: ["Miss Blanche Chair", "How High the Moon", "Glass Chair", "Issey Miyake boutiques"],
    sourceUrl: "https://en.wikipedia.org/wiki/Shiro_Kuramata",
  },
  {
    id: "yanagi-sori",
    name: "Sōri Yanagi",
    nameJa: "柳宗理",
    nationality: "Japanese",
    birthYear: 1915,
    deathYear: 2011,
    bio: "Industrial designer and son of Mingei founder Yanagi Sōetsu. His Butterfly Stool — two curved plywood shells joined by a brass rod — became the icon of Japanese modernism. He designed objects meant to be touched, not just seen.",
    categories: ["industrial_design"],
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
    notableWorks: ["Butterfly Stool", "Sōri Yanagi Kettle", "Elephant Stool", "Tokyo Olympic Torch (1964)"],
    sourceUrl: "https://en.wikipedia.org/wiki/S%C5%8Dri_Yanagi",
  },
  // ── Japan: Graphic Design ──
  {
    id: "hara-hiromu",
    name: "Hiromu Hara",
    nameJa: "原弘",
    nationality: "Japanese",
    birthYear: 1903,
    deathYear: 1986,
    bio: "Pioneer of modern Japanese graphic design and typography. As art director of Nippon magazine in the 1930s, he fused European modernist composition with Japanese visual culture, establishing the visual grammar for an entire generation.",
    categories: ["graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    notableWorks: ["Nippon magazine art direction", "Japanese postage stamps", "Tokyo Olympics 1964 posters"],
    sourceUrl: "https://ja.wikipedia.org/wiki/%E5%8E%9F%E5%BC%98",
  },
  {
    id: "awazu-kiyoshi",
    name: "Kiyoshi Awazu",
    nameJa: "粟津潔",
    nationality: "Japanese",
    birthYear: 1929,
    deathYear: 2009,
    bio: "Radical graphic designer whose explosive, layered collages merged Japanese folk imagery with psychedelic energy. His Expo '70 posters and environmental designs pushed graphic design into the realm of total experience.",
    categories: ["graphic_design", "art"],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    notableWorks: ["Expo '70 posters", "Hiroshima Appeals posters", "Knockin' on Heaven's Door"],
    sourceUrl: "https://en.wikipedia.org/wiki/Kiyoshi_Awazu",
  },
  {
    id: "tanaka-ikko",
    name: "Ikko Tanaka",
    nameJa: "田中一光",
    nationality: "Japanese",
    birthYear: 1930,
    deathYear: 2002,
    bio: "Master of synthesis who merged the precision of Swiss modernism with the elegance of Japanese aesthetics. His Nihon Buyo poster — a geometric geisha face — became one of the most recognized images in design history. Created MUJI's original identity.",
    categories: ["graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    notableWorks: ["Nihon Buyo poster", "MUJI original identity", "Hanae Mori identity", "Mazda identity"],
    sourceUrl: "https://en.wikipedia.org/wiki/Ikko_Tanaka",
  },
  {
    id: "nagai-kazumasa",
    name: "Kazumasa Nagai",
    nameJa: "永井一正",
    nationality: "Japanese",
    birthYear: 1929,
    bio: "Graphic designer known for his evolution from geometric abstraction to intricate animal illustrations. Co-founder of Nippon Design Center. His later work achieved an almost spiritual density — thousands of fine lines forming creatures of extraordinary delicacy.",
    categories: ["graphic_design", "art"],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    notableWorks: ["LIFE poster series", "Asahi Breweries identity", "Animal illustration series", "Nippon Design Center"],
    sourceUrl: "https://en.wikipedia.org/wiki/Kazumasa_Nagai",
  },
  {
    id: "yokoo-tadanori",
    name: "Tadanori Yokoo",
    nameJa: "横尾忠則",
    nationality: "Japanese",
    birthYear: 1936,
    bio: "Graphic designer turned painter whose psychedelic, pop-infused posters exploded Japanese visual culture in the 1960s. His work collides traditional ukiyo-e with Western pop art, death imagery with eroticism, high art with kitsch — always startling, never boring.",
    categories: ["graphic_design", "art"],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    notableWorks: ["A La Maison de M. Civeçawa", "Koshimaki-Osen poster", "The City and Design exhibition", "Tadanori Yokoo Museum of Contemporary Art"],
    sourceUrl: "https://en.wikipedia.org/wiki/Tadanori_Yokoo",
  },
  // ── Japan: Book Design ──
  {
    id: "sugiura-kohei",
    name: "Kohei Sugiura",
    nameJa: "杉浦康平",
    nationality: "Japanese",
    birthYear: 1932,
    bio: "Book designer and typographer whose work transformed the Japanese book into a cosmological object. His designs for academic and cultural publications layered text, image, and space into mandalic compositions that must be experienced physically.",
    categories: ["book_design", "graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600",
    notableWorks: ["Ginga no Michi book design", "Asian cosmology book series", "Yū magazine", "Shūeisha book covers"],
    sourceUrl: "https://en.wikipedia.org/wiki/Kohei_Sugiura",
  },
  {
    id: "kikuchi-nobuyoshi",
    name: "Nobuyoshi Kikuchi",
    nameJa: "菊地信義",
    nationality: "Japanese",
    birthYear: 1943,
    deathYear: 2022,
    bio: "Japan's most celebrated book jacket designer who treated covers as autonomous art. Over a career spanning 50 years, he designed more than 10,000 book covers. His approach — treating each book's surface as a meditation on its inner life — elevated commercial publishing to visual art.",
    categories: ["book_design", "graphic_design"],
    imageUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600",
    notableWorks: ["10,000+ book jacket designs", "Shinchōsha covers", "Kōdansha covers"],
    sourceUrl: "https://ja.wikipedia.org/wiki/%E8%8F%8A%E5%9C%B0%E4%BF%A1%E7%BE%A9",
  },
  // ── Japan: Architecture ──
  {
    id: "kenzo-tange",
    name: "Kenzo Tange",
    nameJa: "丹下健三",
    nationality: "Japanese",
    birthYear: 1913,
    deathYear: 2005,
    bio: "Architect who channeled Japanese tradition into monumental modernism. His Yoyogi National Gymnasium for the 1964 Olympics — a suspended roof evoking a samurai helmet — declared that Japan could lead the world in structural ambition. Pritzker Prize 1987.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600",
    notableWorks: ["Yoyogi National Gymnasium", "Hiroshima Peace Memorial Museum", "Expo '70 Festival Plaza", "Tokyo Metropolitan Government Building"],
    sourceUrl: "https://en.wikipedia.org/wiki/Kenzo_Tange",
  },
  {
    id: "isozaki-arata",
    name: "Arata Isozaki",
    nameJa: "磯崎新",
    nationality: "Japanese",
    birthYear: 1931,
    deathYear: 2022,
    bio: "Postmodernist architect and theorist who oscillated between irony and grandeur for six decades. From the brutalist Ōita Prefectural Library to the cosmic Palau Sant Jordi in Barcelona. Pritzker Prize 2019.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    notableWorks: ["Ōita Prefectural Library", "Museum of Contemporary Art Los Angeles", "Palau Sant Jordi", "Kitakyushu Central Library"],
    sourceUrl: "https://en.wikipedia.org/wiki/Arata_Isozaki",
  },
  {
    id: "ando-azuma",
    name: "Toyo Ito",
    nameJa: "伊東豊雄",
    nationality: "Japanese",
    birthYear: 1941,
    bio: "Architect of lightness and flow. His Sendai Mediatheque — a transparent cube threaded with organic steel tubes — redefined what a public building could feel like. Pritzker Prize 2013.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",
    notableWorks: ["Sendai Mediatheque", "Tod's Omotesando", "Tama Art University Library", "Silver Hut"],
    sourceUrl: "https://en.wikipedia.org/wiki/Toyo_Ito",
  },
  {
    id: "sanaa",
    name: "SANAA (Sejima + Nishizawa)",
    nationality: "Japanese",
    birthYear: 1956,
    bio: "Architecture duo Kazuyo Sejima and Ryue Nishizawa create buildings of radical transparency. Their 21st Century Museum in Kanazawa — a perfect glass circle — dissolved the boundary between museum and city. Pritzker Prize 2010.",
    categories: ["architecture"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    notableWorks: ["21st Century Museum Kanazawa", "New Museum New York", "Louvre-Lens", "Rolex Learning Center"],
    sourceUrl: "https://en.wikipedia.org/wiki/SANAA",
  },
];

const WORKS: AestheticWork[] = [
  {
    id: "braun-sk4",
    title: "Braun SK4 Record Player",
    creator: "Dieter Rams",
    year: "1956",
    description: "Known as 'Snow White's Coffin,' this record player stripped audio equipment of decoration and revealed the beauty of pure function. Its transparent lid was revolutionary.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600",
    tags: ["braun", "minimalism", "product design", "modernism"],
    movement: "Functionalism",
  },
  {
    id: "church-of-the-light",
    title: "Church of the Light",
    creator: "Tadao Ando",
    year: "1989",
    description: "A cruciform slit in raw concrete admits a blade of light that creates a cross without ornament. Perhaps the most powerful demonstration that architecture can be spiritual through restraint alone.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    tags: ["concrete", "light", "sacred", "minimalism", "japanese"],
    movement: "Critical Regionalism",
  },
  {
    id: "therme-vals",
    title: "Therme Vals",
    creator: "Peter Zumthor",
    year: "1996",
    description: "A thermal bath carved into a Swiss mountainside from local Valser quartzite. Every surface, every temperature change, every acoustic quality was designed to create an architecture of the senses.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    tags: ["stone", "water", "atmosphere", "sensory", "swiss"],
    movement: "Phenomenological Architecture",
  },
  {
    id: "606-shelving",
    title: "606 Universal Shelving System",
    creator: "Dieter Rams",
    year: "1960",
    description: "A wall-mounted modular system that has been in continuous production for over 60 years. Its genius lies in what it doesn't do — it simply holds your things and disappears.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600",
    tags: ["modular", "system", "vitsoe", "timeless"],
    movement: "Functionalism",
  },
  {
    id: "muji-cd-player",
    title: "MUJI Wall-Mounted CD Player",
    creator: "Naoto Fukasawa",
    year: "1999",
    description: "Pull the cord and music begins — like an exhaust fan for the soul. This object embodies Fukasawa's 'without thought' design philosophy, where the interaction is so natural it feels inevitable.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    tags: ["muji", "intuitive", "japanese", "minimal"],
    movement: "Super Normal",
  },
  {
    id: "eames-lounge",
    title: "Eames Lounge Chair",
    creator: "Charles & Ray Eames",
    year: "1956",
    description: "Conceived as a modern update to the English club chair, it achieves warmth through molded plywood and leather. Seven decades later, it remains the definition of democratic luxury.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
    tags: ["furniture", "plywood", "modern", "iconic"],
    movement: "Mid-Century Modern",
  },
  {
    id: "brion-cemetery",
    title: "Brion Cemetery",
    creator: "Carlo Scarpa",
    year: "1978",
    description: "A meditation on death, memory, and the passage of time expressed through interlocking concrete forms, water channels, and obsessively detailed joints. Scarpa's masterwork.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    tags: ["concrete", "water", "memorial", "detail", "craft"],
  },
  {
    id: "musica-viva-poster",
    title: "Musica Viva Concert Posters",
    creator: "Josef Müller-Brockmann",
    year: "1950s-60s",
    description: "Pure geometry as visual music. These posters proved that mathematical precision and emotional expression are not opposites but partners.",
    category: "graphic_design",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    tags: ["swiss", "grid", "typography", "poster", "geometric"],
    movement: "Swiss International Style",
  },
  {
    id: "shv-think-book",
    title: "SHV Think Book",
    creator: "Irma Boom",
    year: "1996",
    description: "2,136 pages without page numbers. A physical encyclopedia of a company's 100-year history that transforms the book into a landscape you explore by weight, color, and texture.",
    category: "book_design",
    imageUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600",
    tags: ["book", "monumental", "experimental", "dutch"],
  },
  {
    id: "falkland-lamp",
    title: "Falkland Lamp",
    creator: "Bruno Munari",
    year: "1964",
    description: "A tubular knit structure that collapses flat when unlit and unfurls into a glowing totem when illuminated. Gravity becomes the co-designer.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    tags: ["lamp", "textile", "playful", "gravity", "italian"],
    movement: "Italian Radical Design",
  },
  // ── Japanese Works ──
  {
    id: "miss-blanche",
    title: "Miss Blanche Chair",
    creator: "Shiro Kuramata",
    year: "1988",
    description: "Paper roses suspended in transparent acrylic resin, named after Blanche DuBois. Perhaps the most poetic chair ever made — a frozen garden you can sit in. Only 56 were produced.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    tags: ["acrylic", "poetry", "limited edition", "japanese", "postmodern"],
    sourceUrl: "https://en.wikipedia.org/wiki/Shiro_Kuramata#Miss_Blanche",
  },
  {
    id: "how-high-the-moon",
    title: "How High the Moon",
    creator: "Shiro Kuramata",
    year: "1986",
    description: "An armchair made entirely of nickel-plated steel mesh — solid yet transparent, heavy yet weightless. Kuramata transformed industrial material into something that looks like frozen moonlight.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    tags: ["steel mesh", "transparency", "japanese", "postmodern"],
    sourceUrl: "https://www.vitra.com/en-us/product/how-high-the-moon",
  },
  {
    id: "butterfly-stool",
    title: "Butterfly Stool",
    creator: "Sōri Yanagi",
    year: "1954",
    description: "Two identical plywood shells curved and joined by a single brass stretcher. This stool captures the essence of Japanese origami in bent wood — an icon reproduced for 70 years by Tendo Mokko.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
    tags: ["plywood", "origami", "tendo mokko", "japanese", "modernism"],
    movement: "Japanese Modernism",
    sourceUrl: "https://en.wikipedia.org/wiki/Butterfly_stool",
  },
  {
    id: "september-chair",
    title: "September Chair",
    creator: "Shigeru Uchida",
    year: "1977",
    description: "A chair of radical geometric reduction — its seat appears to float, suspended between two austere steel frames. Uchida stripped seating to its philosophical essence.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
    tags: ["geometric", "philosophical", "japanese", "minimal"],
  },
  {
    id: "round-chair-rattan",
    title: "Round Chair (Rattan)",
    creator: "Isamu Kenmochi",
    year: "1960",
    description: "A circular rattan chair that brought Japanese craft into the international design conversation. Kenmochi proved that local craft traditions could produce objects of universal beauty.",
    category: "industrial_design",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    tags: ["rattan", "craft", "japanese", "modernism"],
    movement: "Japanese Modernism",
    sourceUrl: "https://ja.wikipedia.org/wiki/%E5%89%A3%E6%8C%81%E5%8B%87",
  },
  {
    id: "nihon-buyo-poster",
    title: "Nihon Buyo Poster",
    creator: "Ikko Tanaka",
    year: "1981",
    description: "A geisha face reduced to pure geometric shapes — circles, triangles, rectangles in red, black, and white. This poster became one of the most recognized images in graphic design, proving that extreme abstraction can carry deep cultural weight.",
    category: "graphic_design",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    tags: ["poster", "geometric", "japanese", "geisha", "abstraction"],
    movement: "Japanese Graphic Design",
    sourceUrl: "https://www.moma.org/collection/works/8058",
  },
  {
    id: "yoyogi-gymnasium",
    title: "Yoyogi National Gymnasium",
    creator: "Kenzo Tange",
    year: "1964",
    description: "Built for the Tokyo Olympics, this suspended roof structure channels the energy of a samurai helmet through modernist engineering. The sweeping tensile curves created Asia's most dramatic sports architecture.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600",
    tags: ["olympics", "tensile", "japanese", "monumental", "structural"],
    movement: "Metabolist Architecture",
    sourceUrl: "https://en.wikipedia.org/wiki/Yoyogi_National_Gymnasium",
  },
  {
    id: "sendai-mediatheque",
    title: "Sendai Mediatheque",
    creator: "Toyo Ito",
    year: "2001",
    description: "A transparent seven-story cube where floors float on organic steel tube columns like seaweed in water. Ito dissolved the rigidity of architecture into something almost biological.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",
    tags: ["transparency", "organic", "japanese", "public", "structure"],
    sourceUrl: "https://en.wikipedia.org/wiki/Sendai_Mediatheque",
  },
  {
    id: "21c-museum-kanazawa",
    title: "21st Century Museum of Contemporary Art",
    creator: "SANAA (Sejima + Nishizawa)",
    year: "2004",
    description: "A perfect glass circle with no front or back, inviting entry from any direction. SANAA erased the hierarchy between museum and city — you can see through the entire building from the street.",
    category: "architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    tags: ["glass", "circle", "transparency", "japanese", "museum"],
    sourceUrl: "https://en.wikipedia.org/wiki/21st_Century_Museum_of_Contemporary_Art,_Kanazawa",
  },
];

const MOVEMENTS: AestheticMovement[] = [
  {
    id: "bauhaus",
    name: "Bauhaus",
    period: "1919-1933",
    description: "The school that fused art, craft, and technology into a unified vision. From Weimar to Dessau to its forced closure by the Nazis, Bauhaus gave the modern world its visual language.",
    keyFigures: ["Walter Gropius", "Mies van der Rohe", "László Moholy-Nagy", "Marcel Breuer"],
    characteristics: ["Geometric forms", "Primary colors", "Form follows function", "Unity of art and craft"],
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
  },
  {
    id: "mingei",
    name: "Mingei (民藝)",
    period: "1920s-present",
    description: "The Japanese folk craft movement founded by Yanagi Sōetsu that discovered beauty in humble, everyday objects made by anonymous craftspeople. A philosophy that celebrates use over display.",
    keyFigures: ["Yanagi Sōetsu", "Shōji Hamada", "Kanjirō Kawai", "Bernard Leach"],
    characteristics: ["Beauty in utility", "Anonymous craftsmanship", "Natural materials", "Regional traditions"],
    imageUrl: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600",
  },
  {
    id: "swiss-style",
    name: "Swiss International Style",
    period: "1950s-1970s",
    description: "Born in Basel and Zurich, this movement made typography a science and the grid a religion. Its clarity and objectivity shaped corporate identity worldwide.",
    keyFigures: ["Josef Müller-Brockmann", "Armin Hofmann", "Emil Ruder", "Adrian Frutiger"],
    characteristics: ["Grid systems", "Sans-serif typography", "Objective photography", "Mathematical composition"],
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
  },
  {
    id: "wabi-sabi",
    name: "Wabi-Sabi (侘寂)",
    period: "15th century-present",
    description: "The Japanese aesthetic philosophy centered on transience, imperfection, and incompleteness. Wabi-sabi finds beauty in the weathered, the irregular, and the modest.",
    keyFigures: ["Sen no Rikyū", "Yanagi Sōetsu", "Leonard Koren"],
    characteristics: ["Imperfection", "Impermanence", "Incompleteness", "Natural patina"],
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
  },
  {
    id: "mid-century-modern",
    name: "Mid-Century Modern",
    period: "1945-1969",
    description: "Post-war optimism expressed through organic forms, new materials, and the democratic ideal that good design should be available to everyone.",
    keyFigures: ["Charles & Ray Eames", "George Nelson", "Eero Saarinen", "Arne Jacobsen"],
    characteristics: ["Organic forms", "New materials", "Indoor-outdoor connection", "Democratic design"],
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
  },
];

const EVENTS: AestheticEvent[] = [
  {
    id: "expo-70",
    name: "Expo '70 Osaka",
    year: "1970",
    location: "Osaka, Japan",
    description: "The first World's Fair in Asia, where Japan announced itself as a creative superpower. Kenzo Tange's Festival Plaza, Isamu Noguchi's fountains, and futuristic pavilions imagined a world of techno-utopian beauty.",
    significance: "Marked Japan's emergence as a global design force and showcased metabolist architecture to the world.",
    imageUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600",
    category: "architecture",
  },
  {
    id: "milan-salone",
    name: "Salone del Mobile",
    year: "1961-present",
    location: "Milan, Italy",
    description: "The world's largest and most influential furniture and design fair. Every April, Milan becomes the capital of the design world, where the line between art and industry dissolves.",
    significance: "The primary global stage for launching new furniture, lighting, and interior design each year.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    category: "industrial_design",
  },
  {
    id: "bauhaus-founding",
    name: "Founding of the Bauhaus",
    year: "1919",
    location: "Weimar, Germany",
    description: "Walter Gropius opened a school that would change the visual language of the 20th century. The Bauhaus merged fine art, craft, and technology into a unified creative education.",
    significance: "Created the template for modern design education and established principles that still guide design today.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    category: "all",
  },
];

function textMatchScore(text: string, query: string): number {
  const lower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  let score = 0;
  if (lower.includes(queryLower)) score += 10;
  for (const word of words) {
    if (word.length < 2) continue;
    if (lower.includes(word)) score += 3;
  }
  return score;
}

// Additional media-type content
const EXTRA_CONTENT: ContentItem[] = [
  {
    id: "powers-of-ten",
    title: "Powers of Ten",
    description: "A nine-minute film that travels from a picnic blanket to the edge of the universe and back into a carbon atom. Charles and Ray Eames made the most elegant science film ever created.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
    category: "art",
    creator: "Charles & Ray Eames",
    creatorId: "charles-ray-eames",
    year: "1977",
    tags: ["film", "science", "scale", "modernism"],
    mediaType: "video",
    sourceUrl: "https://www.eamesoffice.com/the-work/powers-of-ten/",
    videoUrl: "https://www.youtube.com/watch?v=0fKBhvDjuy0",
    relatedIds: ["charles-ray-eames", "eames-lounge"],
  },
  {
    id: "designing-design",
    title: "Designing Design",
    description: "Kenya Hara's seminal book argues that design is not about making things beautiful, but about making the world comprehensible. A meditation on emptiness, communication, and the future of design.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
    category: "book_design",
    creator: "Kenya Hara",
    creatorId: "kenya-hara",
    year: "2007",
    tags: ["book", "philosophy", "emptiness", "japanese", "muji"],
    mediaType: "text",
    sourceUrl: "https://www.lars-mueller-publishers.com/designing-design",
    textContent: "\"In the midst of all this excess, what we seek is not more stimulation but a quiet sense of the lucid. Emptiness is not mere nothing. It is a condition of fullness that includes everything.\" — Kenya Hara",
    relatedIds: ["kenya-hara", "muji-cd-player", "mingei"],
  },
  {
    id: "ryuichi-sakamoto-async",
    title: "async",
    description: "Ryuichi Sakamoto's late masterpiece, composed while recovering from throat cancer. Field recordings, piano, and electronics dissolve into a meditation on time, decay, and the beauty of imperfect sounds.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600",
    category: "art",
    creator: "Ryuichi Sakamoto",
    year: "2017",
    tags: ["music", "ambient", "japanese", "wabi-sabi", "minimalism"],
    mediaType: "music",
    sourceUrl: "https://open.spotify.com/album/6ZHEfFGzknKSERFhVBhkmm",
    musicUrl: "https://open.spotify.com/album/6ZHEfFGzknKSERFhVBhkmm",
    relatedIds: ["wabi-sabi", "tadao-ando"],
  },
  {
    id: "kenzo-tange-expo70-film",
    title: "Expo '70 — Festival Plaza",
    description: "Kenzo Tange's enormous space-frame roof floating over the Festival Plaza at Osaka Expo '70 — a vision of metabolist architecture at its most ambitious, sheltering a nation's dreams of the future.",
    imageUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600",
    category: "architecture",
    creator: "Kenzo Tange",
    year: "1970",
    tags: ["expo", "metabolist", "japanese", "futurism", "structure"],
    mediaType: "video",
    sourceUrl: "https://en.wikipedia.org/wiki/Expo_%2770",
    videoUrl: "https://www.youtube.com/watch?v=example",
    relatedIds: ["expo-70", "tadao-ando"],
  },
  {
    id: "in-praise-of-shadows",
    title: "In Praise of Shadows",
    description: "Jun'ichirō Tanizaki's 1933 essay on Japanese aesthetics argues that beauty lives in shadow, patina, and ambiguity — not in the harsh clarity of electric light. Essential reading for anyone who cares about atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
    category: "book_design",
    creator: "Jun'ichirō Tanizaki",
    year: "1933",
    tags: ["essay", "japanese", "shadow", "atmosphere", "philosophy"],
    mediaType: "text",
    sourceUrl: "https://www.penguin.co.uk/books/57854/in-praise-of-shadows-by-tanizaki-junichiro/",
    textContent: "\"We find beauty not in the thing itself but in the patterns of shadows, the light and the darkness, that one thing against another creates.\" — Jun'ichirō Tanizaki",
    relatedIds: ["wabi-sabi", "peter-zumthor", "axel-vervoordt"],
  },
  {
    id: "erik-satie-gymnopedies",
    title: "Gymnopédies",
    description: "Three slow piano pieces from 1888 that invented ambient music a century before the term existed. Satie stripped piano composition to its emotional essence — each note suspended in space like a mobile.",
    imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600",
    category: "art",
    creator: "Erik Satie",
    year: "1888",
    tags: ["music", "piano", "minimal", "ambient", "french"],
    mediaType: "music",
    sourceUrl: "https://open.spotify.com/album/1emGTdKLPerXpihJMASwfn",
    musicUrl: "https://open.spotify.com/album/1emGTdKLPerXpihJMASwfn",
    relatedIds: ["john-pawson", "bauhaus"],
  },
];

function personToContentItem(person: AestheticPerson): ContentItem {
  const relatedWorkIds = WORKS
    .filter((w) => w.creator === person.name)
    .map((w) => w.id);

  return {
    id: person.id,
    title: person.nameJa ? `${person.name} ${person.nameJa}` : person.name,
    description: person.bio,
    imageUrl: getImageUrl(person.id) || person.imageUrl,
    category: person.categories[0],
    creator: person.nationality,
    year: `b. ${person.birthYear}${person.deathYear ? ` — d. ${person.deathYear}` : ""}`,
    tags: person.categories,
    mediaType: "image",
    sourceUrl: person.sourceUrl || `https://en.wikipedia.org/wiki/${person.name.replace(/ /g, "_")}`,
    relatedIds: relatedWorkIds,
  };
}

function workToContentItem(work: AestheticWork): ContentItem {
  const creatorPerson = PEOPLE.find((p) => p.name === work.creator);
  const sameCreatorWorks = WORKS
    .filter((w) => w.creator === work.creator && w.id !== work.id)
    .map((w) => w.id);
  const movementId = MOVEMENTS.find((m) => m.name === work.movement)?.id;

  return {
    id: work.id,
    title: work.title,
    description: work.description,
    imageUrl: getImageUrl(work.id) || work.imageUrl,
    category: work.category,
    creator: work.creator,
    creatorId: creatorPerson?.id,
    year: work.year,
    tags: work.tags,
    mediaType: "image",
    sourceUrl: work.sourceUrl || `https://en.wikipedia.org/wiki/${work.title.replace(/ /g, "_")}`,
    relatedIds: [
      ...(creatorPerson ? [creatorPerson.id] : []),
      ...sameCreatorWorks,
      ...(movementId ? [movementId] : []),
    ],
  };
}

function movementToContentItem(movement: AestheticMovement): ContentItem {
  const relatedPeople = PEOPLE
    .filter((p) =>
      movement.keyFigures.some((kf) => p.name.includes(kf.split(" ").pop()!))
    )
    .map((p) => p.id);

  return {
    id: movement.id,
    title: movement.name,
    description: movement.description,
    imageUrl: getImageUrl(movement.id) || movement.imageUrl,
    category: "movement",
    year: movement.period,
    tags: movement.characteristics,
    mediaType: "image",
    sourceUrl: `https://en.wikipedia.org/wiki/${movement.name.replace(/ /g, "_")}`,
    relatedIds: relatedPeople,
  };
}

function eventToContentItem(event: AestheticEvent): ContentItem {
  return {
    id: event.id,
    title: event.name,
    description: event.description,
    imageUrl: getImageUrl(event.id) || event.imageUrl,
    category: event.category,
    year: event.year,
    tags: [event.location],
    mediaType: "image",
    sourceUrl: `https://en.wikipedia.org/wiki/${event.name.replace(/ /g, "_")}`,
    relatedIds: [],
  };
}

export async function searchAestheticContent(
  query: string,
  category?: string
): Promise<ContentItem[]> {
  const all = getAllContent();
  const scored: { item: ContentItem; score: number }[] = [];

  for (const item of all) {
    if (category && category !== "all" && item.category !== category && !item.tags.includes(category)) continue;

    const score =
      textMatchScore(item.title, query) * 3 +
      textMatchScore(item.description, query) +
      textMatchScore(item.creator || "", query) * 2 +
      textMatchScore(item.tags.join(" "), query) * 2 +
      textMatchScore(item.category, query);

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return all.slice(0, 8);
  }

  return scored.slice(0, 12).map((s) => s.item);
}

export function getAllContent(): ContentItem[] {
  // Lazy-load bookmark sources to avoid circular deps
  const { BOOKMARK_SOURCES } = require("./bookmark-sources");
  return [
    ...PEOPLE.map(personToContentItem),
    ...WORKS.map(workToContentItem),
    ...MOVEMENTS.map(movementToContentItem),
    ...EVENTS.map(eventToContentItem),
    ...EXTRA_CONTENT,
    ...BOOKMARK_SOURCES,
  ];
}

export function getContentByCategory(category: string): ContentItem[] {
  return getAllContent().filter(
    (item) => item.category === category || item.tags.includes(category)
  );
}

export function getContentById(id: string): ContentItem | undefined {
  return getAllContent().find((item) => item.id === id);
}

export function getRelatedItems(item: ContentItem, limit = 6): ContentItem[] {
  const all = getAllContent();

  if (item.relatedIds && item.relatedIds.length > 0) {
    const related = item.relatedIds
      .map((rid) => all.find((c) => c.id === rid))
      .filter((c): c is ContentItem => c !== undefined);

    if (related.length >= limit) return related.slice(0, limit);

    const remaining = all
      .filter((c) => c.id !== item.id && !item.relatedIds!.includes(c.id))
      .filter((c) =>
        c.category === item.category ||
        c.tags.some((t) => item.tags.includes(t))
      )
      .slice(0, limit - related.length);

    return [...related, ...remaining];
  }

  return all
    .filter((c) => c.id !== item.id)
    .filter((c) =>
      c.category === item.category ||
      c.tags.some((t) => item.tags.includes(t)) ||
      c.creator === item.creator
    )
    .slice(0, limit);
}

export function getContentByTag(tag: string): ContentItem[] {
  return getAllContent().filter(
    (item) =>
      item.tags.includes(tag) ||
      item.category === tag ||
      item.creator?.toLowerCase().includes(tag.toLowerCase())
  );
}

export { PEOPLE, WORKS, MOVEMENTS, EVENTS };
