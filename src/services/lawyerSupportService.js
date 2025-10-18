import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper to get auth token for authenticated requests
async function getAuthHeader() {
  const user = getAuth().currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// 1. Create a new support case (lawyer creates new question/ticket)
export async function createSupportCase(caseData) {
  const headers = {
    ...(await getAuthHeader()),
    "Content-Type": "application/json",
  };
  const res = await fetch(`${API_BASE}/api/support/cases`, {
    method: "POST",
    headers,
    body: JSON.stringify(caseData),
  });
  if (!res.ok) throw new Error("Failed to create support case");
  return res.json();
}

// 2. Get all support cases created by the current lawyer
export async function getMySupportCases() {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/support/cases/my-cases`, { headers });
  if (!res.ok) throw new Error("Failed to fetch my support cases");
  return res.json();
}

// 3. Get details for a specific support case (that the lawyer owns)
export async function getSupportCaseDetails(caseId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/support/cases/${caseId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch support case details");
  return res.json();
}

// 6. Add a follow-up message to an existing case
export async function addMessageToCase(caseId, messageData) {
  const headers = {
    ...(await getAuthHeader()),
    "Content-Type": "application/json",
  };
  const res = await fetch(`${API_BASE}/api/support/cases/${caseId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error("Failed to add message to case");
  return res.json();
}

// 9. Close a support case (lawyer can close their own case)
export async function closeMySupportCase(caseId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/support/cases/${caseId}/close`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Failed to close support case");
  // Returns 204 No Content on success
}

// Helper function to get all admin support tickets (for admin viewing)
// This is used when admin needs to see all tickets across all users
export async function getAllAdminSupportTickets(status = null) {
  const params = status ? `?status=${status}` : "";
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets${params}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch admin support tickets");
  return res.json();
}

// Admin function to get specific ticket details
export async function getAdminSupportTicketDetails(ticketId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${ticketId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch admin support ticket details");
  return res.json();
}

// 5. Admin answers a user's case
export async function adminAnswerCase(ticketId, messageData) {
  const headers = {
    ...(await getAuthHeader()),
    "Content-Type": "application/json",
  };
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${ticketId}/answer`, {
    method: "POST",
    headers,
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error("Failed to send admin answer");
  return res.json();
}

// 10. Admin closes any user's case
export async function adminCloseSupportCase(ticketId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/admin/support/tickets/${ticketId}/close`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Failed to close support case as admin");
  // Returns 204 No Content on success
}
