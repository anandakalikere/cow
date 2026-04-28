# PowerShell Test Script for AI Breed Detection
# Save as: test-ai-integration.ps1

# Configuration
$API_URL = "http://localhost:5000"
$IMAGE_PATH = "C:\path\to\your\cow-image.jpg"  # Update this path

# Test 1: Add cow WITH image (AI integration)
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TEST 1: Add Cow WITH AI Detection" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

if (Test-Path $IMAGE_PATH) {
    $form = @{
        cowName = "Gir Cow"
        breed = "Gir"
        age = "4"
        milkProduction = "10"
        price = "45000"
        latitude = "12.97"
        longitude = "77.59"
        image = Get-Item -Path $IMAGE_PATH
    }

    try {
        $response = Invoke-RestMethod -Uri "$API_URL/api/add-cow" `
            -Method POST `
            -Form $form

        Write-Host "✓ Success!" -ForegroundColor Green
        Write-Host "Cow ID: $($response.cow._id)" -ForegroundColor Green
        Write-Host "AI Breed Prediction: $($response.cow.aiBreedPrediction.breed)" -ForegroundColor Green
        Write-Host "Confidence: $($response.cow.aiBreedPrediction.confidence)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Image not found at: $IMAGE_PATH" -ForegroundColor Red
    Write-Host "Please update the IMAGE_PATH variable in this script" -ForegroundColor Yellow
}

# Test 2: Add cow WITHOUT image (AI = Unknown)
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "TEST 2: Add Cow WITHOUT Image" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

$body = @{
    cowName = "Holstein Cow"
    breed = "Holstein"
    age = "5"
    milkProduction = "20"
    price = "60000"
    latitude = "13.09"
    longitude = "77.70"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/add-cow" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Cow ID: $($response.cow._id)" -ForegroundColor Green
    Write-Host "AI Breed Prediction: $($response.cow.aiBreedPrediction.breed)" -ForegroundColor Yellow
    Write-Host "(Note: AI = Unknown because no image provided)" -ForegroundColor Yellow
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get all cows
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "TEST 3: Fetch All Cows" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/cows" -Method GET

    Write-Host "✓ Success! Found $($response.count) cows" -ForegroundColor Green
    
    $response.cows | ForEach-Object {
        Write-Host "`n  ID: $($_.id)" -ForegroundColor Cyan
        Write-Host "  Name: $($_.cowName)" -ForegroundColor White
        Write-Host "  User Breed: $($_.breed)" -ForegroundColor White
        Write-Host "  AI Prediction: $($_.aiBreedPrediction.breed) ($($_.aiBreedPrediction.confidence))" -ForegroundColor White
    }
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Testing complete!" -ForegroundColor Green
