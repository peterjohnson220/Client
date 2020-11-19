export interface TicketAttachment {
    AttachmentId: number;
    DisplayName: string;
    FileName: string;
    ExtensionType: string;
    ExtensionCssClass: string;
    FileState?: number;
    CreateDate?: Date;
}

export function generateMockTicketAttachment(attachmentId: number, extensionType: string): TicketAttachment {
    return {
        AttachmentId: attachmentId,
        DisplayName: 'MockAttachmentDisplayName' + attachmentId + extensionType,
        FileName: 'MockAttachmentFileName' + attachmentId + extensionType,
        ExtensionType: extensionType,
        ExtensionCssClass: 'file'
    };
}

export function generateMockTicketAttachments(): TicketAttachment[] {
    return [
        generateMockTicketAttachment(1, '.txt'),
        generateMockTicketAttachment(2, '.xlsx'),
        generateMockTicketAttachment(3, '.docx')
    ];
}
