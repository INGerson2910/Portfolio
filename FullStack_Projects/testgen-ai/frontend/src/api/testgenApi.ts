import axios from "axios";
import type { GenerationRequest, GenerationResponse } from "../types/generation";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateTestCases(
  payload: GenerationRequest
): Promise<GenerationResponse> {
  const response = await api.post<GenerationResponse>("/api/v1/generations", payload);
  return response.data;
}

export async function exportWorkbook(payload: GenerationResponse): Promise<Blob> {
  const response = await api.post("/api/v1/generations/export", payload, {
    responseType: "blob",
  });

  return response.data;
}