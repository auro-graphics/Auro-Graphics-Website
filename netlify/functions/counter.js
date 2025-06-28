const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "visitors.json");

exports.handler = async function (event, context) {
  const ip = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";

  let data = { ips: [], count: 0 };

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath);
    data = JSON.parse(raw);
  }

  if (!data.ips.includes(ip)) {
    data.ips.push(ip);
    data.count += 1;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count: data.count }),
    headers: { "Content-Type": "application/json" },
  };
};
