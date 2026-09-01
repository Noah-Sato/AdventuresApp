// True JS entry point (see package.json "main"). Expo Router's file-based routing eagerly
// requires every file under app/ to build its route table -- including ones that import
// 'uuid' -- which can happen before app/_layout.tsx runs its own polyfill import. uuid decides
// once, at module-import time, whether crypto.getRandomValues exists and caches that decision
// forever, so the polyfill has to run here, before anything else in the bundle, to reliably win
// that race. Same story for stream-chat-expo's client-side message ids.
import 'react-native-get-random-values';

import 'expo-router/entry';
