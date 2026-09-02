$ErrorActionPreference = "Stop"

$Port = 4173
$RootDir = Join-Path $PSScriptRoot "static"

if (!(Test-Path $RootDir)) {
  throw "Could not find static folder at: $RootDir"
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()

Write-Host "Serving $RootDir on http://127.0.0.1:$Port/"
Write-Host "Open: http://127.0.0.1:$Port/"

# Open browser (best-effort)
try {
  Start-Process "http://127.0.0.1:$Port/"
} catch {
  Write-Host "Could not auto-open browser. Please open manually."
}

$contentType = @{
  ".html"="text/html; charset=utf-8"
  ".js"="text/javascript; charset=utf-8"
  ".css"="text/css; charset=utf-8"
  ".json"="application/json; charset=utf-8"
  ".csv"="text/csv; charset=utf-8"
  ".svg"="image/svg+xml"
  ".png"="image/png"
  ".jpg"="image/jpeg"
  ".jpeg"="image/jpeg"
  ".woff"="font/woff"
  ".woff2"="font/woff2"
}

function Get-ContentType([string]$path) {
  $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  if ($contentType.ContainsKey($ext)) { return $contentType[$ext] }
  return "application/octet-stream"
}

try {
  while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.AbsolutePath
    if ([string]::IsNullOrWhiteSpace($urlPath) -or $urlPath -eq "/") {
      $urlPath = "/index.html"
    }

    # Prevent path traversal
    $relative = $urlPath.TrimStart("/") -replace "\.\.(\\|/)", ""
    $filePath = Join-Path $RootDir $relative

    if (!(Test-Path $filePath)) {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $response.ContentType = Get-ContentType $filePath
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  }
} finally {
  $listener.Stop()
}

