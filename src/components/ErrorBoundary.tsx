/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree
 * Displays fallback UI instead of crashing the app
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from './primitives';
import { colors, spacing } from '../design';
import { debugError } from '../utils/debug';

export interface ErrorBoundaryProps {
    /** Child components to wrap */
    children: ReactNode;
    /** Custom fallback UI (optional) */
    fallback?: ReactNode;
    /** Callback when error is caught */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log to debug utility
        debugError('GENERAL', 'ErrorBoundary caught error', { error, errorInfo });
        
        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Text variant="symbolXL" color="error500">!</Text>
                        </View>
                        <Text variant="title" style={styles.title}>
                            Something went wrong
                        </Text>
                        <Text variant="secondary" color="textSecondary" style={styles.message}>
                            We encountered an unexpected error. Please try again.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text variant="meta" color="error500" style={styles.errorText}>
                                    {this.state.error.message}
                                </Text>
                            </View>
                        )}
                        <Button
                            title="Try Again"
                            onPress={this.handleRetry}
                            accessibilityLabel="Try again"
                            accessibilityHint="Attempts to recover from the error"
                        />
                    </Card>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    card: {
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.error50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    errorDetails: {
        backgroundColor: colors.error50,
        padding: spacing.md,
        borderRadius: spacing.sm,
        marginBottom: spacing.lg,
        width: '100%',
    },
    errorText: {
        fontFamily: 'monospace',
    },
});
