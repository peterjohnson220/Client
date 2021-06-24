import { TrsTemplates } from './trs-templates';

export class TrsConstants {
  public static READY_FOR_PDF_GENERATION_SELECTOR = '#ready-for-pdf-generation';
  public static TEMPLATE_NAMES = TrsTemplates;
  // technically there are 1056px, but leave room for the rich text editor header row and page boundaries margins/padding
  public static AVAILABLE_PAGE_HEIGHT_IN_PIXELS = 1000;
}
