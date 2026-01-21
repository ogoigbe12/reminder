#!/bin/bash

BASE_URL="http://localhost:8000/api/reminders"

echo "1. Creating a reminder..."
CREATE_RES=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Reminder", "description": "This is a test", "datetime": "2023-12-31T23:59:00.000Z"}')
echo $CREATE_RES
ID=$(echo $CREATE_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Created ID: $ID"

echo "\n2. Getting all reminders..."
curl -s $BASE_URL | head -c 200
echo "..."

if [ ! -z "$ID" ]; then
  echo "\n3. Updating the reminder..."
  curl -s -X PUT "$BASE_URL/$ID" \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Reminder"}'

  echo "\n4. Deleting the reminder..."
  curl -s -X DELETE "$BASE_URL/$ID"
else
  echo "\nSkipping Update/Delete because creation failed."
fi
