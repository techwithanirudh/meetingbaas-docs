#!/bin/bash

# Set up variables
OPENAPI_URL="https://api.gmeebot.com/openapi.json"
LOCAL_API_FILE="openapi.json"
DEV_PORT=7080

# Function to build and start dev server
build_and_start() {
  echo "Building documentation..."
  if pnpm build; then
    echo "Build successful, starting dev server..."
    pnpm run dev -p $DEV_PORT &
    DEV_PID=$!
    echo "Dev server started with PID: $DEV_PID"
    return 0
  else
    echo "Build failed. Please check the errors above."
    return 1
  fi
}

# Function to commit changes
commit_changes() {
  echo "Changes detected in OpenAPI file. Committing..."
  git add "$LOCAL_API_FILE"
  git commit -m "Update OpenAPI schema [$(date +%Y-%m-%d-%H:%M:%S)]"
  echo "Committed changes. Rebuilding..."
  
  # Kill existing dev server if running
  if [ -n "$DEV_PID" ] && ps -p $DEV_PID > /dev/null; then
    echo "Stopping existing dev server (PID: $DEV_PID)..."
    kill $DEV_PID
    wait $DEV_PID 2>/dev/null
  fi
  
  build_and_start
}

# Initial setup
echo "Setting up initial OpenAPI file..."
curl "$OPENAPI_URL" > "$LOCAL_API_FILE"

# Do initial build
if ! build_and_start; then
  echo "Initial build failed. Exiting..."
  exit 1
fi

# Start monitoring for changes
echo "Starting monitoring for OpenAPI changes..."
while true; do
  # Create a temporary file for the new API definition
  TEMP_FILE=$(mktemp)
  
  # Fetch the current API definition
  if ! curl -s "$OPENAPI_URL" > "$TEMP_FILE"; then
    echo "Failed to fetch OpenAPI schema. Will retry in 5 seconds..."
    rm "$TEMP_FILE"
    sleep 5
    continue
  fi
  
  # Compare with the existing file
  if ! cmp -s "$TEMP_FILE" "$LOCAL_API_FILE"; then
    # Files are different, update and commit
    cp "$TEMP_FILE" "$LOCAL_API_FILE"
    commit_changes
  else
    echo "No changes detected in OpenAPI schema. $(date +%Y-%m-%d-%H:%M:%S)"
  fi
  
  # Clean up temp file
  rm "$TEMP_FILE"
  
  # Check API documentation server is running
  if ! curl -s "http://localhost:$DEV_PORT/docs/api/reference/retranscribe_bot" > /dev/null; then
    echo "Dev server not responding, restarting..."
    build_and_start
  fi
  
  # Wait before checking again
  sleep 5
done