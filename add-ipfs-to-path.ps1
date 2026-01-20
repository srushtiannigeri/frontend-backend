# Script to add IPFS CLI to PATH (if IPFS Desktop is installed)
# Run this as Administrator

$ipfsDesktopPath = "$env:LOCALAPPDATA\Programs\IPFS Desktop"
$ipfsExePath = Get-ChildItem -Path $ipfsDesktopPath -Recurse -Filter "ipfs.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if ($ipfsExePath) {
    $ipfsDir = Split-Path -Parent $ipfsExePath
    Write-Host "Found IPFS at: $ipfsDir" -ForegroundColor Green
    
    # Add to user PATH (no admin needed)
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$ipfsDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ipfsDir", "User")
        Write-Host "Added to PATH. Please restart VS Code/PowerShell." -ForegroundColor Yellow
    } else {
        Write-Host "Already in PATH!" -ForegroundColor Green
    }
} else {
    Write-Host "IPFS CLI not found in IPFS Desktop. Installing go-ipfs separately..." -ForegroundColor Yellow
    Write-Host "Download from: https://dist.ipfs.io/#go-ipfs" -ForegroundColor Cyan
}

