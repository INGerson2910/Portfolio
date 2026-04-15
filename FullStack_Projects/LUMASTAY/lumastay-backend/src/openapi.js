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
      post: { summary: "Buscar hoteles", responses: { 200: { description: "Resultados" } } }
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