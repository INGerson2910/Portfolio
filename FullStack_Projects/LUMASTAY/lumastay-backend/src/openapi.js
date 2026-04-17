export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "LumaStay API",
    version: "1.0.0",
    description: "Booking-like demo API for hotel search, availability, reservations, and cancellation."
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Search", description: "Destination, search, and availability endpoints" },
    { name: "Reservations", description: "Reservation lifecycle endpoints" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "qa@lumastay.app" },
          password: { type: "string", example: "Password123!" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "usr_001" },
              name: { type: "string", example: "Gerson QA" },
              email: { type: "string", example: "qa@lumastay.app" }
            }
          }
        }
      },
      Destination: {
        type: "object",
        properties: {
          city: { type: "string", example: "Barcelona" },
          country: { type: "string", example: "España" },
          hotelCount: { type: "integer", example: 1 }
        }
      },
      SearchRequest: {
        type: "object",
        required: ["destination", "checkIn", "checkOut", "adults", "children", "rooms"],
        properties: {
          destination: { type: "string", example: "Barcelona" },
          checkIn: { type: "string", format: "date", example: "2026-06-12" },
          checkOut: { type: "string", format: "date", example: "2026-06-15" },
          guests: { type: "integer", example: 2 },
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
      SearchResult: {
        type: "object",
        properties: {
          hotelId: { type: "string", example: "htl_502" },
          hotelName: { type: "string", example: "Barcelona Beach Stay" },
          city: { type: "string", example: "Barcelona" },
          country: { type: "string", example: "España" },
          zone: { type: "string", example: "Barceloneta" },
          propertyType: { type: "string", example: "Hotel" },
          description: { type: "string", example: "Hotel cerca de la playa con terraza y vista al mar." },
          stars: { type: "integer", example: 4 },
          rating: { type: "number", example: 8.7 },
          reviewCount: { type: "integer", example: 980 },
          imageUrl: { type: "string", example: "https://images.unsplash.com/photo-example" },
          amenities: {
            type: "array",
            items: { type: "string" },
            example: ["Wi-Fi", "Playa", "Terraza"]
          },
          currency: { type: "string", example: "EUR" },
          minRate: { type: "number", example: 220 },
          ratePlanCode: { type: "string", example: "STD" },
          available: { type: "boolean", example: true }
        }
      },
      SearchResponse: {
        type: "object",
        properties: {
          searchId: { type: "string", example: "src_1712345678901" },
          criteria: {
            type: "object",
            properties: {
              destination: { type: "string", example: "Barcelona" },
              checkIn: { type: "string", format: "date", example: "2026-06-12" },
              checkOut: { type: "string", format: "date", example: "2026-06-15" },
              adults: { type: "integer", example: 2 },
              children: { type: "integer", example: 1 },
              rooms: { type: "integer", example: 1 }
            }
          },
          results: {
            type: "array",
            items: { $ref: "#/components/schemas/SearchResult" }
          }
        }
      },
      AvailabilityRoom: {
        type: "object",
        properties: {
          roomTypeId: { type: "string", example: "rm_802" },
          name: { type: "string", example: "Sea View Twin" },
          bedType: { type: "string", example: "2 Twin" },
          boardPlan: { type: "string", example: "Solo habitación" },
          cancellationPolicy: { type: "string", example: "Flexible" },
          capacityAdults: { type: "integer", example: 2 },
          capacityChildren: { type: "integer", example: 1 },
          availableUnits: { type: "integer", example: 2 },
          nightlyRate: { type: "number", example: 220 },
          currency: { type: "string", example: "EUR" },
          ratePlanCode: { type: "string", example: "STD" }
        }
      },
      AvailabilityResponse: {
        type: "object",
        properties: {
          hotelId: { type: "string", example: "htl_502" },
          criteria: {
            type: "object",
            properties: {
              checkIn: { type: "string", format: "date", example: "2026-06-12" },
              checkOut: { type: "string", format: "date", example: "2026-06-15" },
              adults: { type: "integer", example: 2 },
              children: { type: "integer", example: 1 },
              rooms: { type: "integer", example: 1 }
            }
          },
          rooms: {
            type: "array",
            items: { $ref: "#/components/schemas/AvailabilityRoom" }
          }
        }
      },
      Buyer: {
        type: "object",
        required: [
          "reservationHolder",
          "buyerName",
          "email",
          "phone",
          "street",
          "city",
          "state",
          "postalCode",
          "country",
          "cardholderName",
          "cardNumber",
          "expiryMonth",
          "expiryYear",
          "cvv"
        ],
        properties: {
          reservationHolder: { type: "string", example: "Gerson Medina" },
          buyerName: { type: "string", example: "Gerson Medina" },
          email: { type: "string", format: "email", example: "gerson@example.com" },
          phone: { type: "string", example: "+52 5512345678" },
          street: { type: "string", example: "Av. Reforma 123" },
          city: { type: "string", example: "Ciudad de México" },
          state: { type: "string", example: "CDMX" },
          postalCode: { type: "string", example: "06600" },
          country: { type: "string", example: "México" },
          cardholderName: { type: "string", example: "Gerson Medina" },
          cardNumber: { type: "string", example: "1234567890123456" },
          expiryMonth: { type: "string", example: "03" },
          expiryYear: { type: "string", example: "27" },
          cvv: { type: "string", example: "123" }
        }
      },
      CreateReservationRequest: {
        type: "object",
        required: [
          "hotelId",
          "roomTypeId",
          "checkIn",
          "checkOut",
          "adults",
          "children",
          "rooms",
          "paymentMethod",
          "buyer"
        ],
        properties: {
          hotelId: { type: "string", example: "htl_502" },
          roomTypeId: { type: "string", example: "rm_802" },
          checkIn: { type: "string", format: "date", example: "2026-06-12" },
          checkOut: { type: "string", format: "date", example: "2026-06-15" },
          adults: { type: "integer", example: 2 },
          children: { type: "integer", example: 1 },
          rooms: { type: "integer", example: 1 },
          paymentMethod: {
            type: "string",
            enum: ["sandbox_card", "sandbox_declined", "sandbox_pending"],
            example: "sandbox_card"
          },
          buyer: { $ref: "#/components/schemas/Buyer" }
        }
      },
      CreateReservationResponse: {
        type: "object",
        properties: {
          reservationId: { type: "string", example: "7d88f7fa-8b0b-4c2c-bd9f-2e16d4ecb73f" },
          locator: { type: "string", example: "LUMA-12345678" },
          status: { type: "string", example: "confirmed" },
          paymentStatus: { type: "string", example: "approved" },
          totalAmount: { type: "number", example: 765 },
          currency: { type: "string", example: "EUR" }
        }
      },
      ReservationSummary: {
        type: "object",
        properties: {
          reservationId: { type: "string", example: "7d88f7fa-8b0b-4c2c-bd9f-2e16d4ecb73f" },
          locator: { type: "string", example: "LUMA-12345678" },
          status: { type: "string", example: "confirmed" },
          checkIn: { type: "string", format: "date", example: "2026-06-12" },
          checkOut: { type: "string", format: "date", example: "2026-06-15" },
          adults: { type: "integer", example: 2 },
          children: { type: "integer", example: 1 },
          rooms: { type: "integer", example: 1 },
          totalAmount: { type: "number", example: 765 },
          currency: { type: "string", example: "EUR" },
          hotelName: { type: "string", example: "Barcelona Beach Stay" },
          roomName: { type: "string", example: "Sea View Twin" }
        }
      },
      CancelReservationRequest: {
        type: "object",
        required: ["reason"],
        properties: {
          reason: { type: "string", example: "Change of plans" }
        }
      },
      CancelReservationResponse: {
        type: "object",
        properties: {
          reservationId: { type: "string", example: "7d88f7fa-8b0b-4c2c-bd9f-2e16d4ecb73f" },
          status: { type: "string", example: "cancelled" },
          refundAmount: { type: "number", example: 765 }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VAL-001" },
              message: { type: "string", example: "Validation error" },
              details: {
                type: "array",
                items: { type: "object" }
              }
            }
          },
          correlationId: { type: "string", example: "6b134561-cdd1-4bfd-9dad-b81817f0d874" }
        }
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "JWT issued successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/destinations": {
      get: {
        tags: ["Search"],
        summary: "List destinations",
        responses: {
          200: {
            description: "Available destinations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    destinations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Destination" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/search": {
      post: {
        tags: ["Search"],
        summary: "Search hotels",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SearchRequest" },
              examples: {
                basicSearch: {
                  summary: "Basic search",
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
                  summary: "Search with filters and sorting",
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
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SearchResponse" }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/hotels/{hotelId}/availability": {
      get: {
        tags: ["Search"],
        summary: "Get hotel availability",
        parameters: [
          {
            name: "hotelId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "htl_101"
          },
          {
            name: "checkIn",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
            example: "2026-06-12"
          },
          {
            name: "checkOut",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
            example: "2026-06-15"
          },
          {
            name: "adults",
            in: "query",
            required: false,
            schema: { type: "integer", default: 1 },
            example: 2
          },
          {
            name: "children",
            in: "query",
            required: false,
            schema: { type: "integer", default: 0 },
            example: 1
          },
          {
            name: "rooms",
            in: "query",
            required: false,
            schema: { type: "integer", default: 1 },
            example: 1
          }
        ],
        responses: {
          200: {
            description: "Available rooms for hotel",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AvailabilityResponse" }
              }
            }
          },
          400: {
            description: "Invalid date range",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/reservations": {
      post: {
        tags: ["Reservations"],
        summary: "Create reservation",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateReservationRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "Reservation created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateReservationResponse" }
              }
            }
          },
          400: {
            description: "Validation or inventory error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      get: {
        tags: ["Reservations"],
        summary: "List reservations",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User reservations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reservations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ReservationSummary" }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/reservations/{reservationId}": {
      get: {
        tags: ["Reservations"],
        summary: "Get reservation detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "reservationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "7d88f7fa-8b0b-4c2c-bd9f-2e16d4ecb73f"
          }
        ],
        responses: {
          200: {
            description: "Reservation detail",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReservationSummary" }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          404: {
            description: "Reservation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/reservations/{reservationId}/cancel": {
      post: {
        tags: ["Reservations"],
        summary: "Cancel reservation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "reservationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "7d88f7fa-8b0b-4c2c-bd9f-2e16d4ecb73f"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CancelReservationRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Reservation cancelled",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CancelReservationResponse" }
              }
            }
          },
          400: {
            description: "Reservation already cancelled or invalid state",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          404: {
            description: "Reservation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  }
};