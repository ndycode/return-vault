/**
 * Attachment Service
 * Handles image capture, storage, and management
 */

import * as ImagePicker from 'expo-image-picker';
import { Paths, Directory, File } from 'expo-file-system';
import { generateUUID } from '../utils/uuid';

// Get attachments directory path
function getAttachmentsDir(): Directory {
    return new Directory(Paths.document, 'attachments');
}

/**
 * Ensure attachments directory exists
 */
async function ensureAttachmentsDir(): Promise<Directory> {
    const attachmentsDir = getAttachmentsDir();
    if (!attachmentsDir.exists) {
        attachmentsDir.create();
    }
    return attachmentsDir;
}

/**
 * Request camera permissions
 */
export async function requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
}

/**
 * Request media library permissions
 */
export async function requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
}

/**
 * Capture photo from camera
 */
export async function capturePhoto(): Promise<string | null> {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
        return null;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) {
        return null;
    }

    return result.assets[0].uri;
}

/**
 * Pick photo from gallery
 */
export async function pickPhoto(): Promise<string | null> {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) {
        return null;
    }

    return result.assets[0].uri;
}

/**
 * Save image to app's document directory
 * Returns the new permanent URI
 */
export async function saveImageToDocuments(tempUri: string): Promise<string> {
    const attachmentsDir = await ensureAttachmentsDir();

    const filename = `${generateUUID()}.jpg`;
    const sourceFile = new File(tempUri);
    const destFile = new File(attachmentsDir, filename);

    sourceFile.copy(destFile);

    return destFile.uri;
}

/**
 * Delete image from documents
 */
export async function deleteImage(uri: string): Promise<void> {
    const file = new File(uri);
    if (file.exists) {
        file.delete();
    }
}

/**
 * Get all attachment images in documents folder
 */
export async function getStoredImages(): Promise<string[]> {
    const attachmentsDir = await ensureAttachmentsDir();
    const contents = attachmentsDir.list();
    return contents
        .filter((item): item is File => item instanceof File)
        .map((file) => file.uri);
}
