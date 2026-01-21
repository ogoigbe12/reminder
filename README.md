# Reminder App

A full-stack mobile application for managing reminders, built with React Native and Node.js.

## Tech Stack
- **Frontend**: React Native, TypeScript, Yarn.
- **Backend**: Node.js, Express, TypeScript, MongoDB.

## Prerequisites
- Node.js (v18+)
- Yarn
- MongoDB (Local or Remote)
  - *Note*: The backend is configured to use an in-memory MongoDB instance if a local instance is not found, ensuring easy testing.
- Android Studio / Xcode (for running the app)

## Setup Instructions

### 1. Backend
```bash
cd backend
yarn install
# Start the server (runs on port 8000)
yarn dev
```
The server will start at `http://localhost:8000`.

### 2. Frontend
```bash
cd frontend
yarn install
# iOS
npx react-native run-ios
# Android
npx react-native run-android
```

## Architecture

### Backend
- **MVC Pattern**: Separated into Models, Views (API Responses), and Controllers.
- **Routes**: `src/routes/reminder.routes.ts` defines the API endpoints.
- **Database**: Mongoose is used for Object Data Modeling (ODM).

### Frontend
- **Navigation**: Uses `@react-navigation/stack`.
- **Services**: `api.ts` handles Axios requests; `notification.ts` handles local scheduled notifications.
- **Screens**:
  - `HomeScreen`: Lists reminders.
  - `AddEditScreen`: Creates or updates reminders.

## API Endpoints
- `GET /api/reminders` - Retrieve all reminders.
- `POST /api/reminders` - Create a new reminder.
- `PUT /api/reminders/:id` - Update a reminder.
- `DELETE /api/reminders/:id` - Delete a reminder.
