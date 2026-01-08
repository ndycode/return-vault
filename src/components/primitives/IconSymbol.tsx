/**
 * IconSymbol Primitive
 * SF Symbols mapping to Material Icons for non-iOS platforms
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

export type IconSymbolName = 'house.fill' | 'bell.fill' | 'plus.circle.fill' | 'gearshape';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

const MAPPING: Record<IconSymbolName, MaterialIconName> = {
    'house.fill': 'home',
    'bell.fill': 'notifications',
    'plus.circle.fill': 'add-circle',
    'gearshape': 'settings',
};

export interface IconSymbolProps {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
