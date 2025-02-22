// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
  const response = await fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
