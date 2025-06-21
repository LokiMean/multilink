const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchPlatforms() {
  const response = await fetch(`${BASE_URL}category/`);
  if (!response.ok) throw new Error('Failed to fetch platforms');
  return await response.json();
}
