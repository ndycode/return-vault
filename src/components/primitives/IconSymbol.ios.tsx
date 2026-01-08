/**
 * IconSymbol Primitive (iOS)
 * Native SF Symbols wrapper with Expo Go fallback
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { NativeModules, StyleProp, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';

export type IconSymbolName = 'house.fill' | 'bell.fill' | 'plus.circle.fill' | 'gearshape';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

const MAPPING: Record<IconSymbolName, MaterialIconName> = {
    'house.fill': 'home',
    'bell.fill': 'notifications',
    'plus.circle.fill': 'add-circle',
    'gearshape': 'settings',
};

const hasSymbolModule = !!NativeModules.NativeUnimoduleProxy?.viewManagersMetadata?.SymbolModule;

export interface IconSymbolProps {
    name: IconSymbolName;
    size?: number;
    color: string;
    style?: StyleProp<ViewStyle>;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
