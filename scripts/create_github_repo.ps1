param(
    [string]$Owner = "Jinchainne",
    [string]$Repo = "genlayer-order-resolution-console",
    [switch]$Private
)

$ErrorActionPreference = "Stop"

$visibility = if ($Private) { "--private" } else { "--public" }

if (-not (Test-Path ".git")) {
    git init
    git checkout -B main
}

git add .
git commit -m "feat: scaffold genlayer policy eco intelligent contract" 2>$null

$target = "$Owner/$Repo"

gh repo create $target $visibility --source . --remote origin --push
