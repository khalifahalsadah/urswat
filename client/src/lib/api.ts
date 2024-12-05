import { InsertTalent, InsertCompany } from "@db/schema";

const API_BASE = "/api";

export async function registerTalent(data: InsertTalent & { cvFile?: File }) {
  const formData = new FormData();
  
  // Add all text fields to formData
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'cvFile' && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  // Add the CV file if it exists
  if (data.cvFile) {
    formData.append('cv', data.cvFile);
  }
  
  const response = await fetch(`${API_BASE}/talents`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to register talent");
  }
  
  return response.json();
}

export async function registerCompany(data: InsertCompany) {
  const response = await fetch(`${API_BASE}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to register company");
  }
  
  return response.json();
}
export async function fetchTalents() {
  const response = await fetch(`${API_BASE}/talents`);
  if (!response.ok) {
    throw new Error("Failed to fetch talents");
  }
  return response.json();
}

export async function fetchCompanies() {
  const response = await fetch(`${API_BASE}/companies`);
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }
  return response.json();
}

export async function updateTalent(id: number, data: Partial<InsertTalent>) {
  const response = await fetch(`${API_BASE}/talents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update talent");
  }
  return response.json();
}

export async function deleteTalent(id: number) {
  const response = await fetch(`${API_BASE}/talents/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error("Failed to delete talent");
  }
  return response.json();
}

export async function updateCompany(id: number, data: Partial<InsertCompany>) {
  const response = await fetch(`${API_BASE}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update company");
  }
  return response.json();
}

export async function deleteCompany(id: number) {
  const response = await fetch(`${API_BASE}/companies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error("Failed to delete company");
  }
  return response.json();
}
