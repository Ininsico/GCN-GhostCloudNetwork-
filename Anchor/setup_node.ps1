# ANCHOR NETWORK: ZERO-DEPENDENCY NODE PROVISIONER (WINDOWS)
# This script installs ONLY what's needed to run an Anchor node
# Docker is OPTIONAL - the system works without it

Write-Host "`n=== ANCHOR NETWORK: AUTOMATED SETUP ===" -ForegroundColor Cyan
Write-Host "Setting up your PC as a distributed compute node...`n" -ForegroundColor Gray

# 1. Check for Admin Rights
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "This script needs Administrator privileges to install system dependencies."
    Write-Host "Please right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    Exit
}

# 2. Install Node.js (REQUIRED)
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  Installing Node.js LTS via winget..." -ForegroundColor Cyan
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "  ✓ Node.js installed" -ForegroundColor Green
}
else {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js detected: $nodeVersion" -ForegroundColor Green
}

# 3. Install Redis (REQUIRED for production task queues)
Write-Host "`n[2/4] Checking Redis..." -ForegroundColor Yellow
if (-not (Get-Command redis-server -ErrorAction SilentlyContinue)) {
    Write-Host "  Redis not found. Installing via Chocolatey..." -ForegroundColor Cyan
    
    # Install Chocolatey if missing
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "  Installing Chocolatey package manager..." -ForegroundColor Cyan
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    }
    
    # Install Redis
    choco install redis-64 -y
    
    # Start Redis service
    Start-Service Redis
    
    Write-Host "  ✓ Redis installed and running" -ForegroundColor Green
}
else {
    Write-Host "  ✓ Redis detected" -ForegroundColor Green
    
    # Ensure Redis is running
    try {
        Start-Service Redis -ErrorAction SilentlyContinue
        Write-Host "  ✓ Redis service started" -ForegroundColor Green
    }
    catch {
        Write-Host "  ⚠ Redis service not configured. Will use localhost:6379" -ForegroundColor Yellow
    }
}

# 4. Docker Check (OPTIONAL - NOT REQUIRED)
Write-Host "`n[3/4] Checking Docker..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "  Docker not found - THAT'S OK!" -ForegroundColor Green
    Write-Host "  Anchor uses Native Runtime (no Docker needed)" -ForegroundColor Cyan
    Write-Host "  Your node will run apps directly on Node.js" -ForegroundColor Gray
}
else {
    Write-Host "  ✓ Docker detected (optional enhancement available)" -ForegroundColor Green
}

# 5. Install Node Dependencies
Write-Host "`n[4/4] Installing Anchor dependencies..." -ForegroundColor Yellow
cd $PSScriptRoot

if (Test-Path "package.json") {
    npm install --production
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ package.json not found. Make sure you're in the Anchor directory." -ForegroundColor Yellow
}

# 6. Build native GPU addon (if possible)
Write-Host "`nBuilding native GPU module..." -ForegroundColor Yellow
if (Test-Path "backend\src\native\binding.gyp") {
    cd backend\src\native
    npm install --build-from-source 2>$null
    
    if (Test-Path "build\Release\ghost_gpu_seizure.node") {
        Write-Host "  ✓ GPU capture module compiled" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ GPU module build failed (optional feature)" -ForegroundColor Yellow
    }
    cd $PSScriptRoot
}

# 7. Configuration
Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Cyan
Write-Host "`nYour PC is now ready to join the Anchor Network!" -ForegroundColor Green
Write-Host "`nREQUIRED:" -ForegroundColor White
Write-Host "  ✓ Node.js" -ForegroundColor Green
Write-Host "  ✓ Redis (for task queues)" -ForegroundColor Green
Write-Host "`nOPTIONAL:" -ForegroundColor White
Write-Host "  - Docker (for container workloads)" -ForegroundColor Gray
Write-Host "  - GPU Module (for screen streaming)" -ForegroundColor Gray

Write-Host "`n--- STARTING AGENT ---`n" -ForegroundColor Cyan

# 8. Launch Agent
$backendUrl = Read-Host "Enter backend URL (default: http://localhost:5000)"
if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    $backendUrl = "http://localhost:5000"
}

Write-Host "Connecting to $backendUrl..." -ForegroundColor Cyan
node backend\src\agent.js $backendUrl
