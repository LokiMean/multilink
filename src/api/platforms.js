const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;


export async function fetchPlatforms() {
  const response = await fetch(`${BASE_URL}category/?api_key=${API_KEY}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch platforms');
  return await response.json();
}
