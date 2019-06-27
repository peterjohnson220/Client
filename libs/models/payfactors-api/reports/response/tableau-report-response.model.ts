export interface TableauReportResponse {
   WorkbookId: string;
   WorkbookName: string;
   Thumbnail?: string;
   WorkbookDescription: string;
   ContentUrl: string;
   CreateDate: Date;
   EditDate: Date;
   ShowTabs: boolean;
   IconClass?: string[];
   Tag: string;
   IsFavorite: boolean;
}
