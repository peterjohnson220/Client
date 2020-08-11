import { TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';

export interface NotesManagerConfiguration {
  ModalTitle: string;
  ShowModal$: Observable<boolean>;
  EnableAdd: boolean;
  PlaceholderText: string;
  NotesHeader: TemplateRef<any>;
  Entity: string;
  EntityId: number;
}
