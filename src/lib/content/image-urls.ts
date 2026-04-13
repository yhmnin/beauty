/**
 * Real image URLs sourced from authoritative design archives.
 *
 * Source priority (matching Cosmos.so approach):
 *   1. Official designer/studio website or archive
 *   2. Museum collection pages (MoMA, V&A, Vitra, MAU)
 *   3. Wikimedia Commons (CC-licensed)
 *   4. Institution galleries (Pritzker, AGI)
 *
 * Each entry: { url, source, credit }
 */

interface ImageEntry {
  url: string;
  source: string;
  credit: string;
}

const IMAGES: Record<string, ImageEntry> = {
  // ── People ──
  "dieter-rams": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Braun_SK_4.1.jpg/600px-Braun_SK_4.1.jpg",
    source: "Wikimedia Commons",
    credit: "Braun SK 4.1 — Vitsœ / CC BY-SA 2.0",
  },
  "tadao-ando": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Church_of_Light.JPG/450px-Church_of_Light.JPG",
    source: "Wikimedia Commons",
    credit: "Church of the Light interior — Attila Bujdosó / CC BY-SA 2.5",
  },
  "charlotte-perriand": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Fauteuil_%C3%A0_dossier_basculant%2C_Le_Corbusier%2C_P._Jeanneret%2C_C._Perriand%2C_Cassina.jpg/600px-Fauteuil_%C3%A0_dossier_basculant%2C_Le_Corbusier%2C_P._Jeanneret%2C_C._Perriand%2C_Cassina.jpg",
    source: "Wikimedia Commons",
    credit: "Fauteuil à dossier basculant — Cassina / CC BY-SA",
  },
  "kenya-hara": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/MUJI_NYC_Inside.jpg/600px-MUJI_NYC_Inside.jpg",
    source: "Wikimedia Commons",
    credit: "MUJI store interior — CC BY-SA",
  },
  "carlo-scarpa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg/600px-Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg",
    source: "Wikimedia Commons",
    credit: "Brion Cemetery panorama — CC BY-SA",
  },
  "lucie-rie": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lucie_Rie_Bowl%2C_York_Art_Gallery_%28Pic_1%29.jpg/600px-Lucie_Rie_Bowl%2C_York_Art_Gallery_%28Pic_1%29.jpg",
    source: "Wikimedia Commons / York Art Gallery",
    credit: "Lucie Rie Bowl — York Art Gallery / CC BY-SA",
  },
  "josef-muller-brockmann": {
    url: "https://upload.wikimedia.org/wikipedia/en/7/77/Musica_viva_zurich_1959.jpg",
    source: "Wikipedia",
    credit: "Musica Viva poster 1959 — Fair use",
  },
  "axel-vervoordt": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kanaal_Wijnegem_01.jpg/600px-Kanaal_Wijnegem_01.jpg",
    source: "Wikimedia Commons",
    credit: "Kanaal Complex, Wijnegem — CC BY-SA",
  },
  "naoto-fukasawa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/MUJI_wall_mounted_CD_player.jpg/400px-MUJI_wall_mounted_CD_player.jpg",
    source: "Wikimedia Commons",
    credit: "MUJI wall mounted CD player — CC BY-SA",
  },
  "peter-zumthor": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Therme_Vals_indoor_pool.jpg/600px-Therme_Vals_indoor_pool.jpg",
    source: "Wikimedia Commons",
    credit: "Therme Vals indoor pool — CC BY-SA",
  },
  "shoji-hamada": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mashiko_Museum_of_Ceramic_Art_2009.jpg/600px-Mashiko_Museum_of_Ceramic_Art_2009.jpg",
    source: "Wikimedia Commons",
    credit: "Mashiko Museum of Ceramic Art — CC BY-SA",
  },
  "bruno-munari": {
    url: "https://upload.wikimedia.org/wikipedia/en/6/6c/Munari_Falkland_1964.jpg",
    source: "Wikipedia",
    credit: "Falkland Lamp 1964 — Fair use",
  },
  "irma-boom": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Irma_Boom_-_SHV_Think_Book.jpg/400px-Irma_Boom_-_SHV_Think_Book.jpg",
    source: "Wikimedia Commons",
    credit: "SHV Think Book — CC BY-SA",
  },
  "charles-ray-eames": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eames_Lounge_Chair_%284517230858%29.jpg/600px-Eames_Lounge_Chair_%284517230858%29.jpg",
    source: "Wikimedia Commons",
    credit: "Eames Lounge Chair — CC BY",
  },
  "john-pawson": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Design_Museum%2C_London_2.jpg/600px-Design_Museum%2C_London_2.jpg",
    source: "Wikimedia Commons",
    credit: "Design Museum London — CC BY-SA",
  },
  "kuramata-shiro": {
    url: "https://upload.wikimedia.org/wikipedia/en/2/25/How_High_the_Moon_Chair.jpg",
    source: "Wikipedia",
    credit: "How High the Moon — Fair use",
  },
  "yanagi-sori": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Yanagi_Sori.jpg/400px-Yanagi_Sori.jpg",
    source: "Wikimedia Commons",
    credit: "Sōri Yanagi — CC BY-SA",
  },
  "tanaka-ikko": {
    url: "https://upload.wikimedia.org/wikipedia/en/b/b8/Nihon_Buyo_poster_by_Ikko_Tanaka_1981.jpg",
    source: "Wikipedia / MoMA Collection",
    credit: "Nihon Buyo poster 1981 — Fair use",
  },
  "kenzo-tange": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yoyogi_National_Gymnasium_01.jpg/600px-Yoyogi_National_Gymnasium_01.jpg",
    source: "Wikimedia Commons",
    credit: "Yoyogi National Gymnasium — CC BY-SA",
  },
  "sanaa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa_002.jpg/600px-21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa_002.jpg",
    source: "Wikimedia Commons",
    credit: "21st Century Museum, Kanazawa — CC BY-SA",
  },
  "isozaki-arata": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Palau_Sant_Jordi_01.jpg/600px-Palau_Sant_Jordi_01.jpg",
    source: "Wikimedia Commons",
    credit: "Palau Sant Jordi — CC BY-SA",
  },
  "ando-azuma": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sendai_Mediatheque_2009.jpg/600px-Sendai_Mediatheque_2009.jpg",
    source: "Wikimedia Commons",
    credit: "Sendai Mediatheque — CC BY-SA",
  },
  // Sugiura: use the official Musashino Art University archive
  "sugiura-kohei": {
    url: "https://sugiurakohei.musabi.ac.jp/common/images/howto/cap001.jpg",
    source: "Musashino Art University — Design Cosmos Archive",
    credit: "杉浦康平デザインアーカイブ「デザイン・コスモス」— © SUGIURA Kohei / MAU",
  },
  "yokoo-tadanori": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Tadanori_Yokoo_Museum_of_Contemporary_Art02n.jpg/400px-Tadanori_Yokoo_Museum_of_Contemporary_Art02n.jpg",
    source: "Wikimedia Commons",
    credit: "Tadanori Yokoo Museum — CC BY-SA",
  },
  // Remaining Japanese designers — official/authoritative sources
  "uchida-shigeru": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hotel_Il_Palazzo_01.jpg/600px-Hotel_Il_Palazzo_01.jpg",
    source: "Wikimedia Commons",
    credit: "Hotel Il Palazzo (Uchida interior) — CC BY-SA",
  },
  "kenmochi-isamu": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kashiwado_Rattan_Chair_Isamu_Kenmochi.jpg/400px-Kashiwado_Rattan_Chair_Isamu_Kenmochi.jpg",
    source: "Wikimedia Commons",
    credit: "Rattan Chair — CC BY-SA",
  },
  "hara-hiromu": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nippon_magazine_cover.jpg/400px-Nippon_magazine_cover.jpg",
    source: "Wikimedia Commons",
    credit: "NIPPON magazine — Public Domain",
  },
  "kikuchi-nobuyoshi": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Japanese_traditional_books.jpg/600px-Japanese_traditional_books.jpg",
    source: "Wikimedia Commons",
    credit: "Japanese book binding — CC BY-SA",
  },
  "nagai-kazumasa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nippon_Design_Center.jpg/600px-Nippon_Design_Center.jpg",
    source: "Wikimedia Commons",
    credit: "Nippon Design Center — CC BY-SA",
  },

  // ── Works ──
  "braun-sk4": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Braun_SK_4.1.jpg/600px-Braun_SK_4.1.jpg",
    source: "Wikimedia Commons",
    credit: "Braun SK 4.1 — CC BY-SA 2.0",
  },
  "church-of-the-light": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Church_of_Light.JPG/450px-Church_of_Light.JPG",
    source: "Wikimedia Commons",
    credit: "Church of the Light — CC BY-SA 2.5",
  },
  "therme-vals": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Therme_Vals_indoor_pool.jpg/600px-Therme_Vals_indoor_pool.jpg",
    source: "Wikimedia Commons",
    credit: "Therme Vals — CC BY-SA",
  },
  "eames-lounge": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eames_Lounge_Chair_%284517230858%29.jpg/600px-Eames_Lounge_Chair_%284517230858%29.jpg",
    source: "Wikimedia Commons",
    credit: "Eames Lounge Chair — CC BY",
  },
  "brion-cemetery": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg/600px-Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg",
    source: "Wikimedia Commons",
    credit: "Brion Cemetery — CC BY-SA",
  },
  "butterfly-stool": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Yanagi_Sori.jpg/400px-Yanagi_Sori.jpg",
    source: "Wikimedia Commons",
    credit: "Sori Yanagi — CC BY-SA",
  },
  "miss-blanche": {
    url: "https://upload.wikimedia.org/wikipedia/en/2/25/How_High_the_Moon_Chair.jpg",
    source: "Wikipedia",
    credit: "Kuramata — Fair use",
  },
  "how-high-the-moon": {
    url: "https://upload.wikimedia.org/wikipedia/en/2/25/How_High_the_Moon_Chair.jpg",
    source: "Wikipedia",
    credit: "How High the Moon — Fair use",
  },
  "nihon-buyo-poster": {
    url: "https://upload.wikimedia.org/wikipedia/en/b/b8/Nihon_Buyo_poster_by_Ikko_Tanaka_1981.jpg",
    source: "Wikipedia / MoMA Collection",
    credit: "Nihon Buyo — Fair use",
  },
  "yoyogi-gymnasium": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yoyogi_National_Gymnasium_01.jpg/600px-Yoyogi_National_Gymnasium_01.jpg",
    source: "Wikimedia Commons",
    credit: "Yoyogi Gymnasium — CC BY-SA",
  },
  "sendai-mediatheque": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sendai_Mediatheque_2009.jpg/600px-Sendai_Mediatheque_2009.jpg",
    source: "Wikimedia Commons",
    credit: "Sendai Mediatheque — CC BY-SA",
  },
  "21c-museum-kanazawa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa_002.jpg/600px-21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa_002.jpg",
    source: "Wikimedia Commons",
    credit: "21st Century Museum — CC BY-SA",
  },
  "muji-cd-player": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/MUJI_wall_mounted_CD_player.jpg/400px-MUJI_wall_mounted_CD_player.jpg",
    source: "Wikimedia Commons",
    credit: "MUJI CD Player — CC BY-SA",
  },
  "falkland-lamp": {
    url: "https://upload.wikimedia.org/wikipedia/en/6/6c/Munari_Falkland_1964.jpg",
    source: "Wikipedia",
    credit: "Falkland Lamp — Fair use",
  },
  "606-shelving": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/606_Universal_Shelving_System.jpg/600px-606_Universal_Shelving_System.jpg",
    source: "Wikimedia Commons",
    credit: "606 Shelving — CC BY-SA",
  },
  "musica-viva-poster": {
    url: "https://upload.wikimedia.org/wikipedia/en/7/77/Musica_viva_zurich_1959.jpg",
    source: "Wikipedia",
    credit: "Musica Viva — Fair use",
  },
  "shv-think-book": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Irma_Boom_-_SHV_Think_Book.jpg/400px-Irma_Boom_-_SHV_Think_Book.jpg",
    source: "Wikimedia Commons",
    credit: "SHV Think Book — CC BY-SA",
  },

  // ── Movements ──
  "bauhaus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bauhaus-Dessau_main_building.jpg/600px-Bauhaus-Dessau_main_building.jpg",
    source: "Wikimedia Commons",
    credit: "Bauhaus Dessau — CC BY-SA",
  },
  "mingei": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mashiko_Museum_of_Ceramic_Art_2009.jpg/600px-Mashiko_Museum_of_Ceramic_Art_2009.jpg",
    source: "Wikimedia Commons",
    credit: "Mashiko Museum — CC BY-SA",
  },
  "swiss-style": {
    url: "https://upload.wikimedia.org/wikipedia/en/7/77/Musica_viva_zurich_1959.jpg",
    source: "Wikipedia",
    credit: "Musica Viva — Fair use",
  },
  "wabi-sabi": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Kintsugi.jpg/600px-Kintsugi.jpg",
    source: "Wikimedia Commons",
    credit: "Kintsugi — CC BY-SA",
  },
  "mid-century-modern": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eames_Lounge_Chair_%284517230858%29.jpg/600px-Eames_Lounge_Chair_%284517230858%29.jpg",
    source: "Wikimedia Commons",
    credit: "Eames Lounge Chair — CC BY",
  },

  // ── Events ──
  "expo-70": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tower_of_the_Sun%2C_Expo_%2770%2C_Osaka%2C_Japan.jpg/400px-Tower_of_the_Sun%2C_Expo_%2770%2C_Osaka%2C_Japan.jpg",
    source: "Wikimedia Commons",
    credit: "Tower of the Sun — CC BY-SA",
  },
  "milan-salone": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Rho_Fiera_Milano.jpg/600px-Rho_Fiera_Milano.jpg",
    source: "Wikimedia Commons",
    credit: "Rho Fiera Milano — CC BY-SA",
  },
  "bauhaus-founding": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bauhaus-Dessau_main_building.jpg/600px-Bauhaus-Dessau_main_building.jpg",
    source: "Wikimedia Commons",
    credit: "Bauhaus Dessau — CC BY-SA",
  },
};

/** Get just the URL for backward compatibility */
export const REAL_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGES).map(([k, v]) => [k, v.url])
);

/** Get full image metadata (url + source + credit) */
export function getImageMeta(id: string): ImageEntry | undefined {
  return IMAGES[id];
}

/** Get all image entries */
export function getAllImageMeta(): Record<string, ImageEntry> {
  return IMAGES;
}
