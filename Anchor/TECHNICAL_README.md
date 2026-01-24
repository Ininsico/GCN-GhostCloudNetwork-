# Anchor Network: Production Roadmap & Hardening Guide

This document outlines the specific, low-level technical upgrades required to move Anchor from a **Node-based REX demo** to a **Production-Grade distributed compute network**.

## 1. Execution Layer: Moving Beyond `console.log`
Currently, the agent uses `child_process.exec`. For production, we must transition to high-performance, isolated runtimes.
- **V8 Isolate Integration**: Replace `exec` with a library like `isolated-vm`. This allows running user scripts in a true V8 sandbox with millisecond-accurate RAM limits and no access to the host `fs` or `net` modules unless explicitly piped.
- **Native GPU Seizure (C++)**: To make Cloud Gaming/AI real, implement a native Node-addon (using N-API) that performs **DirectX/Vulkan buffer capture**. This replaces "simulated" streaming with a real H.264/H.265 video feed pushed over UDT (UDP-based Data Transfer).
- **WASM (WebAssembly) Runtime**: Add a third execution mode for heavy math tasks. Compiling user tasks to WASM ensures near-native speed with absolute memory safety.

## 2. P2P Networking: Real Tunneling (Not WebSockets)
The current "tunnel" is a WebSocket proxy. For gaming and high-speed data, we need a real **Mesh Network**.
- **WireGuard Integration**: Package a Micro-WireGuard client within `setup_node`. When a task is assigned, the Agent and the User create a **Point-to-Point UDP tunnel**. This bypasses NAT and reduces latency to physical fiber limits.
- **WebRTC DataChannels**: Use WebRTC for the frontend-to-node bridge. This allows the browser to receive the video stream/data directly from the PC running the game, completely removing the backend server from the data path.

## 3. Distributed Compute (Advanced Map-Reduce)
Our current slicing is basic. Production requires a **Distributed Task Graph**.
- **DAG (Directed Acyclic Graph) Scheduler**: Update the `orchestrator.js` to handle complex multi-step tasks (e.g., Task B only starts when Node 1 and Node 2 finish Task A).
- **Result Verification (PoW/PoS)**: Implement "Consensus Check." Send the same "chunk" to two different nodes. If their results don't match, flag the nodes for integrity review. This prevents "cheating" nodes from returning fake data.

## 4. Security & Isolation (Kernel Hardening)
- **gVisor / Firecracker**: Instead of just Docker, use Micro-VMs (Firecracker) to run "Gaming" or "Compute" workloads. This prevents any possibility of a script escaping to the host machine's kernel.
- **Hardware Attestation**: Use TPM (Trusted Platform Module) to verify that the node connecting is real hardware and hasn't been modified to spoof its specs.

## 5. Deployment Roadmap (The Next 3 Practical Steps)

| Step | Action | Practical Result |
| :--- | :--- | :--- |
| **1. ffmpeg Pipeline** | Install `ffmpeg` via the `setup_node` script. | Allows the Agent to capture the real screen and stream it to the dashboard. |
| **2. isolated-vm** | Replace the REX execution logic with a gated V8 Isolate. | Users can run code safely without being able to delete the host's files. |
| **3. STUN/TURN Setup** | Deploy a global STUN server for the `agent.js`. | Real P2P connectivity that works even behind office firewalls or 4G/5G. |

---

## 🛠️ THE PRACTICAL UPGRADE CHECKLIST
- [ ] Replace `exec` with `spawn` + `stream` for real-time log tailing in the UI.
- [ ] Implement `pm2` logic in the Agent to keep V-Apps alive if the agent restarts.
- [ ] Add `GPU-Scan` functionality in `si.currentLoad()` to report RTX/NVIDIA specific thermal data.

**The "Ghost" is real when the latency is <10ms and the isolation is unbreakable.**
