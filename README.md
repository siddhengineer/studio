# ToDoList App - React Native

This is a React Native version of the ToDoList application.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Watchman (macOS)
- JDK (for Android development)
- Android Studio (for Android development, including SDK and emulator)
- Xcode (for iOS development, macOS only)
- CocoaPods (for iOS development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todolist-react-native
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS pods (if developing for iOS):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

**For Android:**
```bash
npm run android
# or
yarn android
```
This will attempt to start an Android emulator if one is configured, or run on a connected Android device.

**For iOS:**
```bash
npm run ios
# or
yarn ios
```
This will attempt to start an iOS simulator or run on a connected iOS device (requires Xcode setup).

**Start Metro Bundler (if needed separately):**
```bash
npm start
# or
yarn start
```

## Project Structure

- `src/`: Contains the main application code.
  - `components/`: Reusable UI components.
  - `context/`: Application state management (AppContext).
  - `data/`: Initial or static data.
  - `hooks/`: Custom React hooks.
  - `navigation/`: Navigation setup using React Navigation.
  - `screens/`: Top-level screen components.
  - `theme/`: Theme configuration (colors, styles).
  - `types/`: TypeScript type definitions.
- `App.tsx`: The root component of the application.

## Key Libraries Used

- **React Native:** Core framework.
- **React Navigation:** For routing and navigation.
- **React Native Paper:** For UI components (Material Design).
- **AsyncStorage:** For local data persistence.
- **React Hook Form & Zod:** For form handling and validation.
- **date-fns:** For date and time manipulation.
- **uuid:** For generating unique IDs.
- **react-native-vector-icons:** For icons.
- **@react-native-community/datetimepicker** & **react-native-modal-datetime-picker**: For date/time selection.
- **react-native-toast-message**: For in-app notifications.

## Available Scripts

- `npm run android` / `yarn android`: Build and run the Android app.
- `npm run ios` / `yarn ios`: Build and run the iOS app.
- `npm start` / `yarn start`: Start the Metro bundler.
- `npm run lint` / `yarn lint`: Lint the codebase.
- `npm run typecheck` / `yarn typecheck`: Check TypeScript types.

