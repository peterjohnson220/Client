import { TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiServiceType } from '../../features/notes-manager/constants/api-service-type-constants';

export interface NotesManagerConfiguration {
  ModalTitle: string;
  ShowModal$: Observable<boolean>;
  IsEditable: boolean;
  PlaceholderText: string;
  NotesHeader: TemplateRef<any>;
  EntityId: number;
  ApiServiceIndicator: ApiServiceType;
}
