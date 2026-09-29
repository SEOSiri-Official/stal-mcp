export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-seosiri-key",
        },
      });
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        status: "HEALTHY",
        service: "SEOSIRI STAL Core Engine Edge Gateway",
        version: "1.0.4",
        stages_active: ["PII_SHIELD", "BIOASSAY", "BIOPHARMA", "BIOROBOTICS", "METERED_BILLING"],
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("SEOSIRI STAL Edge Gateway Active", { status: 200 });
    }
  }
};
