let visitorIPs = new Set();
let visitorCount = 0;

exports.handler = async function (event) {
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";

  if (!visitorIPs.has(ip)) {
    visitorIPs.add(ip);
    visitorCount++;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: visitorCount }),
  };
};
