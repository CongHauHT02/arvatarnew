/**
 * WebSocket to TCP Proxy Bridge for Avatar 2D Server
 * Cầu nối giữa Trình duyệt Web (WebSocket) và Game Server Java (Raw TCP Socket 19128)
 */
const { WebSocketServer } = require('ws');
const net = require('net');

const WS_PORT = parseInt(process.env.WS_PORT || '19129', 10);
const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
const TCP_PORT = parseInt(process.env.TCP_PORT || '19128', 10);

const wss = new WebSocketServer({ port: WS_PORT });

console.log(`=======================================================`);
console.log(`[Avatar WebSocket Proxy] Running on port: ${WS_PORT}`);
console.log(`[Target Game Server] Forwarding to: ${TCP_HOST}:${TCP_PORT}`);
console.log(`=======================================================`);

let connectionCount = 0;

wss.on('connection', (ws, req) => {
  const clientId = ++connectionCount;
  const clientIp = req.socket.remoteAddress;
  console.log(`[WS-${clientId}] New web connection from ${clientIp}`);

  // Create TCP connection to Avatar Java Server
  const tcpClient = new net.Socket();

  tcpClient.connect(TCP_PORT, TCP_HOST, () => {
    console.log(`[WS-${clientId}] Connected to Avatar Java Server (${TCP_HOST}:${TCP_PORT})`);
  });

  // Forward incoming data from WebSocket (Browser) -> TCP (Java Server)
  ws.on('message', (data) => {
    try {
      tcpClient.write(data);
    } catch (err) {
      console.error(`[WS-${clientId}] Error writing to TCP:`, err.message);
    }
  });

  // Forward incoming data from TCP (Java Server) -> WebSocket (Browser)
  tcpClient.on('data', (data) => {
    try {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    } catch (err) {
      console.error(`[WS-${clientId}] Error sending to WS:`, err.message);
    }
  });

  // Handle Close & Error events
  ws.on('close', () => {
    console.log(`[WS-${clientId}] Browser disconnected`);
    tcpClient.destroy();
  });

  ws.on('error', (err) => {
    console.error(`[WS-${clientId}] WS Error:`, err.message);
    tcpClient.destroy();
  });

  tcpClient.on('close', () => {
    console.log(`[WS-${clientId}] TCP connection closed`);
    if (ws.readyState === ws.OPEN) {
      ws.close();
    }
  });

  tcpClient.on('error', (err) => {
    console.error(`[WS-${clientId}] TCP Error:`, err.message);
    if (ws.readyState === ws.OPEN) {
      ws.close();
    }
  });
});
