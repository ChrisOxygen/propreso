export const corsHeaders = {
  "Access-Control-Allow-Origin": `chrome-extension://${process.env.REACT_APP_EXTENSION_ID}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;
