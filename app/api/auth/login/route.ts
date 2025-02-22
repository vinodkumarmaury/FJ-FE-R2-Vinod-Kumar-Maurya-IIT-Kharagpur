// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // Forward the login request to dummyJSON
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
      expiresInMins: 30,
    }),
    // Credentials are handled server-side so CORS won’t be an issue
  });
  const data = await response.json();
  return NextResponse.json(data);
}
