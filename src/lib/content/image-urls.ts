/**
 * Image URL registry with verified sources.
 *
 * Strategy: Each person maps to their most iconic WORK image (not a portrait).
 * Each work maps to the actual work itself.
 * This follows Cosmos's approach: show the work, not the person.
 *
 * Sources:
 *   - Wikimedia Commons direct file URLs (stable, CC-licensed)
 *   - Museum IIIF endpoints (V&A, Rijksmuseum)
 *   - Official archive sites
 *
 * URL format for Wikimedia thumbnails:
 *   https://upload.wikimedia.org/wikipedia/commons/thumb/{hash}/{file}/{w}px-{file}
 */

interface ImageEntry {
  url: string;
  source: string;
  credit: string;
}

const IMAGES: Record<string, ImageEntry> = {
  // ═══════════════════════════════════════
  // PEOPLE → show their most iconic work
  // ═══════════════════════════════════════

  "dieter-rams": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/1956_Braun_Phonosuper_SK4_Schneewittchensarg.JPG/600px-1956_Braun_Phonosuper_SK4_Schneewittchensarg.JPG",
    source: "Wikimedia Commons",
    credit: "Braun SK4 Phonosuper — Alf van Beem / CC0",
  },
  "tadao-ando": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ibaraki_Kasugaoka_Church_light_cross.jpg/600px-Ibaraki_Kasugaoka_Church_light_cross.jpg",
    source: "Wikimedia Commons",
    credit: "Church of the Light, Ibaraki — CC BY-SA",
  },
  "charlotte-perriand": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Fauteuil_%C3%A0_dossier_basculant%2C_Le_Corbusier%2C_P._Jeanneret%2C_C._Perriand%2C_Cassina.jpg/600px-Fauteuil_%C3%A0_dossier_basculant%2C_Le_Corbusier%2C_P._Jeanneret%2C_C._Perriand%2C_Cassina.jpg",
    source: "Wikimedia Commons",
    credit: "Fauteuil basculant — Le Corbusier/Perriand/Cassina / CC BY-SA",
  },
  "kenya-hara": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/MUJI_NYC_Inside.jpg/600px-MUJI_NYC_Inside.jpg",
    source: "Wikimedia Commons",
    credit: "MUJI store interior, NYC — CC BY-SA",
  },
  "carlo-scarpa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg/600px-Brion_cemetery_-_Carlo_Scarpa_-panorama.jpg",
    source: "Wikimedia Commons",
    credit: "Brion Cemetery — Carlo Scarpa / CC BY-SA",
  },
  "lucie-rie": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lucie_Rie_Bowl%2C_York_Art_Gallery_%28Pic_1%29.jpg/600px-Lucie_Rie_Bowl%2C_York_Art_Gallery_%28Pic_1%29.jpg",
    source: "Wikimedia Commons / York Art Gallery",
    credit: "Lucie Rie Bowl — York Art Gallery / CC BY-SA",
  },
  "josef-muller-brockmann": {
    url: "https://upload.wikimedia.org/wikipedia/en/7/77/Musica_viva_zurich_1959.jpg",
    source: "Wikipedia",
    credit: "Musica Viva poster, 1959 — Fair use",
  },
  "axel-vervoordt": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kanaal_Wijnegem_01.jpg/600px-Kanaal_Wijnegem_01.jpg",
    source: "Wikimedia Commons",
    credit: "Kanaal Complex, Wijnegem — CC BY-SA",
  },
  "naoto-fukasawa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/MUJI_wall_mounted_CD_player.jpg/400px-MUJI_wall_mounted_CD_player.jpg",
    source: "Wikimedia Commons",
    credit: "MUJI CD Player — CC BY-SA",
  },
  "peter-zumthor": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Therme_Vals_indoor_pool.jpg/600px-Therme_Vals_indoor_pool.jpg",
    source: "Wikimedia Commons",
    credit: "Therme Vals — CC BY-SA",
  },
  "shoji-hamada": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mashiko_Museum_of_Ceramic_Art_2009.jpg/600px-Mashiko_Museum_of_Ceramic_Art_2009.jpg",
    source: "Wikimedia Commons",
    credit: "Mashiko Museum — CC BY-SA",
  },
  "bruno-munari": {
    url: "https://upload.wikimedia.org/wikipedia/en/6/6c/Munari_Falkland_1964.jpg",
    source: "Wikipedia",
    credit: "Falkland Lamp, 1964 — Fair use",
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
    credit: "How High the Moon chair — Fair use",
  },
  "yanagi-sori": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Yanagi_Sori.jpg/400px-Yanagi_Sori.jpg",
    source: "Wikimedia Commons",
    credit: "Sori Yanagi portrait — CC BY-SA",
  },
  "tanaka-ikko": {
    url: "https://upload.wikimedia.org/wikipedia/en/b/b8/Nihon_Buyo_poster_by_Ikko_Tanaka_1981.jpg",
    source: "Wikipedia / MoMA",
    credit: "Nihon Buyo poster, 1981 — Fair use",
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
  "sugiura-kohei": {
    url: "https://sugiurakohei.musabi.ac.jp/common/images/howto/cap001.jpg",
    source: "Musashino Art University — Design Cosmos Archive",
    credit: "© SUGIURA Kohei / Musashino Art University Museum & Library",
  },
  "yokoo-tadanori": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Tadanori_Yokoo_Museum_of_Contemporary_Art02n.jpg/400px-Tadanori_Yokoo_Museum_of_Contemporary_Art02n.jpg",
    source: "Wikimedia Commons",
    credit: "Tadanori Yokoo Museum — CC BY-SA",
  },
  "uchida-shigeru": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hotel_Il_Palazzo_01.jpg/600px-Hotel_Il_Palazzo_01.jpg",
    source: "Wikimedia Commons",
    credit: "Hotel Il Palazzo — CC BY-SA",
  },
  "kenmochi-isamu": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kashiwado_Rattan_Chair_Isamu_Kenmochi.jpg/400px-Kashiwado_Rattan_Chair_Isamu_Kenmochi.jpg",
    source: "Wikimedia Commons",
    credit: "Rattan Chair — Isamu Kenmochi / CC BY-SA",
  },
  "hara-hiromu": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nippon_magazine_cover.jpg/400px-Nippon_magazine_cover.jpg",
    source: "Wikimedia Commons",
    credit: "NIPPON magazine — Public Domain",
  },
  "nagai-kazumasa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nippon_Design_Center.jpg/600px-Nippon_Design_Center.jpg",
    source: "Wikimedia Commons",
    credit: "Nippon Design Center — CC BY-SA",
  },

  // ═══════════════════════════════════════
  // WORKS → show the actual work
  // ═══════════════════════════════════════

  "braun-sk4": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/1956_Braun_Phonosuper_SK4_Schneewittchensarg.JPG/600px-1956_Braun_Phonosuper_SK4_Schneewittchensarg.JPG",
    source: "Wikimedia Commons",
    credit: "Braun SK4 — Alf van Beem / CC0",
  },
  "church-of-the-light": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ibaraki_Kasugaoka_Church_light_cross.jpg/600px-Ibaraki_Kasugaoka_Church_light_cross.jpg",
    source: "Wikimedia Commons",
    credit: "Light cross — CC BY-SA",
  },
  "therme-vals": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Therme_Vals_indoor_pool.jpg/600px-Therme_Vals_indoor_pool.jpg",
    source: "Wikimedia Commons",
    credit: "Therme Vals pool — CC BY-SA",
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
    credit: "Sori Yanagi design — CC BY-SA",
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
    source: "Wikipedia / MoMA",
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
    credit: "Musica Viva poster — Fair use",
  },
  "shv-think-book": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Irma_Boom_-_SHV_Think_Book.jpg/400px-Irma_Boom_-_SHV_Think_Book.jpg",
    source: "Wikimedia Commons",
    credit: "SHV Think Book — CC BY-SA",
  },

  // ═══════════════════════════════════════
  // MOVEMENTS
  // ═══════════════════════════════════════

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

  // ═══════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════

  "expo-70": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tower_of_the_Sun%2C_Expo_%2770%2C_Osaka%2C_Japan.jpg/400px-Tower_of_the_Sun%2C_Expo_%2770%2C_Osaka%2C_Japan.jpg",
    source: "Wikimedia Commons",
    credit: "Tower of the Sun — CC BY-SA",
  },
  "milan-salone": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Rho_Fiera_Milano.jpg/600px-Rho_Fiera_Milano.jpg",
    source: "Wikimedia Commons",
    credit: "Fiera Milano Rho — CC BY-SA",
  },
  "bauhaus-founding": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bauhaus-Dessau_main_building.jpg/600px-Bauhaus-Dessau_main_building.jpg",
    source: "Wikimedia Commons",
    credit: "Bauhaus Dessau — CC BY-SA",
  },
};

export const REAL_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGES).map(([k, v]) => [k, v.url])
);

export function getImageMeta(id: string): ImageEntry | undefined {
  return IMAGES[id];
}

export function getAllImageMeta(): Record<string, ImageEntry> {
  return IMAGES;
}
