// Students no longer initialize Firebase directly.
// They use this to talk to your server instead.

async function fetchManagedData(node) {
    try {
        const response = await fetch(`/api/data/${node}`);
        return await response.json();
    } catch (e) {
        console.error("Proxy fetch failure:", e);
        return null;
    }
}