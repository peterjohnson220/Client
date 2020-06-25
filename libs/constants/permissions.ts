export class Permissions {
  public static CAN_MANAGE_JOB_DESCRIPTION_TEMPLATES = 'Can Manage Job Description Templates';
  public static CAN_DOWNLOAD_ORGANIZATIONAL_DATA = 'Can Download Organizational Data';
  public static CAN_DOWNLOAD_PRICING_DATA = 'Can Download Pricing Data';
  public static CAN_EDIT_JOB_DESCRIPTION = 'Can Edit Job Description';
  public static CAN_DELETE_JOB_DESCRIPTION = 'Can Delete Job Description';
  public static JOB_DESCRIPTIONS = 'Job Descriptions';
  public static CAN_VIEW_JOB_DESCRIPTION = 'Can View Job Description';
  public static CAN_PUBLISH_JOB_DESCRIPTION = 'Can Publish Job Description';
  public static CAN_CANCEL_JOB_DESCRIPTION_WORKFLOW = 'Can Cancel Job Description Workflow';
  public static CAN_ROUTE_JOB_DESCRIPTION_FOR_APPROVAL = 'Can Route Job Description For Approval';
  public static CAN_MANAGE_JOB_DESCRIPTION_SETTINGS = 'Can Manage Job Description Settings';
  public static CAN_RESTRICT_JOB_DESCRIPTIONS_FROM_THE_PUBLIC_VIEW = 'Can Restrict Job Descriptions from the Public View';
  public static JOB_DESCRIPTIONS_ADD = 'Job_Descriptions_Add';
  public static CAN_ACCEPT_TERMS_AND_CONDITIONS = 'Can Accept Terms and Conditions';
  public static COMMUNITY = 'Community';
  public static PRICING_PROJECTS = 'Pricing Projects';
  public static PAY_MARKETS = 'Pay Markets';
  public static JOBS = 'Jobs';
  public static SURVEYS = 'Surveys';
  public static DATA_INSIGHTS = 'Data Insights';
  public static DATA_DIAGNOSTICS = 'Data Diagnostics';
  public static SERVICE = 'Service';
  public static ACTIVITY = 'Activity';
  public static STRUCTURES = 'Structures';
  public static RESOURCES = 'Resources';
  public static IDEAS = 'Ideas';
  public static EMPLOYEES = 'Employees';
  public static REFERRALS = 'Referrals';
  public static NEW_PROJECT = 'New Project';
  public static PAY_INTELLIGENCE = 'Pay Intelligence';
  public static PEER = 'Peer';
  public static COMPANY_ADMIN = 'Company_Admin';
  public static PRICING_PROJECTS_DELETE = 'Pricing_Projects_Delete';
  public static PRICING_PROJECTS_DATA_CUTS = 'Pricing_Projects_Data_Cuts';
  public static PRICING_PROJECTS_PUBLISH_JOBS = 'Pricing_Projects_Publish_Jobs';
  public static PAY_MARKETS_ADD_EDIT_DELETE = 'Pay_Markets_Add_Edit_Delete';
  public static JOBS_ADD_EDIT_DELETE = 'Jobs_Add_Edit_Delete';
  public static JOBS_INACTIVATE_ACTIVATE = 'Jobs_Inactivate_Activate';
  public static JOBS_EDIT_PRICINGS = 'Jobs_Edit_Pricings';
  public static JOBS_VIEW_MATCH_DATA = 'Jobs_View_Match_Data';
  public static SERVICE_VIEW_ALL_TICKETS = 'Service_View_all_tickets';
  public static SERVICE_CREATE_ORGANIZATION_DATA_SURVEY_DATA_OR_MARKET_PRICINGS_REQUESTS =
    'Service_Create_Organization_Data_Survey_Data_or_Market_Pricings_Requests';
  public static STRUCTURES_ADD_EDIT_DELETE = 'Structures_Add_Edit_Delete';
  public static STRUCTURES_CREATE_EDIT_MODEL = 'Structures_Create_Edit_Model';
  public static STRUCTURES_PUBLISH = 'Structures_Publish';
  public static JOB_DESCRIPTIONS_VIEW_JOB_MATCHES = 'Job_Descriptions_View_Job_Matches';
  public static EMPLOYEES_ADD_EDIT_DELETE = 'Employees_Add_Edit_Delete';
  public static USERS = 'Users';
  public static ADD_USER = 'Add User';
  public static DOWNLOAD_USER_RESTRICTION_REPORT = 'Download User Restriction Report';
  public static BULK_ADD_USERS = 'Bulk Add Users';
  public static SCHEDULE_JDM_BULK_EXPORT = 'Schedule JDM Bulk Export';
  public static PRICING_PROJECTS_NEW_PROJECT = 'New Project';
  public static USER_ROLES = 'User Roles';
  public static PEER_IMPORT_ASSOCIATIONS = 'Peer_Import_Associations';
  public static PEER_MANAGE_JOBS = 'Peer_Manage_Jobs';
  public static SECURITY_SETTINGS = 'Security Settings';
  public static DATA_MANAGEMENT = 'Data Management';
  public static MODIFY_PRICINGS = 'Modify Pricings';
  public static HRIS_INBOUND_INTEGRATION = 'HRIS Inbound Integration';
  public static HRIS_OUTBOUND_INTEGRATION = 'HRIS Outbound Integration';

  // DKG: Note there are two similar Org Loader permissions for different tiles, one for Company-Admin and one for Data-Management
  public static DATAMANAGEMENT_ORG_DATA_LOAD = 'Load Organizational Data';
  public static TABULAR_REPORT_BUILDER = 'Tabular_Report_Builder';
  public static PRICING_LOADER = 'Pricing Loader';
}

export enum PermissionCheckEnum {
  Any,
  All,
  Single
}
