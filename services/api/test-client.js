const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["websocket"],   // 🔥 force websocket
});

socket.on("connect", () => {
  console.log("✅ Connected to server");
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});

socket.on("metrics", (data) => {
  console.log("📊 Metrics:", data);
});