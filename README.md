# Expenster (Expense Tracker)

Local development (Expo):

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start Expo:

```bash
npx expo start
```

3. Run on device or emulator using Expo Go.

Notes:
- This project uses `@react-native-async-storage/async-storage` for persistence.
- Screens:
  - `Home` – list and total spent
  - `Create` – add or edit an expense
  - `Category` – pick a category
  - `Insights` – spending breakdown by category
  - `Profile` – profile & preferences

If you see styling mismatches, ensure `twrnc` is installed and configured.

Optional & Recommended packages used by this project:

```bash
# Haptics support
npx expo install expo-haptics

# Charts (for richer Insights)
# npm install react-native-chart-kit react-native-svg
```

If you add charts, also install `react-native-svg` which `react-native-chart-kit` depends on. In Expo managed projects `react-native-svg` is usually available, but run the install step to be safe.

Notifications (optional):

```bash
npx expo install expo-notifications
```

Note: On physical devices you will be prompted to allow notifications. Expo Go handles permissions for managed projects.
