import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

const dates = [];
for (let i = 0; i < 180; i++) {
  const date = new Date("2026-04-13T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + i);
  dates.push(date.toISOString().slice(0, 10));
}

const hotels = [
  ["htl_101", "Luma Reforma", "Ciudad de México", "México", "Paseo de la Reforma", "Av. Reforma 100", "Hotel", "Hotel urbano cerca de museos, restaurantes y zonas corporativas.", 5, 9.1, 1248, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Alberca", "Desayuno", "Gimnasio"]],
  ["htl_102", "Hotel Sol Centro", "Ciudad de México", "México", "Centro Histórico", "Madero 45", "Boutique hotel", "Opción céntrica para caminar hacia puntos turísticos.", 4, 8.8, 821, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Restaurante"]],
  ["htl_201", "Luma Caribe", "Cancún", "México", "Zona Hotelera", "Blvd. Kukulcán km 9", "Resort", "Resort familiar frente al mar con albercas y actividades.", 5, 9.3, 2340, "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Playa", "Alberca", "Todo incluido"]],
  ["htl_202", "Mar Azul Suites", "Cancún", "México", "Puerto Cancún", "Av. Bonampak 200", "Apart-hotel", "Suites amplias para familias y estancias largas.", 4, 8.7, 605, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Cocina", "Alberca"]],
  ["htl_301", "Luma Andares", "Guadalajara", "México", "Zapopan", "Av. Patria 500", "Hotel", "Hotel moderno junto a centros comerciales y restaurantes.", 5, 9.0, 943, "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Desayuno"]],
  ["htl_401", "Sierra Business Monterrey", "Monterrey", "México", "San Pedro", "Calzada del Valle 55", "Business hotel", "Hotel orientado a viajes de negocio con conexión a zonas financieras.", 4, 8.9, 710, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Estacionamiento"]],
  ["htl_501", "Luma Madrid Gran Vía", "Madrid", "España", "Gran Vía", "Gran Vía 25", "Hotel", "Hotel céntrico cerca de teatros, tiendas y restaurantes.", 4, 8.9, 1540, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Restaurante"]],
  ["htl_502", "Barcelona Beach Stay", "Barcelona", "España", "Barceloneta", "Passeig Marítim 80", "Hotel", "Hotel cerca de la playa con terraza y vista al mar.", 4, 8.7, 980, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Playa", "Terraza"]],
  ["htl_601", "Luma Buenos Aires Centro", "Buenos Aires", "Argentina", "Microcentro", "Av. Corrientes 1200", "Hotel", "Hotel urbano para turismo y viajes de negocio.", 4, 8.6, 740, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Gimnasio"]],
  ["htl_602", "Palermo Suites", "Buenos Aires", "Argentina", "Palermo", "Costa Rica 4500", "Apart-hotel", "Suites modernas cerca de bares, parques y restaurantes.", 4, 9.0, 1120, "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Cocina", "Pet friendly"]],
  ["htl_701", "Luma Bogotá 93", "Bogotá", "Colombia", "Parque de la 93", "Calle 93 #12-40", "Business hotel", "Hotel para negocios con fácil acceso a restaurantes y oficinas.", 5, 9.1, 890, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Restaurante"]],
  ["htl_702", "Cartagena Mar Resort", "Cartagena", "Colombia", "Bocagrande", "Av. San Martín 300", "Beach resort", "Resort frente al mar ideal para familias.", 5, 9.2, 1680, "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Playa", "Alberca", "Spa"]],
  ["htl_801", "Luma Lima Miraflores", "Lima", "Perú", "Miraflores", "Av. Larco 750", "Hotel", "Hotel moderno cerca del malecón y zonas gastronómicas.", 4, 8.8, 670, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Restaurante"]],
  ["htl_901", "Santiago Business Plaza", "Santiago", "Chile", "Las Condes", "Av. Apoquindo 4500", "Business hotel", "Hotel orientado a viajes corporativos.", 4, 8.7, 760, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Estacionamiento"]],
  ["htl_1001", "Luma Miami Beach", "Miami", "Estados Unidos", "South Beach", "Ocean Drive 120", "Beach resort", "Resort moderno a pasos de la playa.", 5, 9.1, 1310, "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Playa", "Alberca", "Bar"]],
  ["htl_1002", "Manhattan City Inn", "New York", "Estados Unidos", "Midtown", "5th Avenue 350", "City hotel", "Hotel en zona estratégica para turismo y negocios.", 4, 8.8, 2145, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Centro de negocios"]],
  ["htl_1101", "Paris Left Bank Hotel", "Paris", "Francia", "Saint-Germain", "Rue de Vaugirard 40", "Boutique hotel", "Hotel elegante en una de las zonas más emblemáticas de París.", 4, 9.0, 990, "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Bar"]],
  ["htl_1201", "Rome Piazza Suites", "Rome", "Italia", "Centro Storico", "Via del Corso 88", "Apart-hotel", "Suites céntricas cerca de plazas y monumentos.", 4, 8.9, 845, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Cocina", "Desayuno"]],
  ["htl_1301", "Lisbon View Stay", "Lisbon", "Portugal", "Baixa", "Rua Augusta 120", "Hotel", "Hotel con acceso fácil a tranvías, plazas y miradores.", 4, 8.8, 720, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Terraza"]],
  ["htl_1401", "Luma London Bridge", "London", "Inglaterra", "South Bank", "Tooley Street 80", "City hotel", "Hotel moderno cerca de London Bridge, Borough Market y zonas corporativas.", 4, 8.9, 1320, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Gimnasio", "Bar"]],
  ["htl_1402", "Manchester Central Stay", "Manchester", "Inglaterra", "City Centre", "Peter Street 25", "Business hotel", "Opción céntrica para viajes de negocio y escapadas urbanas.", 4, 8.6, 740, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Centro de negocios"]],
  ["htl_1501", "Berlin Mitte Rooms", "Berlin", "Alemania", "Mitte", "Friedrichstrasse 120", "Hotel", "Hotel urbano con acceso rápido a museos, restaurantes y transporte.", 4, 8.8, 910, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Bar"]],
  ["htl_1502", "Munich Garden Suites", "Munich", "Alemania", "Altstadt", "Sendlinger Strasse 18", "Boutique hotel", "Suites cómodas cerca del centro histórico y áreas comerciales.", 4, 8.7, 690, "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Estacionamiento"]],
  ["htl_1601", "Shanghai Bund Hotel", "Shanghai", "China", "The Bund", "Zhongshan East 188", "City hotel", "Hotel con vistas al skyline y acceso a zonas comerciales.", 5, 9.0, 1540, "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Restaurante", "Vista al mar"]],
  ["htl_1602", "Beijing Imperial Stay", "Beijing", "China", "Dongcheng", "Wangfujing 56", "Hotel", "Hotel céntrico ideal para turismo cultural y negocios.", 4, 8.8, 880, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Centro de negocios"]],
  ["htl_1701", "Toronto Downtown Inn", "Toronto", "Canadá", "Downtown", "King Street 220", "City hotel", "Hotel bien conectado para viajes urbanos y corporativos.", 4, 8.7, 990, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Gimnasio", "Estacionamiento"]],
  ["htl_1702", "Vancouver Harbor Suites", "Vancouver", "Canadá", "Harbour", "Waterfront Road 40", "Apart-hotel", "Suites modernas cerca del puerto y zonas turísticas.", 4, 9.1, 1120, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Cocina", "Gimnasio", "Vista al mar"]],
  ["htl_1801", "Tokyo Shibuya Stay", "Tokyo", "Japón", "Shibuya", "Dogenzaka 15", "City hotel", "Hotel moderno cerca de estaciones, compras y restaurantes.", 5, 9.2, 2040, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Gimnasio", "Restaurante"]],
  ["htl_1802", "Osaka Namba Hotel", "Osaka", "Japón", "Namba", "Namba 3-12", "Hotel", "Hotel cómodo para turismo urbano y viajes en familia.", 4, 8.9, 970, "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop", ["Wi-Fi", "Desayuno", "Lavandería"]]
];

const rooms = [
  ["rm_201", "htl_101", "Deluxe King", "King", "Desayuno incluido", "Flexible", 2, 2, 2450, "MXN", "FLEX"],
  ["rm_202", "htl_101", "Suite Familiar", "2 Queen", "Desayuno incluido", "Estándar", 3, 3, 3400, "MXN", "STD"],
  ["rm_301", "htl_102", "Doble Estándar", "2 Matrimoniales", "Solo habitación", "Flexible", 2, 1, 2100, "MXN", "FLEX"],
  ["rm_401", "htl_201", "Ocean View Familiar", "2 Queen", "Todo incluido", "Flexible", 2, 2, 3850, "MXN", "FLEX"],
  ["rm_402", "htl_201", "Suite Club Mar", "King + sofá cama", "Todo incluido", "No reembolsable", 3, 2, 5200, "MXN", "NRF"],
  ["rm_501", "htl_202", "Suite con Cocina", "2 Queen", "Solo habitación", "Estándar", 2, 3, 2950, "MXN", "STD"],
  ["rm_601", "htl_301", "Superior King", "King", "Desayuno incluido", "Flexible", 2, 1, 2250, "MXN", "FLEX"],
  ["rm_701", "htl_401", "Business Queen", "Queen", "Solo habitación", "Flexible", 2, 0, 1980, "MXN", "FLEX"],
  ["rm_801", "htl_501", "Superior Queen", "Queen", "Desayuno incluido", "Flexible", 2, 1, 185, "EUR", "FLEX"],
  ["rm_802", "htl_502", "Sea View Twin", "2 Twin", "Solo habitación", "Flexible", 2, 1, 220, "EUR", "STD"],
  ["rm_901", "htl_601", "Executive King", "King", "Desayuno incluido", "Flexible", 2, 1, 85000, "ARS", "FLEX"],
  ["rm_902", "htl_602", "Palermo Suite", "Queen + sofá cama", "Solo habitación", "Flexible", 2, 2, 120000, "ARS", "STD"],
  ["rm_1001", "htl_701", "Business King", "King", "Desayuno incluido", "Flexible", 2, 1, 420000, "COP", "FLEX"],
  ["rm_1002", "htl_702", "Family Ocean", "2 Queen", "Desayuno incluido", "Flexible", 2, 2, 680000, "COP", "FLEX"],
  ["rm_1101", "htl_801", "Miraflores Queen", "Queen", "Desayuno incluido", "Flexible", 2, 1, 380, "PEN", "FLEX"],
  ["rm_1201", "htl_901", "Business Twin", "2 Twin", "Solo habitación", "Flexible", 2, 0, 95000, "CLP", "FLEX"],
  ["rm_1301", "htl_1001", "South Beach Suite", "King", "Solo habitación", "Flexible", 2, 1, 310, "USD", "FLEX"],
  ["rm_1302", "htl_1002", "City Queen", "Queen", "Solo habitación", "Flexible", 2, 0, 270, "USD", "STD"],
  ["rm_1401", "htl_1101", "Classic Paris", "Queen", "Desayuno incluido", "Flexible", 2, 0, 240, "EUR", "FLEX"],
  ["rm_1501", "htl_1201", "Roman Suite", "King", "Desayuno incluido", "Flexible", 2, 1, 210, "EUR", "FLEX"],
  ["rm_1601", "htl_1301", "Lisbon Terrace", "Queen", "Desayuno incluido", "Flexible", 2, 0, 170, "EUR", "FLEX"],
  ["rm_1701", "htl_1401", "Bridge Queen", "Queen", "Desayuno incluido", "Flexible", 2, 1, 210, "GBP", "FLEX"],
  ["rm_1702", "htl_1402", "Central Twin", "2 Twin", "Solo habitación", "Flexible", 2, 0, 165, "GBP", "STD"],
  ["rm_1801", "htl_1501", "Mitte King", "King", "Desayuno incluido", "Flexible", 2, 1, 190, "EUR", "FLEX"],
  ["rm_1802", "htl_1502", "Garden Suite", "Queen + sofá cama", "Desayuno incluido", "Flexible", 2, 2, 230, "EUR", "FLEX"],
  ["rm_1901", "htl_1601", "Bund Skyline", "King", "Solo habitación", "Flexible", 2, 1, 980, "CNY", "FLEX"],
  ["rm_1902", "htl_1602", "Imperial Twin", "2 Twin", "Desayuno incluido", "Flexible", 2, 1, 760, "CNY", "STD"],
  ["rm_2001", "htl_1701", "Downtown Queen", "Queen", "Solo habitación", "Flexible", 2, 0, 240, "CAD", "FLEX"],
  ["rm_2002", "htl_1702", "Harbor Suite", "King + sofá cama", "Solo habitación", "Flexible", 2, 2, 310, "CAD", "FLEX"],
  ["rm_2101", "htl_1801", "Shibuya Premium", "King", "Desayuno incluido", "Flexible", 2, 1, 28000, "JPY", "FLEX"],
  ["rm_2102", "htl_1802", "Namba Family", "2 Twin", "Desayuno incluido", "Flexible", 2, 2, 22000, "JPY", "STD"]
];

async function seed() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await pool.query(`
    INSERT INTO users (id, name, email, password_hash, phone, status)
    VALUES ('usr_001', 'Gerson QA', 'qa@lumastay.app', $1, '+52 55 0000 0000', 'active')
    ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `, [passwordHash]);

  for (const hotel of hotels) {
    await pool.query(`
      INSERT INTO hotels (id, name, city, country, zone, address, property_type, description, stars, rating, review_count, image_url, amenities, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'active')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        zone = EXCLUDED.zone,
        address = EXCLUDED.address,
        property_type = EXCLUDED.property_type,
        description = EXCLUDED.description,
        stars = EXCLUDED.stars,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        image_url = EXCLUDED.image_url,
        amenities = EXCLUDED.amenities,
        status = 'active'
    `, hotel);
  }

  for (const room of rooms) {
    await pool.query(`
      INSERT INTO room_types (
        id, hotel_id, name, bed_type, board_plan, cancellation_policy,
        capacity_adults, capacity_children, base_rate, currency, rate_plan_code
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO UPDATE SET
        hotel_id = EXCLUDED.hotel_id,
        name = EXCLUDED.name,
        bed_type = EXCLUDED.bed_type,
        board_plan = EXCLUDED.board_plan,
        cancellation_policy = EXCLUDED.cancellation_policy,
        capacity_adults = EXCLUDED.capacity_adults,
        capacity_children = EXCLUDED.capacity_children,
        base_rate = EXCLUDED.base_rate,
        currency = EXCLUDED.currency,
        rate_plan_code = EXCLUDED.rate_plan_code
    `, room);
  }

  for (const date of dates) {
    for (const room of rooms) {
      const roomId = room[0];
      const baseRate = Number(room[8]);
      const day = new Date(`${date}T00:00:00Z`).getUTCDay();
      const weekendIncrease = day === 5 || day === 6 ? 1.18 : 1;
      const availableUnits = roomId.endsWith("2") ? 2 : 4;

      await pool.query(`
        INSERT INTO inventories (room_type_id, inventory_date, available_units, rate_override)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (room_type_id, inventory_date) DO UPDATE SET
          available_units = EXCLUDED.available_units,
          rate_override = EXCLUDED.rate_override
      `, [roomId, date, availableUnits, Math.round(baseRate * weekendIncrease)]);
    }
  }

  console.log("Seed complete");
  await pool.end();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});