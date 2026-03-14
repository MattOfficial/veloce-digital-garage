$ErrorActionPreference = "Stop"

$secretVariableNames = @(
    "OPENAI_API_KEY",
    "DEEPSEEK_API_KEY",
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "ANTHROPIC_API_KEY",
    "XAI_API_KEY",
    "MISTRAL_API_KEY",
    "GROQ_API_KEY",
    "OPENROUTER_API_KEY",
    "ENCRYPTION_MASTER_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

$tokenPatterns = @(
    @{ Label = "OpenAI or DeepSeek style key"; Regex = "\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b" },
    @{ Label = "Anthropic style key"; Regex = "\bsk-ant-[A-Za-z0-9_-]{20,}\b" },
    @{ Label = "Google AI Studio style key"; Regex = "\bAIza[0-9A-Za-z_-]{20,}\b" },
    @{ Label = "Groq style key"; Regex = "\bgsk_[A-Za-z0-9]{20,}\b" }
)

$placeholderPattern = "\b(example|placeholder|changeme|replace[-_ ]?me|dummy|sample|fake|redacted)\b|your[_-][A-Za-z0-9_-]*|<[^>]+>|\.\.\.|xxxxx"
$assignmentPattern = "\b(?:{0})\b\s*[:=]\s*[""']?([^\s""'#]+)" -f ($secretVariableNames -join "|")

$stagedFiles = @(git diff --cached --name-only --diff-filter=ACMR)
$stagedFiles = $stagedFiles | Where-Object {
    $_ -and ([System.IO.Path]::GetFileName($_) -ne "package-lock.json")
}

if ($stagedFiles.Count -eq 0) {
    Write-Host "Secret check: no staged files to inspect."
    exit 0
}

$failures = New-Object System.Collections.Generic.List[object]

foreach ($filePath in $stagedFiles) {
    $content = git show ":$filePath" 2>$null
    if ($LASTEXITCODE -ne 0 -or $null -eq $content) {
        continue
    }

    $contentString = [string]::Join([Environment]::NewLine, $content)
    if ($contentString.Contains([char]0)) {
        continue
    }

    $lines = $contentString -split "\r?\n"

    for ($index = 0; $index -lt $lines.Length; $index += 1) {
        $line = $lines[$index]
        $isPlaceholder = $line -match $placeholderPattern

        $assignmentMatch = [regex]::Match($line, $assignmentPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($assignmentMatch.Success -and -not $isPlaceholder) {
            $failures.Add([PSCustomObject]@{
                FilePath = $filePath
                LineNumber = $index + 1
                Finding = "Suspicious secret assignment"
                Line = $line.Trim()
            })
        }

        foreach ($pattern in $tokenPatterns) {
            if (($line -match $pattern.Regex) -and -not $isPlaceholder) {
                $failures.Add([PSCustomObject]@{
                    FilePath = $filePath
                    LineNumber = $index + 1
                    Finding = $pattern.Label
                    Line = $line.Trim()
                })
            }
        }
    }
}

if ($failures.Count -gt 0) {
    Write-Host "Potential secrets detected in staged content:"
    foreach ($failure in $failures) {
        Write-Host "- $($failure.FilePath):$($failure.LineNumber) $($failure.Finding)"
        Write-Host "  $($failure.Line)"
    }
    Write-Host ""
    Write-Host "Commit blocked. Remove the secret, replace it with a placeholder, or move it into local environment configuration."
    exit 1
}

Write-Host "Secret check: scanned $($stagedFiles.Count) staged file(s) and found no obvious secrets."
