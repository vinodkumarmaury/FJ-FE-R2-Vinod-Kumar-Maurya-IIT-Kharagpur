// app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch("https://dummyjson.com/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: body.refreshToken,
      expiresInMins: 30,
    }),
  });
  const data = await response.json();
  return NextResponse.json(data);
}

