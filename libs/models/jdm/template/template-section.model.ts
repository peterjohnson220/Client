import { TemplateControl } from './template-control.model';

export interface TemplateSection {
    Id: number;
    Name: string;
    SubHeading: string;
    Controls: TemplateControl[];
}
