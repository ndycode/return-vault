/**
 * Return & Warranty Locker
 * Main Application Entry Point
 * 
 * v1.06-B: Global Undo Toast
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from './src/navigation';
import { UndoToast } from './src/components/UndoToast';
import { useUndoStore } from './src/store/undoStore';

function AppContent() {
  const pendingAction = useUndoStore((s) => s.pendingAction);
  const clearUndo = useUndoStore((s) => s.clearUndo);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      <UndoToast 
        action={pendingAction} 
        onDismiss={clearUndo}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
