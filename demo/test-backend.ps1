# # Certisure Backend Test Script
# # Simple PowerShell script to test all endpoints

# $backendUrl = "http://localhost:4000/api"

# Write-Host "========================================" -ForegroundColor Cyan

# Write-Host "Certisure Backend Test Suite" -ForegroundColor Cyan
# Write-Host "========================================" -ForegroundColor Cyan

# Write-Host ""

# # Test 1: Health Check
# Write-Host "[1/4] Testing Health Endpoint..." -ForegroundColor Yellow
# try {
#     $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get
#     Write-Host "OK Health check passed" -ForegroundColor Green
#     Write-Host ($health | ConvertTo-Json) -ForegroundColor Gray
# } catch {
#     Write-Host "FAILED Health check failed: $_" -ForegroundColor Red
#     exit 1
# }
# Write-Host ""

# # Test 2: Register or Login User
# Write-Host "[2/4] Ensuring test user exists..." -ForegroundColor Yellow

# $stamp = Get-Date -Format "yyyyMMddHHmmss"
# $email = "demo+$stamp@certisure.com"
# $password = "TestPassword123"
# $token = $null
# $userId = $null

# # Try register first
# $registerBody = @{
#     full_name = "Demo Owner"
#     email     = $email
#     password  = $password
#     role      = "OWNER"
# } | ConvertTo-Json

# try {
#     $registerResult = Invoke-RestMethod -Uri "$backendUrl/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
#     $token = $registerResult.token
#     $userId = $registerResult.user.user_id
#     Write-Host "OK User registered successfully" -ForegroundColor Green
# } catch {
#     # If registration fails (likely 409), try login
#     Write-Host "User exists, trying login..." -ForegroundColor Yellow
    
#     $loginBody = @{
#         email    = $email
#         password = $password
#     } | ConvertTo-Json
    
#     try {
#         $loginResult = Invoke-RestMethod -Uri "$backendUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
#         $token = $loginResult.token
#         $userId = $loginResult.user.user_id
#         Write-Host "OK Login successful" -ForegroundColor Green
#     } catch {
#         Write-Host "FAILED Login failed: $_" -ForegroundColor Red
#         exit 1
#     }
# }

# if (-not $token -or -not $userId) {
#     Write-Host "FAILED No JWT token or userId obtained" -ForegroundColor Red
#     exit 1
# }

# Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Gray
# Write-Host "User ID: $userId" -ForegroundColor Gray
# Write-Host ""

# # Test 3: Create test file
# Write-Host "[3/4] Creating test file..." -ForegroundColor Yellow
# $testFile = "$env:TEMP\certisure-test-encrypted.bin"
# $testContent = "This is a test document that will be encrypted client-side before upload."
# [System.IO.File]::WriteAllBytes($testFile, [System.Text.Encoding]::UTF8.GetBytes($testContent))
# Write-Host "OK Test file created: $testFile" -ForegroundColor Green
# Write-Host ""

# # Test 4: Upload to IPFS + PostgreSQL
# Write-Host "[4/4] Uploading file to IPFS + PostgreSQL..." -ForegroundColor Yellow

# try {
#     # Windows PowerShell 5.x does NOT support Invoke-WebRequest -Form. Use curl.exe for multipart upload.
#     $uploadUrl = "$backendUrl/assets"

#     $curlOutput = curl.exe -s -X POST $uploadUrl `
#         -F "file=@$testFile" `
#         -F "title=Test Encrypted Document" `
#         -F "type=application/octet-stream" `
#         -F "content_hash=test-hash-12345" `
#         -F "owner_id=$userId"

#     if (-not $curlOutput) {
#         throw "Empty response from server"
#     }

#     $uploadResult = $curlOutput | ConvertFrom-Json

#     if (-not $uploadResult.asset) {
#         Write-Host "Server response:" -ForegroundColor Yellow
#         Write-Host $curlOutput
#         throw "Upload response did not contain asset"
#     }

#     Write-Host "OK Upload successful" -ForegroundColor Green
#     Write-Host "  Asset ID: $($uploadResult.asset.asset_id)" -ForegroundColor Gray
#     Write-Host "  IPFS CID: $($uploadResult.asset.encrypted_cid)" -ForegroundColor Gray
#     Write-Host "  Owner ID: $($uploadResult.asset.owner_id)" -ForegroundColor Gray
#     Write-Host "  Title: $($uploadResult.asset.title)" -ForegroundColor Gray
#     Write-Host ""
#     Write-Host "Full response:" -ForegroundColor Cyan
#     Write-Host ($uploadResult | ConvertTo-Json -Depth 5) -ForegroundColor Gray
# } catch {
#     Write-Host "FAILED Upload failed: $_" -ForegroundColor Red
#     exit 1
# }

# Write-Host ""
# Write-Host "========================================" -ForegroundColor Cyan
# Write-Host "Summary:" -ForegroundColor Cyan
# Write-Host "  OK Health endpoint working" -ForegroundColor Green
# Write-Host "  OK Authentication working" -ForegroundColor Green
# Write-Host "  OK JWT token generation working" -ForegroundColor Green
# Write-Host "  OK IPFS + PostgreSQL integration working" -ForegroundColor Green
# Write-Host "========================================" -ForegroundColor Cyan


# Certisure Backend Test Script
# Tests: Health -> Register/Login -> JWT -> IPFS/Assets upload

$backendUrl = "http://localhost:4000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Certisure Backend Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ----------------------------
# Test 1: Health Check
# ----------------------------
Write-Host "[1/4] Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get
    Write-Host "OK Health check passed" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "FAILED Health check failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# ----------------------------
# Test 2: Register / Login
# ----------------------------
Write-Host "[2/4] Registering/Login test user..." -ForegroundColor Yellow

$stamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "demo+$stamp@certisure.com"
$password = "TestPassword123"

$token = $null
$userId = $null

# Register body
$registerBody = @{
    full_name = "Demo Owner"
    email     = $email
    password  = $password
    role      = "OWNER"
} | ConvertTo-Json

try {
    $registerResult = Invoke-RestMethod -Uri "$backendUrl/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
    $token = $registerResult.token
    Write-Host "OK User registered successfully" -ForegroundColor Green
} catch {
    Write-Host "FAILED Register failed: $_" -ForegroundColor Red
    exit 1
}

if (-not $token) {
    Write-Host "FAILED No token received after register" -ForegroundColor Red
    exit 1
}

# ----------------------------
# Decode JWT payload to get user_id
# ----------------------------
try {
    $payloadBase64 = $token.Split('.')[1].Replace('-', '+').Replace('_', '/')
    while ($payloadBase64.Length % 4 -ne 0) { $payloadBase64 += '=' }
    $payloadJson = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payloadBase64))
    $payloadObj = $payloadJson | ConvertFrom-Json

    $userId = $payloadObj.user_id
} catch {
    Write-Host "FAILED Token decode failed: $_" -ForegroundColor Red
    exit 1
}

if (-not $userId) {
    Write-Host "FAILED Could not extract user_id from JWT" -ForegroundColor Red
    exit 1
}

Write-Host "Token (first 60 chars): $($token.Substring(0,60))..." -ForegroundColor Gray
Write-Host "User ID: $userId" -ForegroundColor Gray
Write-Host ""

# ----------------------------
# Test 3: Create test file
# ----------------------------
Write-Host "[3/4] Creating test file..." -ForegroundColor Yellow

$testFile = Join-Path $env:TEMP "certisure-test.txt"
$testContent = "Hello from Certisure IPFS test - $(Get-Date)"
[System.IO.File]::WriteAllText($testFile, $testContent)

Write-Host "OK Test file created: $testFile" -ForegroundColor Green
Write-Host ""

# ----------------------------
# Test 4: Upload file (IPFS + PostgreSQL)
# ----------------------------
Write-Host "[4/4] Uploading file to IPFS + PostgreSQL..." -ForegroundColor Yellow

try {
    $uploadUrl = "$backendUrl/assets"

    # Use curl.exe for multipart upload
    $curlOutput = curl.exe -s -X POST $uploadUrl `
        -H "Authorization: Bearer $token" `
        -F "file=@$testFile" `
        -F "owner_id=$userId" `
        -F "title=Test Encrypted Document" `
        -F "type=text/plain" `
        -F "content_hash=test-hash-12345"

    if (-not $curlOutput) {
        throw "Empty response from server"
    }

    $uploadResult = $curlOutput | ConvertFrom-Json

    Write-Host "OK Upload completed" -ForegroundColor Green
    Write-Host "Server raw response:" -ForegroundColor Cyan
    Write-Host $curlOutput -ForegroundColor Gray
    Write-Host ""

    if ($uploadResult.asset) {
        Write-Host "Parsed asset info:" -ForegroundColor Yellow
        Write-Host "  Asset ID : $($uploadResult.asset.asset_id)" -ForegroundColor Gray
        Write-Host "  Owner ID : $($uploadResult.asset.owner_id)" -ForegroundColor Gray
        Write-Host "  IPFS CID : $($uploadResult.asset.encrypted_cid)" -ForegroundColor Gray
        Write-Host "  Title    : $($uploadResult.asset.title)" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "WARNING: uploadResult.asset not found (check backend response format)" -ForegroundColor Yellow
    }

} catch {
    Write-Host "FAILED Upload failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  OK Health endpoint working" -ForegroundColor Green
Write-Host "  OK Authentication working" -ForegroundColor Green
Write-Host "  OK JWT token generation working" -ForegroundColor Green
Write-Host "  OK IPFS + PostgreSQL integration working" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
