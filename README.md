# 👻 Ghost Cloud Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-9.0-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

**The Next-Generation Decentralized Cloud Computing Platform**

*Harness distributed computing power, blockchain verification, and decentralized storage in one unified ecosystem*

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [API Reference](#-api-reference)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Platform](#running-the-platform)
- [Platform Components](#-platform-components)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Blockchain Integration](#-blockchain-integration)
- [Node Client](#-node-client)
- [Configuration](#%EF%B8%8F-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

**Ghost Cloud Platform** is a revolutionary decentralized cloud computing ecosystem that transforms idle computing resources into a powerful distributed network. Built with cutting-edge technologies including .NET 9.0, Blazor Server, SignalR, and blockchain, Ghost Cloud enables:

- **Distributed Computing**: Execute tasks across a network of connected nodes
- **Decentralized Storage**: IPFS-inspired distributed file system
- **Blockchain Verification**: POW-based immutable transaction records
- **ML/AI Training**: Distributed machine learning across multiple nodes
- **Web Hosting**: Host applications on decentralized infrastructure
- **Real-time Streaming**: WebRTC-powered media streaming
- **Cloud Gaming**: Distributed GPU rendering for gaming workloads

The platform consists of two primary components:
1. **Ghost Web Application**: The central hub providing the web dashboard, API, and orchestration services
2. **Ghost Node Client**: Desktop application that connects devices to contribute computing resources

---

## 🚀 Key Features

### 💻 Distributed Computing Network
- **Task Distribution**: Intelligent task scheduling across connected nodes
- **Resource Pooling**: Aggregate CPU, RAM, and GPU resources from multiple devices
- **Docker Integration**: Isolated task execution in containerized environments
- **Load Balancing**: Automatic workload distribution based on node capabilities
- **Real-time Monitoring**: Live tracking of task execution and resource usage

### 🔗 Blockchain Technology
- **Proof-of-Work Consensus**: Secure transaction validation
- **Immutable Ledger**: Permanent record of all compute tasks and transactions
- **Cryptocurrency Wallet**: Built-in wallet system for Ghost tokens
- **Mining Rewards**: Node contributors earn tokens for compute contributions
- **Smart Contracts**: Automated task payment and verification

### 📦 Decentralized Storage
- **Distributed File System**: IPFS-inspired content-addressable storage
- **Redundancy**: Automatic file replication across multiple nodes
- **Content Deduplication**: Efficient storage using cryptographic hashing
- **P2P File Transfer**: Direct peer-to-peer file sharing
- **Encryption**: End-to-end encrypted file storage

### 🤖 Machine Learning & AI
- **Distributed Training**: Train ML models across multiple GPUs/CPUs
- **Framework Support**: TensorFlow, PyTorch, scikit-learn integration
- **Dataset Management**: Distributed dataset storage and versioning
- **Model Versioning**: Track and manage model iterations
- **Hyperparameter Tuning**: Parallel grid/random search across nodes

### 🎮 Cloud Gaming
- **GPU Rendering**: Distributed graphics processing
- **Low-latency Streaming**: WebRTC-based game streaming
- **Multi-node Rendering**: Aggregate GPU power for high-end graphics
- **Input Synchronization**: Real-time controller/keyboard input handling

### 🌐 Web Hosting
- **Decentralized Hosting**: Host websites across distributed nodes
- **DDoS Protection**: Natural resilience through distribution
- **Auto-scaling**: Dynamic resource allocation based on traffic
- **CDN Capabilities**: Content delivery from geographically distributed nodes

### 🔄 Real-time Communication
- **SignalR Hubs**: Bidirectional WebSocket communication
- **Live Updates**: Real-time dashboard metrics and notifications
- **Node Management**: Live connection status and health monitoring
- **Task Notifications**: Instant alerts on task completion and errors

### 🛡️ Security Features
- **JWT Authentication**: Secure API and dashboard access
- **End-to-End Encryption**: Encrypted data transmission
- **Sandboxed Execution**: Isolated task environments via Docker
- **Rate Limiting**: Protection against abuse and DDoS
- **Audit Logging**: Comprehensive activity tracking

---

## 🛠️ Technology Stack

### **Backend & Core**
| Technology | Version | Purpose |
|------------|---------|---------|
| **.NET** | 9.0 | Core framework |
| **ASP.NET Core** | 9.0 | Web server and API |
| **Blazor Server** | 9.0 | Interactive web UI |
| **SignalR** | Latest | Real-time communication |
| **Entity Framework Core** | 9.0 | ORM (if using SQL) |
| **C#** | 12.0 | Primary language |

### **Database & Storage**
| Technology | Purpose |
|------------|---------|
| **MongoDB** | Primary database for users, tasks, nodes |
| **SQLite** | Local caching (optional) |
| **Custom DFS** | Distributed file system |

### **Blockchain & Crypto**
| Component | Implementation |
|-----------|----------------|
| **Proof-of-Work** | Custom POW consensus algorithm |
| **SHA-256** | Block hashing |
| **ECDSA** | Transaction signatures |
| **Merkle Trees** | Transaction verification |

### **DevOps & Infrastructure**
| Technology | Purpose |
|------------|---------|
| **Docker** | Container runtime for task execution |
| **Kubernetes** | Container orchestration (deployment) |
| **Prometheus** | Metrics collection |
| **Grafana** | Metrics visualization |
| **Swagger/OpenAPI** | API documentation |

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **Blazor Components** | Interactive UI components |
| **Tailwind CSS** | Utility-first CSS framework |
| **GSAP** | Advanced animations |
| **Chart.js** | Data visualization |
| **WebRTC** | Peer-to-peer streaming |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Ghost Cloud Platform                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Web Application Layer                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │   Blazor     │  │   REST API   │  │   SignalR    │            │ │
│  │  │  Dashboard   │  │  Endpoints   │  │     Hub      │            │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Service Orchestration Layer                     │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │            GhostCloudOrchestrator (Central Hub)              │ │ │
│  │  │                                                              │ │ │
│  │  │  • Task Scheduler          • Node Registry                  │ │ │
│  │  │  • Resource Manager        • Load Balancer                  │ │ │
│  │  │  • Health Monitor           • Event Bus                     │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                                                                     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │
│  │  │  TaskScheduler│  │ NodeRegistry│  │TaskExecutor │              │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      Business Services Layer                       │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │  ML Training │  │ Web Hosting  │  │   Streaming  │            │ │
│  │  │   Service    │  │   Service    │  │   Service    │            │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │ Auth Service │  │ Node Contrib │  │Email Service │            │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Blockchain & Storage Layer                      │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │   Blockchain │  │ Distributed  │  │   P2P File   │            │ │
│  │  │  (POW Chain) │  │ File System  │  │   Transfer   │            │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      Data & Infrastructure Layer                   │ │
│  │                                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │ │
│  │  │   MongoDB    │  │   Local FS   │  │  Prometheus  │            │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                      ▲
                                      │ SignalR WebSocket
                                      │ (Real-time bidirectional)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Ghost Node Client (Desktop)                       │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  • SignalR Connection Manager    • Resource Monitor (CPU/RAM/GPU)  │ │
│  │  • Docker Task Executor           • Health Reporter                │ │
│  │  • Local File System Interface    • Mining Module                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      Docker Runtime Environment                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │
│  │  │  Python     │  │   Node.js   │  │   .NET      │  [Task Containers]│
│  │  │  Container  │  │  Container  │  │  Container  │                │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### **Component Interaction Flow**

```
User → Dashboard → REST API/SignalR Hub → Orchestrator
                                             ↓
                                    Task Scheduler
                                             ↓
                              ┌──────────────┴──────────────┐
                              ↓                             ↓
                         Node Registry              Blockchain Ledger
                              ↓                             ↓
                    [Distribute Task]                  [Record Tx]
                              ↓                             ↓
                         SignalR Hub                   Block Mining
                              ↓                             ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              Node Client 1        Node Client N
                    ↓                   ↓
              Docker Execute      Docker Execute
                    ↓                   ↓
              [Return Result]     [Return Result]
                    ↓                   ↓
                    └─────────┬─────────┘
                              ↓
                        Aggregate Results
                              ↓
                      Update Blockchain
                              ↓
                       Distribute Rewards
```

---

## 🚀 Getting Started

### Prerequisites

Before installing Ghost Cloud Platform, ensure you have the following installed:

#### **Required**
- **.NET SDK 9.0** or higher
  ```bash
  # Verify installation
  dotnet --version
  ```
  Download: https://dotnet.microsoft.com/download

- **Docker Desktop** (for task execution)
  ```bash
  # Verify installation
  docker --version
  ```
  Download: https://www.docker.com/products/docker-desktop

- **MongoDB** (database)
  ```bash
  # Verify installation
  mongod --version
  ```
  Download: https://www.mongodb.com/try/download/community
  
  **Alternative**: Use MongoDB Atlas (cloud-hosted)

#### **Optional (Recommended)**
- **Visual Studio 2022** or **Visual Studio Code**
- **Git** for version control
- **Node.js** (for frontend development)
- **Kubernetes** (for production deployment)

### Installation

#### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/ghost-cloud-platform.git
cd ghost-cloud-platform
```

#### **2. Configure MongoDB**

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `appsettings.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://username:password@cluster.mongodb.net",
    "DatabaseName": "ghost"
  }
}
```

#### **3. Configure Application Settings**

Edit `Ghost/appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Jwt": {
    "SecretKey": "YOUR-SECURE-SECRET-KEY-HERE-MINIMUM-32-CHARACTERS",
    "Issuer": "GhostCloud",
    "Audience": "GhostCloudUsers"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "FromEmail": "your-email@gmail.com",
    "Password": "your-app-password"
  },
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "ghost"
  },
  "GhostCloud": {
    "P2PPort": 6000,
    "StorageDirectory": "./ghost-storage",
    "MiningEnabled": true,
    "NodeType": "Master",
    "MaxConcurrentTasks": 10,
    "BlockchainDifficulty": 4,
    "MiningReward": 10.0
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5239"
      },
      "Https": {
        "Url": "https://localhost:7227"
      }
    }
  }
}
```

#### **4. Build the Solution**

```bash
# Build entire solution
dotnet build Ghost.sln --configuration Release

# Or build individual projects
cd Ghost
dotnet build --configuration Release

cd ../GhostNodeClient
dotnet build --configuration Release
```

#### **5. Initialize the Database**

The database will be automatically initialized on first run with seed data. To manually seed:

```bash
cd Ghost
dotnet run
# Wait for "✓ MongoDB initialized successfully" message
# Press Ctrl+C to stop
```

### Running the Platform

#### **Quick Start (Recommended)**

Use the provided batch script for Windows:

```bash
# From the root directory
./START-GHOST.bat
```

This script will:
1. ✅ Check if Docker is running (start if needed)
2. ✅ Build both projects
3. ✅ Start the Ghost Web Application
4. ✅ Start the Ghost Node Client
5. ✅ Open your browser to the dashboard

#### **Manual Start**

**Terminal 1: Start Web Application**
```bash
cd Ghost
dotnet run --configuration Release
```

Wait for the startup message:
```
╔══════════════════════════════════════════════════════════╗
║         GHOST CLOUD - DECENTRALIZED COMPUTING            ║
╚══════════════════════════════════════════════════════════╝

  🌐 Web Dashboard:  https://localhost:7227/dashboard
  📚 API Docs:       https://localhost:7227/swagger
  🏥 Health Check:   https://localhost:7227/health
  📊 Metrics:        https://localhost:7227/metrics
```

**Terminal 2: Start Node Client**
```bash
cd GhostNodeClient
dotnet run --configuration Release
```

#### **Development Mode (Hot Reload)**

```bash
# Terminal 1: Web App with hot reload
cd Ghost
dotnet watch run

# Terminal 2: Node Client with hot reload
cd GhostNodeClient
dotnet watch run
```

---

## 🧩 Platform Components

### **1. Web Application (`Ghost/`)**

The central hub of the Ghost Cloud Platform, providing:

#### **Pages & UI Components**
| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with platform overview |
| **Dashboard** | `/dashboard` | Real-time metrics and network status |
| **Sign In** | `/signin` | User authentication |
| **Sign Up** | `/signup` | User registration |
| **Profile** | `/profile` | User account management |
| **Compute** | `/compute` | Task submission and monitoring |
| **Storage** | `/storage` | File management interface |
| **Nodes** | `/nodes` | Connected node management |
| **ML Training** | `/mltraining` | Machine learning interface |
| **Documentation** | `/documentation` | Platform documentation |
| **API** | `/api` | API explorer |
| **Pricing** | `/pricing` | Pricing tiers |
| **About** | `/about` | About the platform |
| **Contact** | `/contact` | Contact form |
| **Blog** | `/blog` | News and updates |
| **Privacy** | `/privacy` | Privacy policy |
| **Terms** | `/terms` | Terms of service |

#### **API Controllers**
| Controller | Endpoint | Purpose |
|------------|----------|---------|
| **TasksController** | `/api/tasks` | Task management endpoints |
| **NodesController** | `/api/nodes` | Node registration and status |
| **FilesController** | `/api/files` | File upload/download |
| **BlockchainController** | `/api/blockchain` | Blockchain queries |
| **DashboardController** | `/api/dashboard` | Dashboard metrics |
| **MLTrainingController** | `/api/ml` | ML training endpoints |
| **HostingController** | `/api/hosting` | Web hosting management |
| **StreamingController** | `/api/streaming` | Media streaming |

#### **Core Services**
| Service | Responsibility |
|---------|----------------|
| **GhostCloudOrchestrator** | Central coordination and service management |
| **AuthService** | User authentication and authorization |
| **JwtService** | JWT token generation and validation |
| **EmailService** | Email notifications |
| **SessionManager** | User session management |
| **DistributedTaskExecutor** | Task execution coordination |
| **MLTrainingService** | Machine learning orchestration |
| **WebHostingService** | Website hosting management |
| **WebRTCStreamingService** | Real-time streaming |
| **NodeContributionService** | Mining and reward distribution |

#### **SignalR Hubs**
| Hub | Endpoint | Purpose |
|-----|----------|---------|
| **DeviceHub** | `/ghosthub` | Real-time node communication |

### **2. Node Client (`GhostNodeClient/`)**

The desktop application that connects devices to the network:

#### **Features**
- **Automatic Node Registration**: Connects to the web app and registers system resources
- **Resource Monitoring**: Tracks CPU, RAM, GPU, and storage availability
- **Task Execution**: Receives and executes tasks via Docker containers
- **Health Reporting**: Periodic health checks and status updates
- **Mining Capabilities**: Participates in blockchain mining for rewards
- **P2P Communication**: Direct file transfer between nodes

#### **System Requirements**
- **CPU**: Multi-core processor (4+ cores recommended)
- **RAM**: 8GB minimum, 16GB+ recommended
- **Storage**: 50GB+ free space
- **GPU**: Optional, for GPU-accelerated tasks
- **Network**: Stable internet connection
- **Docker**: Docker Desktop installed and running

---

## 📚 Usage Guide

### **Creating a User Account**

1. Navigate to `https://localhost:7227/signup`
2. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 8 characters)
   - Confirm Password
3. Click "Sign Up"
4. Check your email for verification (if email service configured)
5. Sign in at `https://localhost:7227/signin`

### **Connecting a Node**

#### **From Web Dashboard**
1. Sign in to your account
2. Go to **Dashboard** → **Connect Node**
3. Follow the instructions to download and run the Node Client

#### **Running Node Client**
```bash
cd GhostNodeClient
dotnet run
```

The client will:
1. Generate a unique Node ID (saved in `node_id.txt`)
2. Connect to the Ghost hub via SignalR
3. Register system resources (CPU cores, RAM, storage)
4. Start listening for tasks

### **Submitting a Compute Task**

#### **Via Web Dashboard**

1. Navigate to `/compute`
2. Fill out the task form:
   - **Task Name**: Descriptive name
   - **Task Type**: Select from dropdown
     - Docker Container
     - Python Script
     - ML Training
     - Data Processing
     - Video Encoding
     - 3D Rendering
   - **Resources**:
     - CPU cores needed
     - RAM (GB)
     - Storage (GB)
     - GPU (optional)
   - **Priority**: 1-10 (higher = more urgent)
   - **Code/Command**: Script or command to execute
3. Click "Submit Task to Network"
4. Monitor progress in the "Active Tasks" section

#### **Via REST API**

```bash
curl -X POST https://localhost:7227/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Data Processing Task",
    "type": "Python",
    "cpuCores": 2,
    "ramGb": 4,
    "storageGb": 10,
    "priority": 5,
    "code": "import pandas as pd\ndf = pd.read_csv(\"data.csv\")\nprint(df.describe())"
  }'
```

### **Uploading Files to Distributed Storage**

1. Go to `/storage`
2. Click "Upload File"
3. Select files from your computer
4. Files are automatically:
   - Hash-addressed using content hashing
   - Replicated across multiple nodes
   - Encrypted before transmission

### **Training Machine Learning Models**

1. Navigate to `/mltraining`
2. Click "New Training Job"
3. Configure:
   - **Model Type**: TensorFlow, PyTorch, scikit-learn
   - **Dataset**: Upload or reference from storage
   - **Hyperparameters**: Learning rate, epochs, batch size
   - **Resources**: Number of GPUs/CPUs
4. Click "Start Training"
5. Monitor training progress with real-time metrics
6. Download trained model when complete

### **Hosting a Website**

1. Go to `/hosting` (API endpoint)
2. Package your website files (HTML, CSS, JS)
3. Submit via API:

```bash
curl -X POST https://localhost:7227/api/hosting/deploy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@website.zip" \
  -F "subdomain=myapp"
```

Your site will be accessible at distributed nodes.

---

## 🔌 API Documentation

### **Base URL**
```
https://localhost:7227/api
```

### **Authentication**

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Obtaining a JWT Token**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-12-28T12:00:00Z",
  "userId": "user-id-here"
}
```

### **Task Management Endpoints**

#### **Create Task**
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Task Name",
  "type": "Python",
  "cpuCores": 2,
  "ramGb": 4,
  "storageGb": 10,
  "gpuCount": 0,
  "priority": 5,
  "code": "print('Hello from Ghost Cloud')",
  "dependencies": ["numpy", "pandas"]
}
```

**Response:**
```json
{
  "taskId": "task-abc-123",
  "status": "Queued",
  "estimatedCost": 0.05,
  "estimatedDuration": "00:02:30"
}
```

#### **Get Task Status**
```http
GET /api/tasks/{taskId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "task-abc-123",
  "name": "Task Name",
  "status": "Running",
  "progress": 45,
  "assignedNodeId": "node-xyz-789",
  "startTime": "2024-12-27T10:00:00Z",
  "estimatedCompletion": "2024-12-27T10:02:30Z",
  "result": null
}
```

#### **Cancel Task**
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}
```

#### **List All Tasks**
```http
GET /api/tasks?status=Running&limit=50&offset=0
Authorization: Bearer {token}
```

### **Node Management Endpoints**

#### **Register Node**
```http
POST /api/nodes/register
Content-Type: application/json

{
  "nodeId": "node-unique-id",
  "cpuCores": 8,
  "ramGb": 16,
  "storageGb": 500,
  "gpuCount": 1,
  "gpuModel": "NVIDIA RTX 3080"
}
```

#### **Get Node Status**
```http
GET /api/nodes/{nodeId}
```

**Response:**
```json
{
  "id": "node-xyz-789",
  "status": "Active",
  "cpuCores": 8,
  "ramGb": 16,
  "ramAvailable": 12.5,
  "storageGb": 500,
  "storageAvailable": 450,
  "activeTasks": 2,
  "completedTasks": 145,
  "uptime": "72:15:30",
  "earnings": 125.50
}
```

#### **List All Nodes**
```http
GET /api/nodes?status=Active
```

### **File Storage Endpoints**

#### **Upload File**
```http
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary file data]
```

**Response:**
```json
{
  "fileId": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "fileName": "data.csv",
  "size": 1048576,
  "contentHash": "sha256:abc123...",
  "replicationFactor": 3,
  "downloadUrl": "/api/files/download/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
}
```

#### **Download File**
```http
GET /api/files/download/{fileId}
Authorization: Bearer {token}
```

#### **Delete File**
```http
DELETE /api/files/{fileId}
Authorization: Bearer {token}
```

### **Blockchain Endpoints**

#### **Get Blockchain Stats**
```http
GET /api/blockchain/stats
```

**Response:**
```json
{
  "chainLength": 1523,
  "totalTransactions": 45782,
  "difficulty": 4,
  "hashRate": "125.5 MH/s",
  "lastBlockTime": "2024-12-27T12:05:00Z",
  "pendingTransactions": 12
}
```

#### **Get Block by Number**
```http
GET /api/blockchain/blocks/{blockNumber}
```

#### **Get Transaction**
```http
GET /api/blockchain/transactions/{txHash}
```

### **Dashboard Metrics**

#### **Get Platform Stats**
```http
GET /api/dashboard/stats
```

**Response:**
```json
{
  "activeNodes": 25,
  "totalCpuCores": 200,
  "totalRamGb": 400,
  "activeTasks": 15,
  "completedTasksToday": 342,
  "totalStorageGb": 12500,
  "usedStorageGb": 8750
}
```

### **Swagger Interactive Documentation**

Access the interactive API documentation at:
```
https://localhost:7227/swagger
```

This provides:
- Complete API reference
- Try-it-now functionality
- Request/response schemas
- Authentication testing

---

## ⛓️ Blockchain Integration

Ghost Cloud uses a custom Proof-of-Work blockchain for transaction verification and reward distribution.

### **Blockchain Architecture**

#### **Block Structure**
```csharp
public class Block
{
    public int Index { get; set; }                    // Block number
    public string PreviousHash { get; set; }          // Hash of previous block
    public long Timestamp { get; set; }               // Unix timestamp
    public List<Transaction> Transactions { get; set; } // Block transactions
    public int Nonce { get; set; }                    // Mining nonce
    public string Hash { get; set; }                  // Block hash
}
```

#### **Transaction Structure**
```csharp
public class Transaction
{
    public string Id { get; set; }              // Unique transaction ID
    public string From { get; set; }            // Sender wallet address
    public string To { get; set; }              // Recipient wallet address
    public double Amount { get; set; }          // Token amount
    public long Timestamp { get; set; }         // Transaction time
    public string Type { get; set; }            // "TaskPayment", "Mining", "Transfer"
    public string Signature { get; set; }       // Digital signature
    public Dictionary<string, object> Metadata { get; set; } // Additional data
}
```

### **Mining Process**

1. **Task Completion**: When a node completes a task
2. **Transaction Creation**: System creates a reward transaction
3. **Block Formation**: Transactions are grouped into a block
4. **Mining**: Find nonce where `SHA256(block) < target`
5. **Validation**: Other nodes validate the block
6. **Chain Addition**: Valid block added to blockchain
7. **Reward Distribution**: Tokens credited to miner's wallet

### **Consensus Algorithm**

**Proof-of-Work (POW) Parameters:**
- **Difficulty**: 4 (default, configurable in appsettings.json)
- **Target**: Hash must start with 4 zeros
- **Block Time**: ~10 seconds target
- **Reward**: 10 Ghost tokens per block

**Difficulty Adjustment:**
```csharp
// Adjusts every 10 blocks based on block time
if (blockNumber % 10 == 0)
{
    double actualTime = CalculateAverageBlockTime(lastBlocks);
    double targetTime = 10.0; // seconds
    
    if (actualTime < targetTime * 0.75)
        difficulty++;
    else if (actualTime > targetTime * 1.25)
        difficulty--;
}
```

### **Wallet System**

#### **Creating a Wallet**
```csharp
// Wallet is automatically created on user registration
var wallet = new Wallet();
// Generates ECDSA keypair
// Public key becomes wallet address
```

#### **Checking Balance**
```http
GET /api/wallet/balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "balance": 125.50,
  "pendingRewards": 10.0
}
```

#### **Transaction History**
```http
GET /api/wallet/transactions?limit=50
Authorization: Bearer {token}
```

---

## 🖥️ Node Client

### **Architecture**

The Ghost Node Client is a lightweight desktop application that:
- Connects to the Ghost Cloud hub
- Contributes system resources
- Executes distributed tasks
- Participates in mining

### **Installation & Setup**

#### **Building from Source**
```bash
cd GhostNodeClient
dotnet build --configuration Release
```

#### **Running**
```bash
dotnet run --configuration Release
```

Or create an executable:
```bash
dotnet publish --configuration Release --self-contained --runtime win-x64
# Executable will be in bin/Release/net9.0/win-x64/publish/
```

### **Configuration**

Edit connection settings in the code or via command-line arguments:

```csharp
// Default connection
var hubUrl = "https://localhost:7227/ghosthub";

// Or specify:
dotnet run -- --hub-url https://your-server.com/ghosthub
```

### **Node Operations**

#### **Automatic Operations**
1. **Startup**:
   - Generate/load Node ID
   - Detect system resources (CPU, RAM, storage, GPU)
   - Connect to SignalR hub
2. **Registration**:
   - Send registration message with capabilities
   - Receive confirmation and node status
3. **Health Monitoring**:
   - Report metrics every 30 seconds
   - Update available resources
4. **Task Execution**:
   - Receive task from hub
   - Pull Docker image if needed
   - Execute in isolated container
   - Report progress and results
5. **Mining**:
   - Listen for mining opportunities
   - Participate in block validation

#### **Manual Operations**

**View Node Status:**
```bash
# Node automatically logs status to console
[INFO] Node ID: abc-123-def
[INFO] Status: Active
[INFO] Connected: Yes
[INFO] Active Tasks: 2
[INFO] Earnings: 45.25 Ghost tokens
```

**Stop Node Gracefully:**
Press `Ctrl+C` - the client will:
1. Finish active tasks
2. Notify server of shutdown
3. Clean up Docker containers
4. Save state and exit

### **Docker Integration**

The node client uses Docker to execute tasks in isolated environments:

#### **Supported Runtimes**
- **Python**: `python:3.11-slim`
- **Node.js**: `node:20-alpine`
- **.NET**: `mcr.microsoft.com/dotnet/sdk:9.0`
- **Custom**: User-specified images

#### **Task Execution Flow**
```
1. Receive Task → 2. Pull Docker Image → 3. Create Container
                                                ↓
                                        4. Mount Volumes
                                                ↓
                                        5. Execute Task
                                                ↓
                                        6. Capture Output
                                                ↓
                                        7. Cleanup Container
                                                ↓
                                        8. Return Results
```

#### **Resource Limits**
Docker containers are constrained based on task requirements:
```bash
docker run \
  --cpus=2.0 \
  --memory=4g \
  --storage-opt size=10g \
  --gpus all \  # If GPU requested
  ...
```

### **Firewall Configuration**

Open required ports:
- **Outbound HTTPS** (443): For hub connection
- **Outbound HTTP** (80): For Docker image pulls
- **P2P Port** (6000): For direct node communication

---

## ⚙️ Configuration

### **Environment Variables**

You can override settings using environment variables:

```bash
# MongoDB
export MongoDB__ConnectionString="mongodb://custom:27017"
export MongoDB__DatabaseName="ghost_production"

# JWT
export Jwt__SecretKey="your-production-secret-key"

# Ghost Cloud
export GhostCloud__P2PPort=6000
export GhostCloud__BlockchainDifficulty=5
export GhostCloud__MiningReward=15.0

# Kestrel
export ASPNETCORE_URLS="https://+:7227;http://+:5239"
```

### **Configuration Files**

#### **appsettings.json** (Development)
Default settings for local development

#### **appsettings.Production.json** (Production)
Production-specific overrides:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  },
  "MongoDB": {
    "ConnectionString": "mongodb+srv://prod-user:password@cluster.mongodb.net",
    "DatabaseName": "ghost_prod"
  },
  "Jwt": {
    "SecretKey": "PRODUCTION-SECRET-KEY-STRONG-AND-UNIQUE",
    "Issuer": "GhostCloud",
    "Audience": "GhostCloudUsers"
  },
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://+:443",
        "Certificate": {
          "Path": "/path/to/certificate.pfx",
          "Password": "cert-password"
        }
      }
    }
  }
}
```

### **Docker Compose Configuration**

For containerized deployment:

```yaml
# docker-compose.yml
version: '3.8'

services:
  ghost-web:
    build:
      context: ./Ghost
      dockerfile: Dockerfile
    ports:
      - "7227:7227"
      - "5239:5239"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - MongoDB__ConnectionString=mongodb://mongo:27017
    depends_on:
      - mongo
    volumes:
      - ./ghost-storage:/app/ghost-storage

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  mongo-data:
  ghost-storage:
```

---

## 💻 Development

### **Setting Up Development Environment**

#### **Visual Studio 2022**
1. Open `Ghost.sln`
2. Set `Ghost` as startup project
3. Press F5 to run with debugging

#### **Visual Studio Code**
1. Open the workspace folder
2. Install recommended extensions:
   - C# Dev Kit
   - C#
   - Docker
3. Use tasks:
   - `Ctrl+Shift+B`: Build
   - `F5`: Debug

### **Running Tests**

```bash
# Run all tests
dotnet test Ghost.sln

# Run with coverage
dotnet test /p:CollectCoverage=true /p:CoverageReportFormat=opencover

# Run specific test project
dotnet test Ghost.Tests/Ghost.Tests.csproj
```

### **Code Structure**

```
Ghost/
├── Components/
│   ├── Pages/           # Blazor pages
│   ├── Layout/          # Layout components
│   └── App.razor        # App root
├── Controllers/         # API controllers
├── Services/            # Business logic
├── Blockchain/          # Blockchain implementation
├── Compute/             # Task scheduling & execution
├── Storage/             # Distributed file system
├── Hubs/                # SignalR hubs
├── Data/                # Database contexts
├── Models/              # Data models
├── Monitoring/          # Metrics and logging
└── wwwroot/             # Static assets
```

### **Adding a New Feature**

**Example: Adding a new task type**

1. **Define the task type**:
```csharp
// Compute/TaskTypes.cs
public enum TaskType
{
    Docker,
    Python,
    MLTraining,
    VideoEncoding,
    NewTaskType  // Add here
}
```

2. **Implement execution logic**:
```csharp
// Services/NewTaskTypeExecutor.cs
public class NewTaskTypeExecutor
{
    public async Task<TaskResult> ExecuteAsync(ComputeTask task)
    {
        // Implementation
    }
}
```

3. **Register in DI**:
```csharp
// Program.cs
builder.Services.AddSingleton<NewTaskTypeExecutor>();
```

4. **Add UI component**:
```razor
<!-- Components/Pages/NewFeature.razor -->
@page "/newfeature"
<h1>New Feature</h1>
```

### **Debugging**

#### **Debugging Web App**
```bash
cd Ghost
dotnet run
# Attach debugger from IDE
```

#### **Debugging Node Client**
```bash
cd GhostNodeClient
dotnet run
# Attach debugger
```

#### **Debugging Docker Tasks**
```bash
# View container logs
docker logs <container-id>

# Execute into container
docker exec -it <container-id> /bin/bash
```

### **Contributing Guidelines**

See [Contributing](#-contributing) section below.

---

## 🚀 Deployment

### **Production Deployment Options**

#### **Option 1: Docker Deployment**

```bash
# Build images
docker build -t ghost-web:latest ./Ghost
docker build -t ghost-node:latest ./GhostNodeClient

# Run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f ghost-web
```

#### **Option 2: Kubernetes Deployment**

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ghost-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ghost-web
  template:
    metadata:
      labels:
        app: ghost-web
    spec:
      containers:
      - name: ghost-web
        image: your-registry/ghost-web:latest
        ports:
        - containerPort: 7227
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: MongoDB__ConnectionString
          valueFrom:
            secretKeyRef:
              name: ghost-secrets
              key: mongodb-connection
```

Deploy:
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f deployment/ghost-web
```

#### **Option 3: Azure Deployment**

```bash
# Create Azure App Service
az webapp create \
  --resource-group ghost-rg \
  --plan ghost-plan \
  --name ghost-cloud-app \
  --runtime "DOTNET|9.0"

# Deploy
dotnet publish -c Release
cd Ghost/bin/Release/net9.0/publish
zip -r release.zip .
az webapp deployment source config-zip \
  --resource-group ghost-rg \
  --name ghost-cloud-app \
  --src release.zip
```

### **SSL Certificate Setup**

#### **Development (Self-signed)**
```bash
dotnet dev-certs https --trust
```

#### **Production (Let's Encrypt)**
```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure in appsettings.Production.json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://+:443",
        "Certificate": {
          "Path": "/etc/letsencrypt/live/yourdomain.com/fullchain.pem",
          "KeyPath": "/etc/letsencrypt/live/yourdomain.com/privkey.pem"
        }
      }
    }
  }
}
```

### **Monitoring Setup**

#### **Prometheus Configuration**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ghost-cloud'
    static_configs:
      - targets: ['localhost:7227']
```

#### **Grafana Dashboards**
1. Install Grafana
2. Add Prometheus as data source
3. Import Ghost Cloud dashboard:
   - Node metrics
   - Task throughput
   - Blockchain stats
   - System resources

---

## 🔒 Security

### **Security Features**

#### **1. Authentication & Authorization**
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: BCrypt with salt
- **Role-based Access**: Admin, User, Node roles
- **Session Management**: Secure session handling

#### **2. Data Protection**
- **Encryption at Rest**: MongoDB encrypted volumes
- **Encryption in Transit**: TLS 1.3 for all communications
- **File Encryption**: AES-256 for stored files
- **Blockchain Signatures**: ECDSA for transaction verification

#### **3. Network Security**
- **CORS**: Configured allowed origins
- **Rate Limiting**: API request throttling
- **DDoS Protection**: Distributed nature provides resilience
- **Firewall Rules**: Restrict port access

#### **4. Container Security**
- **Sandboxing**: Tasks run in isolated Docker containers
- **Resource Limits**: CPU/RAM/storage caps
- **No Privileged Mode**: Containers run without elevated permissions
- **Image Scanning**: Verify Docker images before execution

### **Security Best Practices**

#### **For Administrators**
1. **Change default secrets** in appsettings.json
2. **Use strong passwords** for database and admin accounts
3. **Enable HTTPS** in production
4. **Regular updates**: Keep .NET and dependencies updated
5. **Backup data**: Regular MongoDB backups
6. **Monitor logs**: Check for suspicious activity

#### **For Node Operators**
1. **Keep Docker updated**
2. **Monitor resource usage** for anomalies
3. **Use firewall** to restrict unnecessary access
4. **Don't run as root** (Linux)
5. **Verify server identity** before connecting

#### **For Users**
1. **Use strong passwords**
2. **Enable 2FA** (if implemented)
3. **Don't share credentials**
4. **Verify task code** before submission
5. **Monitor account activity**

---

## ⚡ Performance

### **Optimization Strategies**

#### **Database**
- **Indexing**: Create indexes on frequently queried fields
```javascript
// MongoDB indexes
db.tasks.createIndex({ "status": 1, "createdAt": -1 })
db.nodes.createIndex({ "status": 1, "cpuCores": -1 })
db.transactions.createIndex({ "timestamp": -1 })
```

- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Use projections and limit results

#### **Caching**
- **In-Memory Cache**: Frequently accessed data
- **Redis** (Optional): Distributed caching for scalability
```csharp
builder.Services.AddMemoryCache();
builder.Services.AddDistributedMemoryCache();
```

#### **API Performance**
- **Response Compression**: Gzip/Brotli
- **Pagination**: Limit result sets
- **Async Operations**: Non-blocking I/O
- **CDN**: Static assets via CDN

#### **SignalR Optimization**
- **Backplane**: Use Redis for multi-server deployment
```csharp
builder.Services.AddSignalR()
    .AddStackExchangeRedis("localhost:6379");
```

### **Scaling Strategies**

#### **Horizontal Scaling**
- **Load Balancer**: Distribute traffic across multiple web servers
- **Multiple Node Clients**: Add more compute nodes
- **Database Sharding**: Partition data across MongoDB instances

#### **Vertical Scaling**
- **Increase server resources**: More CPU/RAM
- **Optimize database**: Higher IOPS storage
- **GPU acceleration**: For ML/rendering tasks

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. MongoDB Connection Failed**

**Symptoms:**
```
⚠ MongoDB initialization warning: Unable to connect to MongoDB
```

**Solutions:**
- Verify MongoDB is running: `mongod --version`
- Check connection string in appsettings.json
- Ensure firewall allows port 27017
- For MongoDB Atlas: Check IP whitelist

#### **2. Docker Not Found**

**Symptoms:**
```
Error: Docker daemon is not running
```

**Solutions:**
- Start Docker Desktop
- On Linux: `sudo systemctl start docker`
- Verify: `docker ps`

#### **3. Node Client Can't Connect**

**Symptoms:**
```
[ERROR] Failed to connect to hub: Connection timeout
```

**Solutions:**
- Verify web app is running
- Check hub URL matches server URL
- Ensure firewall allows outbound HTTPS (port 443)
- Check antivirus/firewall software

#### **4. Build Errors**

**Symptoms:**
```
error CS0246: The type or namespace name could not be found
```

**Solutions:**
```bash
# Restore NuGet packages
dotnet restore Ghost.sln

# Clean and rebuild
dotnet clean
dotnet build
```

#### **5. Port Already in Use**

**Symptoms:**
```
Unable to bind to https://localhost:7227
```

**Solutions:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :7227
taskkill /PID <process-id> /F

# Linux/Mac
lsof -ti:7227 | xargs kill -9

# Or change port in appsettings.json
```

### **Debug Mode**

Enable detailed logging:

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Debug",
      "Microsoft.AspNetCore.SignalR": "Trace",
      "Ghost": "Trace"
    }
  }
}
```

### **Health Checks**

```bash
# Check platform health
curl https://localhost:7227/health

# Check metrics
curl https://localhost:7227/metrics

# Check API
curl https://localhost:7227/swagger
```

---

## 🤝 Contributing

We welcome contributions to Ghost Cloud Platform!

### **How to Contribute**

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ghost-cloud-platform.git
   cd ghost-cloud-platform
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow C# coding conventions
   - Add unit tests for new features

4. **Test thoroughly**
   ```bash
   dotnet test
   dotnet build --configuration Release
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for code review

### **Development Guidelines**

#### **Code Style**
- Follow Microsoft C# coding conventions
- Use async/await for I/O operations
- Keep methods focused and small
- Write XML documentation comments for public APIs

#### **Testing**
- Write unit tests for business logic
- Integration tests for API endpoints
- Aim for >80% code coverage

#### **Documentation**
- Update README for new features
- Add XML comments to public classes/methods
- Include examples in documentation

---

## 🗺️ Roadmap

### **Version 1.0** (Current)
- ✅ Core distributed computing platform
- ✅ POW blockchain implementation
- ✅ Distributed file storage
- ✅ Real-time SignalR communication
- ✅ Docker-based task execution
- ✅ Web dashboard and API

### **Version 1.5** (Q1 2025)
- 🔲 Smart contracts for automated task payments
- 🔲 Advanced ML model marketplace
- 🔲 GPU rendering optimization
- 🔲 Enhanced WebRTC streaming
- 🔲 Mobile app (iOS/Android)
- 🔲 Multi-language support

### **Version 2.0** (Q2 2025)
- 🔲 Proof-of-Stake consensus option
- 🔲 Sharding for blockchain scalability
- 🔲 Kubernetes orchestration enhancements
- 🔲 AI-powered task optimization
- 🔲 Decentralized governance (DAO)
- 🔲 Cross-chain bridge integration

### **Future Considerations**
- Federation with other decentralized networks
- Quantum-resistant cryptography
- Edge computing integration
- 5G optimization for low-latency tasks

---

## 📄 License

```
MIT License

Copyright (c) 2024 Ghost Cloud Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

### **Get Help**
- **Documentation**: This README and `/documentation` page
- **Issues**: [GitHub Issues](https://github.com/yourusername/ghost-cloud-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ghost-cloud-platform/discussions)
- **Discord**: [Join our community](#) (if applicable)

### **Project Links**
- **Website**: https://ghostcloud.io (if deployed)
- **API Docs**: https://localhost:7227/swagger
- **Blog**: https://localhost:7227/blog

### **Contact**
- **Email**: support@ghostcloud.io
- **Twitter**: @GhostCloud (if applicable)
- **LinkedIn**: Ghost Cloud Platform (if applicable)

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- **Microsoft .NET** - Core framework
- **MongoDB** - NoSQL database
- **Docker** - Containerization
- **SignalR** - Real-time communication
- **GSAP** - Animations
- **And many more** - See dependencies in .csproj files

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ghost-cloud-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ghost-cloud-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ghost-cloud-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ghost-cloud-platform)

---

<div align="center">

**Made with ❤️ by the Ghost Cloud Team**

*Empowering the decentralized computing revolution*

[⬆ Back to Top](#-ghost-cloud-platform)

</div>
