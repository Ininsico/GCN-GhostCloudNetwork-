# ANCHOR NETWORK: AUTOMATED NODE PROVISIONER (WINDOWS)
# This script installs all necessary dependencies to turn a standard PC into a high-performance Ghost Architecture Node.

Write-Host "--- ANCHOR NETWORK: BOOTSTRAPPER ---" -ForegroundColor Cyan

# 1. Check for Admin Rights
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator to install system-level dependencies (Docker/Node.js)."
    Exit
}

# 2. Install Node.js if missing
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[1/3] Node.js missing. Installing via Winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS
} else {
    Write-Host "[OK] Node.js detected." -ForegroundColor Green
}

# 3. Handle Docker (The Virtualization Engine)
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[2/3] Docker missing. Redirecting to official installer..." -ForegroundColor Yellow
    Write-Host "Opening Docker Desktop download page. Please install and restart the script."
    Start-Process "https://www.docker.com/products/docker-desktop/"
} else {
    Write-Host "[OK] Docker Engine detected." -ForegroundColor Green
}

# 4. Clone/Download Agent
Write-Host "[3/3] Initializing Anchor Agent..." -ForegroundColor Yellow
npm install

# 5. Launch
Write-Host "--- SETUP COMPLETE ---" -ForegroundColor Cyan
Write-Host "Connecting to Anchor Aggregator..."
node src/agent.js http://localhost:5000
