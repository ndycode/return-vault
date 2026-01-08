/**
 * Attachment Type Definition
 */

export type AttachmentType = 'receipt' | 'serial' | 'warranty' | 'other';

export interface Attachment {
    id: string;
    purchaseId: string;
    type: AttachmentType;
    uri: string;
    createdAt: string; // ISO datetime string
}

export interface CreateAttachmentInput {
    purchaseId: string;
    type: AttachmentType;
    uri: string;
}
