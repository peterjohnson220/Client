export class ServicePageConfig {
  public static ServicePageViewId = '093120B2-4802-4343-BE18-34F56FB5B88C';
  public static UploadSaveUrl = '/odata/CloudFiles.UploadUserTicketAttachment';
  public static UploadRemoveUrl = '/odata/CloudFiles.DeleteUserTicketAttachments';
  public static MaxFileUploads = 25;
}

export enum TicketListMode {
  MyTickets = 'My Tickets',
  AllCompanyTickets = 'All Company Tickets'
}
