export const openapi = {
  openapi: "3.0.3",
  info: { title: "LumaStay API", version: "1.0.0" },
  servers: [{ url: "http://localhost:4000/api/v1" }],
  paths: {
    "/auth/login": {
      post: { summary: "Login", responses: { 200: { description: "JWT emitido" } } }
    },
    "/destinations": {
      get: { summary: "Listar destinos", responses: { 200: { description: "Destinos" } } }
    },
    "/search": {
      post: {
        summary: "Search hotels",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["destination", "checkIn", "checkOut", "adults", "children", "rooms"],
                properties: {
                  destination: { type: "string", example: "Barcelona" },
                  checkIn: { type: "string", format: "date", example: "2026-06-12" },
                  checkOut: { type: "string", format: "date", example: "2026-06-15" },
                  adults: { type: "integer", example: 2 },
                  children: { type: "integer", example: 1 },
                  rooms: { type: "integer", example: 1 },
                  minPrice: { type: "number", example: 150 },
                  maxPrice: { type: "number", example: 400 },
                  minRating: { type: "number", example: 9.0 },
                  propertyType: { type: "string", example: "Hotel" },
                  amenity: { type: "string", example: "Wi-Fi" },
                  sortBy: {
                    type: "string",
                    enum: ["price_asc", "price_desc", "rating_desc"],
                    example: "price_asc"
                  }
                }
              },
              examples: {
                basicSearch: {
                  summary: "Basic hotel search",
                  value: {
                    destination: "Barcelona",
                    checkIn: "2026-06-12",
                    checkOut: "2026-06-15",
                    adults: 2,
                    children: 1,
                    rooms: 1
                  }
                },
                filteredSearch: {
                  summary: "Search with filters",
                  value: {
                    destination: "Barcelona",
                    checkIn: "2026-06-12",
                    checkOut: "2026-06-15",
                    adults: 2,
                    children: 1,
                    rooms: 1,
                    minRating: 9.0,
                    sortBy: "price_asc"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Resultados" },
          400: { description: "Validation error" }
        }
      }
    },
    "/hotels/{hotelId}/availability": {
      get: { summary: "Disponibilidad por hotel", responses: { 200: { description: "Habitaciones disponibles" } } }
    },
    "/reservations": {
      post: { summary: "Crear reserva" },
      get: { summary: "Listar reservas" }
    },
    "/reservations/{reservationId}": {
      get: { summary: "Detalle de reserva" }
    },
    "/reservations/{reservationId}/cancel": {
      post: { summary: "Cancelar reserva" }
    }
  }
};