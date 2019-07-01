export interface TableauReportResponse {
   WorkbookId: string;
   WorkbookName: string;
   Thumbnail?: string;
   WorkbookDescription: string;
   ContentUrl: string;
   CreateDate: Date;
   EditDate: Date;
   IsFavorite: boolean;
   ShowTabs: boolean;
   IconClass?: string[];
   Tag: string;
}
