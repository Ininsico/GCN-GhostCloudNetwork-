# Anchor - Decentralized Cloud Computing Platform

**Anchor** is a next-generation decentralized cloud computing platform designed to challenge centralized giants like AWS. It leverages a distributed network of nodes to provide scalable, secure, and cost-effective computing resources. By utilizing peer-to-peer networking and blockchain principles, Anchor enables users to rent out their idle computing power or consume resources in a truly decentralized manner.

> **Note:** This project is currently in active development, moving from a Node-based REX demo to a production-grade distributed compute network.

## 🚀 Features

- **Decentralized Orchestration**: Automated task distribution across a global network of nodes.
- **P2P Networking**: Direct node-to-node communication using `libp2p` for reduced latency and resilience.
- **Real-time Monitoring**: Live tracking of system resources (CPU, RAM, GPU) across the mesh.
- **Secure Execution**: Sandboxed environments for running user workloads (roadmap includes Firecracker/gVisor integration).
- **Marketplace Model**: dynamic pricing and matching for compute resources.

## 🏗️ Architecture

The project is divided into two main components:

### 1. Backend (`/backend`)
The core logic of the network, handling:
- **API Server**: Express.js REST API for user management and task submission.
- **P2P Node**: Libp2p integration for discovery and communication.
- **Orchestrator**: Manages task scheduling and node selection.
- **Database**: MongoDB for persistent storage of user data and transaction logs.

**Key Technologies:**
- Node.js & Express
- MongoDB (Mongoose)
- Libp2p (Gossipsub, Kademlia DHT)
- BullMQ (Job queues)
- JWT Authentication

### 2. Frontend (`/frontend`)
A modern, responsive dashboard for users to interact with the platform:
- **Dashboard**: Visualize network status, connected nodes, and running tasks.
- **Terminal**: Direct interaction with cloud resources.
- **Wallet**: Manage earnings and payments.

**Key Technologies:**
- React (Vite)
- TypeScript
- TailwindCSS (if applicable, based on modern standards)
- Recharts (for analytics)

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local instance or Atlas connection

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/anchor.git
    cd anchor
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in `backend/` based on your needs (see `backend/.env.example` if available, or use the following defaults):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/auth_app
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in `frontend/` if required for API endpoints:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### Running the Application

**Start the Backend:**
```bash
cd backend
npm run dev
```
*The server will start on http://localhost:5000*

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
*The application will pass be accessible at http://localhost:5173*

## 🤝 Contributing

We welcome contributions! Please see the `TECHNICAL_README.md` for our current roadmap and low-level technical objectives, including:
- V8 Isolate Integration
- Native GPU Capture
- WebRTC DataChannels

## 📄 License

This project is licensed under the MIT License.
