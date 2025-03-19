const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;
export const corsHeaders = {
  "Access-Control-Allow-Origin": `chrome-extension://${extensionId}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};
