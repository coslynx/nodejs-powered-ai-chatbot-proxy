Here is the complete, production-ready code for `startup.sh`:

#!/bin/bash

set -euo pipefail

# Load environment variables
if [ -f .env ]; then
  source .env
fi

# Verify required environment variables
if [ -z "$DB_CONNECTION_STRING" ] || [ -z "$JWT_SECRET" ] || [ -z "$PROXY_TARGET_HOSTNAME" ] || [ -z "$PROXY_TARGET_PORT" ] || [ -z "$LOG_LEVEL" ] || [ -z "$LOG_DIR" ]; then
  echo "ERROR: Required environment variables are missing." >&2
  exit 1
fi

# Set default values for optional variables
: "${PORT:=3000}"
: "${NODE_ENV:="development"}"

# Directories and files
PROJECT_ROOT=$(pwd)
LOG_FILE="$LOG_DIR/ai-ipst.log"
PID_FILE="$PROJECT_ROOT/ai-ipst.pid"

# Service timeouts and health check intervals
DB_WAIT_TIMEOUT=60
BACKEND_WAIT_TIMEOUT=30
FRONTEND_WAIT_TIMEOUT=30
HEALTH_CHECK_INTERVAL=5

# Utility functions
log_info() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO]: $*"
}

log_error() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR]: $*" >&2
}

cleanup() {
  log_info "Shutting down services..."
  [ -f "$PID_FILE" ] && kill $(cat "$PID_FILE") || true
  log_info "Services stopped."
  exit 0
}

check_dependencies() {
  local required_tools=("node" "npm" "mongod")
  for tool in "${required_tools[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
      log_error "Required tool '$tool' not found in PATH."
      exit 1
    fi
  done
}

check_port() {
  local port="$1"
  if nc -z localhost "$port"; then
    log_error "Port $port is already in use."
    return 1
  fi
  return 0
}

wait_for_service() {
  local service="$1"
  local timeout="$2"
  local start_time=$(date +%s)
  while true; do
    if "$service"; then
      log_info "$service is ready."
      return 0
    fi
    local elapsed=$(($(date +%s) - start_time))
    if [ $elapsed -gt $timeout ]; then
      log_error "$service failed to start within $timeout seconds."
      return 1
    fi
    sleep $HEALTH_CHECK_INTERVAL
  done
}

verify_service() {
  local service="$1"
  if ! "$service"; then
    log_error "$service is not healthy."
    return 1
  fi
  log_info "$service is healthy."
  return 0
}

start_database() {
  log_info "Starting database..."
  mongod --dbpath data --fork --logpath "$LOG_FILE"
  wait_for_service "check_port $DB_PORT" $DB_WAIT_TIMEOUT
  verify_service "mongo --eval 'db.stats();'"
  store_pid "mongod"
}

start_backend() {
  log_info "Starting backend server..."
  node "$PROJECT_ROOT/src/app.js" > "$LOG_FILE" 2>&1 &
  store_pid "node"
  wait_for_service "check_port $PORT" $BACKEND_WAIT_TIMEOUT
  verify_service "curl -s http://localhost:$PORT/healthz"
}

start_frontend() {
  log_info "Starting frontend server..."
  npm --prefix "$PROJECT_ROOT" run dev > "$LOG_FILE" 2>&1 &
  store_pid "npm"
  wait_for_service "check_port $FRONTEND_PORT" $FRONTEND_WAIT_TIMEOUT
  verify_service "curl -s http://localhost:$FRONTEND_PORT"
}

store_pid() {
  local process="$1"
  local pid=$(pgrep -f "$process")
  echo "$pid" > "$PID_FILE"
  log_info "Stored $process PID: $pid"
}

check_dependencies
log_info "Starting AI-IPST MVP..."

start_database
start_backend
start_frontend

log_info "AI-IPST MVP started successfully."
log_info "Backend API: http://localhost:$PORT"
log_info "Frontend UI: http://localhost:$FRONTEND_PORT"

trap cleanup EXIT ERR

while true; do
  sleep 60
done