import { Section } from './section';

export interface Page {
  Sections: Section[];
  IsAdditionalPage?: boolean;
}
