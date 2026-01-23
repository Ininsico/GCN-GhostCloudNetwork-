#!/bin/bash
# ANCHOR NETWORK: AUTOMATED NODE PROVISIONER (LINUX)

echo "--- ANCHOR NETWORK: BOOTSTRAPPER ---"

# 1. Update & Install Node.js
if ! command -v node &> /dev/null
then
    echo "[1/3] Node.js missing. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "[OK] Node.js detected."
fi

# 2. Install Docker
if ! command -v docker &> /dev/null
then
    echo "[2/3] Docker missing. Installing..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
else
    echo "[OK] Docker Engine detected."
fi

# 3. Setup Agent
echo "[3/3] Initializing Anchor Agent..."
npm install

# 4. Launch
echo "--- SETUP COMPLETE ---"
node src/agent.js http://localhost:5000
