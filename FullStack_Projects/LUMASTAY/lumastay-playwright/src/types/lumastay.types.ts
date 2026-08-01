export interface Hotel {
    hotelId: string;
    hotelName: string;
    city: string;
    country: string;
    zone: string | null;
    propertyType: string;
    description: string | null;
    stars: number | null;
    rating: string | null;
    reviewCount: number;
    imageUrl: string | null;
    amenities: string[];
    currency: string;
    minRate: string;
    ratePlanCode: string;
    available: boolean;
}


export interface SearchCriteria {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
}

export interface SearchResponse {
    searchId: string;
    criteria: SearchCriteria;
    results: Hotel[];
}

export interface Destination {
    city: string;
    country: string;
    hotelCount: number;
}

export interface DestinationResponse {
    destinations: Destination[];
}