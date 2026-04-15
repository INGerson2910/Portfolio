import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const searchSchema = z.object({
  destination: z.string().min(1),
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.number().int().min(1).optional(),
  adults: z.number().int().min(1).optional(),
  children: z.number().int().min(0).default(0),
  rooms: z.number().int().min(1).default(1),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().optional(),
  propertyType: z.string().optional(),
  amenity: z.string().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "rating_desc"]).optional()
}).refine((data) => data.checkOut > data.checkIn, {
  message: "checkOut must be after checkIn",
  path: ["checkOut"]
});

export const reservationSchema = z.object({
  hotelId: z.string().min(1),
  roomTypeId: z.string().min(1),
  checkIn: isoDate,
  checkOut: isoDate,
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  rooms: z.number().int().min(1).default(1),
  paymentMethod: z.enum(["sandbox_card", "sandbox_declined", "sandbox_pending"]).default("sandbox_card"),
  buyer: z.object({
    reservationHolder: z.string().min(1),
    buyerName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    cardholderName: z.string().min(1),
    cardNumber: z.string().min(16),
    expiryMonth: z.string().min(1),
    expiryYear: z.string().min(1),
    cvv: z.string().min(3)
  })
}).refine((data) => data.checkOut > data.checkIn, {
  message: "checkOut must be after checkIn",
  path: ["checkOut"]
});

export const cancelSchema = z.object({
  reason: z.string().min(1).default("Cambio de plan")
});