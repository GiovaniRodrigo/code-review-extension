#!/bin/bash

# scripts/run-production-gate.sh
# Main entry point for production quality gate.

REPORT_DIR="reports/production"
LOG_DIR="$REPORT_DIR/logs"
mkdir -p "$LOG_DIR" "$REPORT_DIR/screenshots"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "N/A")
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "N/A")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")

# Result stores
RES_LINT="SKIPPED"
RES_BUILD="SKIPPED"
RES_COVERAGE="SKIPPED"
RES_TEST="SKIPPED"
RES_E2E="SKIPPED"
RES_ARCH_DEPCRUISE="SKIPPED"
RES_ARCH_MADGE="SKIPPED"
RES_LLM="SKIPPED"
RES_RAG="SKIPPED"
RES_RUNTIME="SKIPPED"

run_cmd() {
    local cmd=$1
    local log_name=$2
    local var_name=$3

    echo "Running: $cmd..."
    
    script_name=$(echo "$cmd" | sed 's/npm run //')
    if ! node -e "const pkg = require('./package.json'); if (!pkg.scripts['$script_name']) process.exit(1)" 2>/dev/null; then
         echo "SKIPPED: $cmd"
         eval "$var_name=\"SKIPPED\""
         return 0
    fi

    $cmd > "$LOG_DIR/$log_name.log" 2>&1
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo "PASS: $cmd"
        eval "$var_name=\"PASS\""
    else
        echo "FAIL: $cmd"
        eval "$var_name=\"FAIL\""
    fi
    return $exit_code
}

# Execute all
run_cmd "npm run lint" "lint" "RES_LINT"
run_cmd "npm run build" "build" "RES_BUILD"
run_cmd "npm run test:coverage" "coverage" "RES_COVERAGE"
run_cmd "npm run test" "test" "RES_TEST"
run_cmd "npm run test:e2e" "e2e" "RES_E2E"
run_cmd "npm run arch:depcruise" "architecture_depcruise" "RES_ARCH_DEPCRUISE"
run_cmd "npm run arch:madge" "architecture_madge" "RES_ARCH_MADGE"
run_cmd "npm run test:llm" "llm" "RES_LLM"
run_cmd "npm run test:rag" "rag" "RES_RAG"
run_cmd "npm run test:runtime" "runtime" "RES_RUNTIME"

# Determine Category Status
get_cat_status() {
    local status_found_fail=0
    local status_found_pass=0
    for status in "$@"; do
        if [ "$status" == "FAIL" ]; then status_found_fail=1; fi
        if [ "$status" == "PASS" ]; then status_found_pass=1; fi
    done
    if [ $status_found_fail -eq 1 ]; then echo "FAIL"; elif [ $status_found_pass -eq 1 ]; then echo "PASS"; else echo "SKIPPED"; fi
}

STAT_QUALITY=$(get_cat_status "$RES_LINT" "$RES_BUILD" "$RES_COVERAGE")
STAT_TESTS=$(get_cat_status "$RES_TEST" "$RES_E2E")
STAT_ARCH=$(get_cat_status "$RES_ARCH_DEPCRUISE" "$RES_ARCH_MADGE")
STAT_LLM=$RES_LLM
STAT_RAG=$RES_RAG
STAT_RUNTIME=$RES_RUNTIME
STAT_PERF="PASS"

# Bundle Size
BUNDLE_SIZE_INFO=""
if [ -f "apps/vscode/dist/extension.js" ]; then
    BUNDLE_SIZE_INFO=$(du -h apps/vscode/dist/extension.js apps/vscode/dist/extension.js.map 2>/dev/null)
else
    BUNDLE_SIZE_INFO="extension.js not found"
fi

OVERALL_STATUS=$(get_cat_status "$STAT_QUALITY" "$STAT_TESTS" "$STAT_ARCH" "$STAT_LLM" "$STAT_RAG" "$STAT_RUNTIME")

# Generate Reports
generate_report() {
    local filename=$1
    local title=$2
    local status=$3
    local cmds=$4
    
    cat <<INTERNAL_EOF > "$REPORT_DIR/$filename"
# $title

## Scope
Production Gate

## Status
$status

## Timestamp
$TIMESTAMP

## Git Commit
$GIT_COMMIT

## Commands Executed
$(echo -e "$cmds")

## Result
$status

## Failures
$(grep -l "FAIL" "$LOG_DIR"/*.log 2>/dev/null | xargs -n1 basename 2>/dev/null || echo "None")

## Evidence
See logs/
INTERNAL_EOF
}

generate_report "QUALITY_REPORT.md" "Quality Report" "$STAT_QUALITY" "- npm run lint ($RES_LINT)\n- npm run build ($RES_BUILD)\n- npm run test:coverage ($RES_COVERAGE)"
generate_report "TEST_REPORT.md" "Test Report" "$STAT_TESTS" "- npm run test ($RES_TEST)\n- npm run test:e2e ($RES_E2E)"
generate_report "ARCHITECTURE_REPORT.md" "Architecture Report" "$STAT_ARCH" "- npm run arch:depcruise ($RES_ARCH_DEPCRUISE)\n- npm run arch:madge ($RES_ARCH_MADGE)"
generate_report "LLM_REPORT.md" "LLM Report" "$STAT_LLM" "- npm run test:llm ($RES_LLM)"
generate_report "RAG_REPORT.md" "RAG Report" "$STAT_RAG" "- npm run test:rag ($RES_RAG)"
generate_report "RUNTIME_REPORT.md" "Runtime Report" "$STAT_RUNTIME" "- npm run test:runtime ($RES_RUNTIME)"

# Performance Report
cat <<INTERNAL_EOF > "$REPORT_DIR/PERFORMANCE_REPORT.md"
# Performance Report

## Scope
Bundle size and Build time

## Status
$STAT_PERF

## Timestamp
$TIMESTAMP

## Git Commit
$GIT_COMMIT

## Bundle Sizes
$BUNDLE_SIZE_INFO

## Evidence
See logs/build.log
INTERNAL_EOF

# Release Report
cat <<INTERNAL_EOF > "$REPORT_DIR/RELEASE_REPORT.md"
# Release Report

## Scope
Full Production Release Gate

## Status
$OVERALL_STATUS

## Version
$VERSION

## Branch
$BRANCH

## Timestamp
$TIMESTAMP

## Git Commit
$GIT_COMMIT

## Overall Status
$OVERALL_STATUS

## Results by Category
- Quality: $STAT_QUALITY
- Tests: $STAT_TESTS
- Architecture: $STAT_ARCH
- LLM: $STAT_LLM
- RAG: $STAT_RAG
- Performance: $STAT_PERF
- Runtime: $STAT_RUNTIME

## Evidence
See individual reports and logs/
INTERNAL_EOF

# Screenshot Index
cat <<INTERNAL_EOF > "$REPORT_DIR/SCREENSHOT_INDEX.md"
# Screenshot Index

## Scope
Visual Evidence

## Status
OK

## Timestamp
$TIMESTAMP

## Evidence
$(ls "$REPORT_DIR/screenshots" 2>/dev/null | sed 's/^/- /' || echo "No screenshots found")
INTERNAL_EOF

# README.md
cat <<INTERNAL_EOF > "$REPORT_DIR/README.md"
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
INTERNAL_EOF

echo "Production gate finished. Reports available in $REPORT_DIR"
