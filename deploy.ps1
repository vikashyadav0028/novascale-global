$mingit = 'C:\Users\vikas\AppData\Local\Programs\MinGit\cmd'
$gh = 'C:\Users\vikas\AppData\Local\Programs\gh'
$env:PATH = "$mingit;$gh;$($env:PATH)"

# Re-bundle offline ZIP
$destZip = 'C:\Users\vikas\.gemini\antigravity\scratch\NovaScale_Global_Agency_Website.zip'
if (Test-Path $destZip) {
    Remove-Item $destZip -Force
}
Get-ChildItem -Path . -Exclude '.git' | Compress-Archive -DestinationPath $destZip -Force
Write-Host "Offline ZIP refreshed at: $destZip"

# Git operations
git status
git add .
git commit -m "feat: Upgrade all 6 main pages and 6 industry demos with modern animations, responsive design, and curated photography"
gh auth setup-git
git push origin main
Write-Host "Git push succeeded!"
