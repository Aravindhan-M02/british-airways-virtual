const API_URL = "http://localhost:3000/pilots";

export async function getPilots() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function addPilot(pilot) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pilot),
  });

  return response.json();
}