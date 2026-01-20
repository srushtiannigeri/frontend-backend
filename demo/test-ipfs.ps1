# IPFS Health Check Script
# Tests the IPFS connection through the backend API

$backendUrl = "http://localhost:4000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IPFS Health Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking IPFS connection via backend..." -ForegroundColor Yellow
Write-Host "Backend URL: $backendUrl/ipfs/health" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/ipfs/health" -Method Get -ErrorAction Stop
    
    Write-Host "Response received:" -ForegroundColor Green
    Write-Host ""
    
    if ($response.connected) {
        Write-Host "✓ IPFS Status: CONNECTED" -ForegroundColor Green
        Write-Host "  API URL: $($response.apiUrl)" -ForegroundColor Gray
        Write-Host "  Version: $($response.details.version.version)" -ForegroundColor Gray
        Write-Host "  Peer ID: $($response.details.id.id)" -ForegroundColor Gray
        
        if ($response.details.testAdd) {
            Write-Host "  Test Upload CID: $($response.details.testAdd.cid)" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "Full response:" -ForegroundColor Cyan
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
    } else {
        Write-Host "✗ IPFS Status: NOT CONNECTED" -ForegroundColor Red
        Write-Host "  API URL: $($response.apiUrl)" -ForegroundColor Yellow
        Write-Host "  Error: $($response.error)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
        Write-Host "  1. Make sure IPFS Desktop is running" -ForegroundColor White
        Write-Host "  2. Or start IPFS daemon manually: ipfs daemon" -ForegroundColor White
        Write-Host "  3. Check if IPFS API is accessible at: $($response.apiUrl)" -ForegroundColor White
        Write-Host "  4. Try: curl $($response.apiUrl)/api/v0/version" -ForegroundColor White
        Write-Host ""
        Write-Host "Full error details:" -ForegroundColor Cyan
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to connect to backend" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the backend is running:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
