// app/api/account/update-profile/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

const WP_API_URL = process.env.WP_API_URL;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    const user = await wpGetUserByToken(token);
    const { display_name, email } = await req.json();

    // Update user in WordPress
    const url = `${WP_API_URL}/wp-json/wp/v2/users/${user.id}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: display_name,
        // email cannot be changed via REST easily; requires verification
      }),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}