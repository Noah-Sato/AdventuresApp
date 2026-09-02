# Graph Report - FOMO  (2026-09-02)

## Corpus Check
- Corpus is ~28,931 words - fits in a single context window. You may not need a graph.

## Summary
- 505 nodes · 1036 edges · 73 communities (14 shown, 48 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.86)
- Token cost: 1,083,119 input · 0 output

## Community Hubs (Navigation)
- Home Feed & Photo Sharing
- Social Screens & Auth
- Dev Tooling Dependencies
- Navigation Layouts & Auth
- Expo App Config
- Event Creation & Friend Icons
- TypeScript Path Aliases
- Event Detail & RSVP
- Core Database Schema
- Utility Dependencies
- Event Creation Store
- RLS Recursion Fix
- Tab Display Component
- Event Photos Migration
- Auth Sign-In Flow
- Metro Bundler Config
- Tab Bar Icon Component
- Auth Sign-Up Reference
- Tester Logo Round Asset
- Expo Core Dependency
- Expo Constants Dependency
- Expo File System Dependency
- Expo Font Dependency
- Tenor Sans Font Dependency
- Expo Image Dependency
- Expo Image Manipulator Dependency
- Expo Image Picker Dependency
- Expo Linking Dependency
- Expo Location Dependency
- Expo Router Dependency
- Expo Status Bar Dependency
- Expo Vector Icons Dependency
- Expo Web Browser Dependency
- Bottom Sheet Dependency
- Flash Calendar Dependency
- React Core Dependency
- React DOM Dependency
- React Native Core Dependency
- Async Storage Dependency
- React Native CLI Dependency
- DateTime Picker Dependency
- Dotenv Dependency
- Gesture Handler Dependency
- Crypto Polyfill Dependency
- Google Places Autocomplete Dependency
- Reanimated Dependency
- Safe Area Context Dependency
- React Native Screens Dependency
- React Native SVG Dependency
- React Native Web Dependency
- React Navigation Dependency
- React Navigation Stack Dependency
- Stream Chat Dependency
- Stream Flat-List Dependency
- Supabase JS Dependency
- Zustand Dependency
- Android Adaptive Icon
- App Favicon Asset
- App Icon Asset
- Email Icon Asset
- Phone Icon Asset
- App Splash Screen

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 41 edges
2. `expo-router` - 30 edges
3. `Text()` - 29 edges
4. `bS` - 29 edges
5. `SquareButton()` - 17 edges
6. `PageHeader()` - 17 edges
7. `mainStyles` - 17 edges
8. `expo` - 16 edges
9. `UserIcon()` - 15 edges
10. `supabase` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AuthLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/_layout.tsx → contexts/AuthProvider.tsx
- `TabLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(tabs)/_layout.tsx → contexts/AuthProvider.tsx
- `Page()` --calls--> `useAuth()`  [EXTRACTED]
  app/(tabs)/chats.js → contexts/AuthProvider.tsx
- `ChannelScreen()` --calls--> `useEvent()`  [EXTRACTED]
  app/chatContainer/channel/[cid].js → src/hooks/useEvents.ts
- `UsersScreen()` --calls--> `useAuth()`  [EXTRACTED]
  app/chatContainer/users.js → contexts/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (73 total, 48 thin omitted)

### Community 0 - "Home Feed & Photo Sharing"
Cohesion: 0.05
Nodes (53): EventPhotosScreen(), isWithinPostingWindow(), MemoryBankScreen(), isWithinPostingWindow(), NextEventHighlight(), Page(), Chevron Right Icon (24px, Outlined), Whatshot (Fire/Trending) Tab Bar Icon (+45 more)

### Community 1 - "Social Screens & Auth"
Cohesion: 0.12
Nodes (31): CalendarPage(), getLinearTheme(), PhotoGrid(), statusColor, styles, EventPageHeader(), profileSliderConfig, Back Arrow Icon (iOS style, 24px, outlined) (+23 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.05
Nodes (43): @babel/core, babel-plugin-module-resolver, babel-preset-expo, eslint, eslint-config-universe, expo-fmt-consteval-fix, devDependencies, @babel/core (+35 more)

### Community 3 - "Navigation Layouts & Auth"
Cohesion: 0.07
Nodes (20): AuthLayout(), unstable_settings, unstable_settings, UsersScreen(), unstable_settings, Page(), unstable_settings, unstable_settings (+12 more)

### Community 4 - "Expo App Config"
Cohesion: 0.06
Nodes (33): backgroundColor, foregroundImage, adaptiveIcon, package, tsconfigPaths, typedRoutes, expo, android (+25 more)

### Community 5 - "Event Creation & Friend Icons"
Cohesion: 0.07
Nodes (31): AddFriendScreen(), CreateEventPage(), formatDateRangeLabel(), formatTimeSuffix(), styles, FriendsScreen(), Arrow Forward Icon, Border Color / Edit Icon (24px Outlined) (+23 more)

### Community 6 - "TypeScript Path Aliases"
Cohesion: 0.07
Nodes (29): assets/*, contexts/*, expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, src/*, src/components/*, src/config/* (+21 more)

### Community 7 - "Event Detail & RSVP"
Cohesion: 0.10
Nodes (21): ChannelScreen(), EditEventScreen(), formatEventDate(), GuestIconDisplay(), Page(), RSVP_OPTIONS, statusBorderColor(), Page() (+13 more)

### Community 8 - "Core Database Schema"
Cohesion: 0.27
Nodes (9): auth.users, public, public.handle_new_user, on_auth_user_created, public.attendance, public.events, public.friends, public.profiles (+1 more)

### Community 9 - "Utility Dependencies"
Cohesion: 0.18
Nodes (11): base64-arraybuffer, date-fns, expo-system-ui, dependencies, base64-arraybuffer, date-fns, expo-system-ui, @react-native-community/netinfo (+3 more)

### Community 10 - "Event Creation Store"
Cohesion: 0.39
Nodes (6): useStore, createEventsSlice(), defaultTime(), EventDateRange, EventLocation, EventsSlice

### Community 11 - "RLS Recursion Fix"
Cohesion: 0.40
Nodes (4): attendance, events, public.is_event_attendee(), public.is_event_host()

### Community 12 - "Tab Display Component"
Cohesion: 0.40
Nodes (3): styles, Tab, TabDisplay()

### Community 14 - "Event Photos Migration"
Cohesion: 0.50
Nodes (3): public.events, public.profiles, public.event_photos

## Knowledge Gaps
- **177 isolated node(s):** `name`, `slug`, `version`, `scheme`, `newArchEnabled` (+172 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 236 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `exclude` connect `Event Detail & RSVP` to `Dev Tooling Dependencies`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Why does `install` connect `Dev Tooling Dependencies` to `Event Detail & RSVP`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Feed & Photo Sharing` be split into smaller, more focused modules?**
  _Cohesion score 0.05203442879499218 - nodes in this community are weakly interconnected._
- **Should `Social Screens & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.12233400402414486 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Navigation Layouts & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.06747638326585695 - nodes in this community are weakly interconnected._