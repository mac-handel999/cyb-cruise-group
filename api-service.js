// Add this to your student dashboard scripts
async function apiFetch(endpoint) {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) throw new Error("Unauthorized or server error");
    return await response.json();
}