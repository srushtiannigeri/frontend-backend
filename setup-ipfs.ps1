# IPFS Setup Script for Windows
# Run this after installing IPFS

Write-Host "Initializing IPFS (first time only)..." -ForegroundColor Cyan
ipfs init

Write-Host "`nStarting IPFS daemon..." -ForegroundColor Green
Write-Host "Keep this window open! Press Ctrl+C to stop." -ForegroundColor Yellow
ipfs daemon

