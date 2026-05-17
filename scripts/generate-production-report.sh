#!/bin/bash

# scripts/generate-production-report.sh
# Generates initial templates or final reports based on execution context.

REPORT_DIR="reports/production"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "N/A")
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "N/A")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")

mkdir -p "$REPORT_DIR"

generate_template() {
    local filename=$1
    local title=$2
    cat <<EOF > "$REPORT_DIR/$filename"
# $title

## Scope
Production Gate

## Status
PENDING

## Timestamp
$TIMESTAMP

## Git Commit
$GIT_COMMIT

## Commands Executed
N/A

## Result
N/A

## Failures
N/A

## Evidence
See logs/
EOF
}

# Generate initial templates
generate_template "RELEASE_REPORT.md" "Release Report"
generate_template "QUALITY_REPORT.md" "Quality Report"
generate_template "TEST_REPORT.md" "Test Report"
generate_template "ARCHITECTURE_REPORT.md" "Architecture Report"
generate_template "LLM_REPORT.md" "LLM Report"
generate_template "RAG_REPORT.md" "RAG Report"
generate_template "PERFORMANCE_REPORT.md" "Performance Report"
generate_template "RUNTIME_REPORT.md" "Runtime Report"

# Special case for RELEASE_REPORT.md with more details
cat <<EOF > "$REPORT_DIR/RELEASE_REPORT.md"
# Release Report

## Scope
Full Production Release Gate

## Status
PENDING

## Version
$VERSION

## Branch
$BRANCH

## Timestamp
$TIMESTAMP

## Git Commit
$GIT_COMMIT

## Overall Status
PENDING

## Results by Category
- Quality: PENDING
- Tests: PENDING
- Architecture: PENDING
- LLM: PENDING
- RAG: PENDING
- Performance: PENDING
- Runtime: PENDING

## Evidence
See individual reports and logs/
EOF

# SCREENSHOT_INDEX.md
cat <<EOF > "$REPORT_DIR/SCREENSHOT_INDEX.md"
# Screenshot Index

## Scope
Visual Evidence

## Status
OK

## Timestamp
$TIMESTAMP

## Evidence
$(ls "$REPORT_DIR/screenshots" | sed 's/^/- /')
EOF

# README.md
cat <<EOF > "$REPORT_DIR/README.md"
# Production Reports Index

- [RELEASE_REPORT.md](RELEASE_REPORT.md)
- [QUALITY_REPORT.md](QUALITY_REPORT.md)
- [TEST_REPORT.md](TEST_REPORT.md)
- [ARCHITECTURE_REPORT.md](ARCHITECTURE_REPORT.md)
- [LLM_REPORT.md](LLM_REPORT.md)
- [RAG_REPORT.md](RAG_REPORT.md)
- [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md)
- [RUNTIME_REPORT.md](RUNTIME_REPORT.md)
- [SCREENSHOT_INDEX.md](SCREENSHOT_INDEX.md)
- [Logs Directory](logs/)
- [Screenshots Directory](screenshots/)
EOF

echo "Templates generated in $REPORT_DIR"
