const url = process.env.BACKEND_URL + "/api/sync";
const res = await fetch(url, { method: "POST" });
const data = await res.json();
console.log("sync result:", JSON.stringify(data));
