# 🎮 How to actually play Tekken 8 on a Potato

This guide explains how to use the **Anchor Network** to stream Tekken 8 from your Super Laptop to your Potato Laptop.

## 1. The Setup

**Host (Super Laptop)**:
- Must have Tekken 8 installed.
- Must run the Anchor Agent.
- Must have FFmpeg installed (recommended) OR use the Native GPU Module.

**Client (Potato Laptop)**:
- Must have VLC Media Player (for viewing).
- Must have Node.js (for sending controls - Phase 2).

---

## 2. Start the Host (Super Laptop)

1. **Install FFmpeg** (Vital for H.264 Encoding)
   - Download from: https://ffmpeg.org/download.html
   - Add to System PATH.
   - Verify: Type `ffmpeg -version` in terminal.

2. **Start the Backend** (on any machine, or the Host)
   ```powershell
   cd backend
   npm start
   ```

3. **Start the Agent**
   ```powershell
   # Join the network
   node src/agent.js http://localhost:5000
   ```

---

## 3. Trigger the Stream (The "Magic")

You need to tell the Host to start streaming. You can do this via the API (Postman/Curl).

**Send this Command:**
```bash
POST http://localhost:5000/api/tasks
Content-Type: application/json

{
  "name": "Tekken 8 Stream",
  "type": "provision",
  "payload": {
    "appType": "gaming",
    "image": "anchor/tekken8:native",
    "config": {
      "enableStreaming": true,
      "useFFmpeg": true,
      "streamTarget": "YOUR_POTATO_IP_ADDRESS", 
      "streamPort": 5000
    }
  },
  "requirements": {
    "gpuRequired": true
  }
}
```
*Replace `YOUR_POTATO_IP_ADDRESS` with the IP of your weak laptop.*

---

## 4. Watch on Potato Laptop

1. Open **VLC Media Player**.
2. Go to **Media -> Open Network Stream**.
3. Enter: `udp://@:5000`
4. Click **Play**.

**Result**: You should see your Super Laptop's screen (running Tekken) on your Potato Laptop with minimal latency.

---

## 5. Controls (Input Forwarding)

*Currently, the Input Forwarding is in Alpha.*
For now, pair a Bluetooth controller to the **Super Laptop** directly if within range.
(Phase 2 of development will add `robotjs` to tunnel keyboard inputs from Client -> Host).

---

## 🔧 Troubleshooting

- **Black Screen?**
  - Ensure FFmpeg is installed on the Host.
  - Check firewall (Allow UDP port 5000).

- **Lag?**
  - Use Ethernet cables, not Wi-Fi.
  - Decrease resolution on the Host.

- **"Encoder not found"?**
  - The script uses `libx264` (CPU encoding). If you have NVIDIA, you can edit `agent.js` to use `h264_nvenc` for zero CPU usage.

---

**Status**: REAL. NO FAKE BLOCKCHAIN. PURE STREAMING POWER.
