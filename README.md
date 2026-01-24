# Reminder App

A full-stack mobile application for managing reminders, built with React Native and Node.js.

## Tech Stack
- **Frontend**: React Native, TypeScript, Yarn.

## Prerequisites
- Node.js (v18+)
- Yarn
- Android Studio / Xcode (for running the app)

## Setup Instructions

###  Frontend
```bash
cd frontend
yarn install
# iOS
npx react-native run-ios
# Android
npx react-native run-android
```

## Architecture

### Frontend
- **Navigation**: Uses `@react-navigation/stack`.
- **Services**: `api.ts` handles Axios requests; `notification.ts` handles local scheduled notifications.
- **Screens**:
  - `HomeScreen`: Lists reminders.
  - `AddEditScreen`: Creates or updates reminders.

