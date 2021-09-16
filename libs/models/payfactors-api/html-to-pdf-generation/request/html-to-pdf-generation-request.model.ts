import { PdfTypeConstantsEnum } from '../../../html-to-pdf-generation';

export interface HtmlToPdfGenerationRequest {
  PdfType: PdfTypeConstantsEnum;
  HtmlUrl: string;
  FileName: string;
  WaitForSelector: string;
}
