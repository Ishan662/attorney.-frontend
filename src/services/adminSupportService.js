import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper to get auth token (if needed for protected endpoints)
async function getAuthHeader() {
  const user = getAuth().currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Get all support cases (optionally filtered by status)
export async function fetchSupportCases(status) {
  const params = status ? `?status=${status}` : "";
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets${params}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch support cases");
  return res.json();
}

// Get details for a single support case
export async function fetchSupportCaseDetails(caseId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${caseId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch support case details");
  return res.json();
}

// Post an admin reply to a support case
export async function postAdminReply(caseId, message) {
  const headers = {
    ...(await getAuthHeader()),
    "Content-Type": "application/json",
  };
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${caseId}/answer`, {
    method: "POST",
    headers,
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error("Failed to send reply");
  return res.json();
}

// Close a support case
export async function closeSupportCase(caseId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${caseId}/close`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Failed to close support case");
}