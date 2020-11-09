import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import cloneDeep from 'lodash/cloneDeep';

import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import {
  ControlType,
  UserContext,
  SimpleYesNoModalOptions,
  CompanyDto,
  Template,
  TemplateSettings,
  TemplateSection,
  TemplateControl,
  TemplateSettingsSection,
  TemplateSettingsControl } from 'libs/models';
import { MessageHelper } from 'libs/core';

import {
  CompanyLogo,
  AvailableJobInformationField,
  JobInformationField,
  SaveError,
  JobDescriptionManagementService,
  JobDescriptionManagementDnDService,
  JobDescriptionManagementDndSource } from 'libs/features/job-description-management';

import * as fromTemplateActions from '../actions';
import * as fromTemplateReducers from '../reducers';
import {
  AssignTemplateToJobModalComponent,
  TemplateSectionComponent,
  NewSectionModalComponent,
  EditSectionModalComponent,
  ConfirmSectionDeleteModalComponent,
  ConfirmControlDeleteModalComponent,
  SelectTemplateLogoModalComponent,
  UpsertControlModalComponent,
  ConfirmPublishTemplateModalComponent } from '../components';

import * as fromJdmSharedReducer from 'libs/features/job-description-management/reducers';
import * as fromJdmSharedActions from 'libs/features/job-description-management/actions';
import {
  SaveErrorModalComponent,
  ConflictErrorModalComponent,
  CopyTemplateModalComponent,
  } from '../../../shared';
import { TemplateDnDService, TemplateService } from '../services';

@Component({
  selector: 'pf-job-description-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss']
})
export class TemplatePageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(NewSectionModalComponent, {static: true}) public newTemplateSectionModal: NewSectionModalComponent;
  @ViewChild(EditSectionModalComponent, {static: true}) public editTemplateSectionModal: EditSectionModalComponent;
  @ViewChild(ConfirmSectionDeleteModalComponent, {static: true}) public confirmSectionDeleteModal: ConfirmSectionDeleteModalComponent;
  @ViewChild(ConfirmControlDeleteModalComponent, {static: true}) public confirmControlDeleteModal: ConfirmControlDeleteModalComponent;
  @ViewChild(SelectTemplateLogoModalComponent, {static: true}) public selectTemplateLogoModal: SelectTemplateLogoModalComponent;
  @ViewChild(UpsertControlModalComponent, {static: true}) labelControlTypeComponent: UpsertControlModalComponent;
  @ViewChild(ConfirmPublishTemplateModalComponent, {static: true}) confirmPublishTemplateModal: ConfirmPublishTemplateModalComponent;
  @ViewChild(CopyTemplateModalComponent, {static: true}) public copyTemplateModal: CopyTemplateModalComponent;
  @ViewChild(AssignTemplateToJobModalComponent, {static: true}) assignModalComponent: AssignTemplateToJobModalComponent;
  @ViewChildren('templateSections') public templateSections: QueryList<TemplateSectionComponent>;
  @ViewChild('discardDraftModal', {static: true}) public discardDraftModal: SimpleYesNoModalComponent;
  @ViewChild('conflictErrorModal', {static: true}) public conflictErrorModal: ConflictErrorModalComponent;
  @ViewChild('saveErrorModal', {static: true}) public saveErrorModal: SaveErrorModalComponent;

  public template$: Observable<Template>;
  public templateLoading$: Observable<boolean>;
  public templateError$: Observable<boolean>;
  public templateErrorMessge$: Observable<string>;
  public templateAssignmentSummary$: Observable<any>;
  public templateSaveError$: Observable<SaveError>;
  public templatePublishing$: Observable<boolean>;
  public templateCopying$: Observable<boolean>;
  public editingTemplate$: Observable<boolean>;
  public controlTypesLoading$: Observable<boolean>;
  public controlTypesLoaded$: Observable<boolean>;
  public availableJobInformationFields$: Observable<AvailableJobInformationField[]>;
  public availableJobInformationFieldsLoading$: Observable<boolean>;
  public templateSettingsLoading$: Observable<boolean>;
  public templateSettingsLoadingError$: Observable<boolean>;
  public templateSettingsLoadingErrorMessage$: Observable<string>;
  public templateSettingsSaving$: Observable<boolean>;
  public templateSettingsSavingError$: Observable<SaveError>;
  private identity$: Observable<UserContext>;
  private controlTypesLatest$: Observable<ControlType[]>;
  private templateSettings$: Observable<TemplateSettings>;
  private company$: Observable<CompanyDto>;
  public getLoadingSummary$: Observable<boolean>;

  private templateSectionCheckSubscription: Subscription;
  private templateSaveSubscription: Subscription;
  private controlTypesSubscription: Subscription;
  private templateSettingsSubscription: Subscription;
  private templateSaveErrorSubscription: Subscription;
  private identitySubscription: Subscription;
  private companySubscription: Subscription;
  private templateAssignmentSummarySubscription: Subscription;

  public publicBaseUrl: string;
  public templateAssignmentSummary: any;
  public selectedSection: TemplateSection;
  public selectedControl: TemplateControl;
  public controlTypes: ControlType[];
  public companyControlTypes: ControlType[];
  public systemControlTypes: ControlType[];
  public discardDraftModalOptions: SimpleYesNoModalOptions;
  public companyLogoPath: string;
  public companyName: string;
  public editingTemplateSettings = false;
  private templateSettings: TemplateSettings;
  private identity: UserContext;
  private templateId: number;
  private template: Template;
  private saveThrottle: Subject<any>;

  constructor(
    private store: Store<fromTemplateReducers.State>,
    private sharedJdmStore: Store<fromJdmSharedReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    private jobDescriptionManagementService: JobDescriptionManagementService,
    private templateDnDService: TemplateDnDService,
    private jobDescriptionManagementDnDService: JobDescriptionManagementDnDService,
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router) {

      this.getLoadingSummary$ = this.store.select(fromTemplateReducers.getLoadingSummary);
      this.template$ = this.store.select(fromTemplateReducers.getTemplate);
      this.templateLoading$ = this.store.select(fromTemplateReducers.getTemplateLoading);
      this.templateError$ = this.store.select(fromTemplateReducers.getTemplateError);
      this.templateErrorMessge$ = this.store.select(fromTemplateReducers.getTemplateErrorMessage);
      this.templateAssignmentSummary$ = this.store.select(fromTemplateReducers.getTemplateAssignmentSummary);
      this.templateSaveError$ = this.store.select(fromTemplateReducers.getTemplateSaveError);
      this.editingTemplate$ = this.store.select(fromTemplateReducers.getTemplateEditing);
      this.templatePublishing$ = this.store.select(fromTemplateReducers.getTemplatePublishing);
      this.templateCopying$ = this.store.select(fromTemplateReducers.getTemplateCopying);

      this.availableJobInformationFields$ = this.store.select(fromTemplateReducers.getAvailableJobInfoFields);
      this.availableJobInformationFieldsLoading$ = this.store.select(fromTemplateReducers.getAvailableJobInfoFieldLoading);

      this.templateSettings$ = this.store.select(fromTemplateReducers.getTemplateSettings);
      this.templateSettingsLoading$ = this.store.select(fromTemplateReducers.getTemplateSettingLoading);
      this.templateSettingsLoadingError$ = this.store.select(fromTemplateReducers.getTemplateSettingLoadingError);
      this.templateSettingsLoadingErrorMessage$ = this.store.select(fromTemplateReducers.getTemplateSettingLoadingErrorMessage);
      this.templateSettingsSaving$ = this.store.select(fromTemplateReducers.getTemplateSettingSaving);
      this.templateSettingsSavingError$ = this.store.select(fromTemplateReducers.getTemplateSettingSavingError);

      this.controlTypesLoading$ = this.sharedJdmStore.select(fromJdmSharedReducer.getControlTypesLoading);
      this.controlTypesLoaded$ = this.sharedJdmStore.select(fromJdmSharedReducer.getControlTypesLoaded);
      this.controlTypesLatest$ = this.sharedJdmStore.select(fromJdmSharedReducer.getLatestControlTypes);
      this.company$ = this.sharedJdmStore.select(fromJdmSharedReducer.getCompany);

      this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
      this.saveThrottle = new Subject();
      this.defineDiscardDraftModalOptions();
  }

  ngOnInit() {
    this.initTemplateSubscriptions();
    this.initControlTypeSubscription();
    this.initLogoSubscription();
    this.initDnDSubscriptions();
    this.initSaveThrottle();
    this.loadTemplate();
  }

  ngOnDestroy() {
    this.store.dispatch(new fromTemplateActions.CleanTemplateState());
    this.identitySubscription.unsubscribe();
    this.templateSaveSubscription.unsubscribe();
    this.templateSettingsSubscription.unsubscribe();
    this.controlTypesSubscription.unsubscribe();
    this.companySubscription.unsubscribe();
    this.templateSectionCheckSubscription.unsubscribe();
    this.templateAssignmentSummarySubscription.unsubscribe();
    this.templateSaveErrorSubscription.unsubscribe();
    this.templateDnDService.destroyTemplatePageDnD();
    this.jobDescriptionManagementDnDService.destroyJobDescriptionManagementDnD();
  }

  ngAfterViewInit() {
    this.templateSections.changes.subscribe((list: QueryList<TemplateSectionComponent>) => {
      this.templateDnDService.setTemplateSections(this.templateSections);
    });
  }
  saveTemplateName(templateName: string) {
    this.template.TemplateName = templateName;
    this.store.dispatch(new fromTemplateActions.SaveTemplateName({templateId: this.templateId, templateName: templateName}));
  }

  saveTemplate() {
    this.store.dispatch(new fromTemplateActions.SaveTemplate({template: this.template}));
  }

  publishTemplate() {
    this.store.dispatch(new fromTemplateActions.PublishTemplate({template: this.template}));
  }

  publishTemplateClick() {
    this.templateAssignmentSummary.AssignedJobs > 0 ? this.showConfirmPublishTemplateModal() : this.publishTemplate();
  }

  beginEditing() {
    this.store.dispatch(new fromTemplateActions.BeginEditing());
  }

  // Modals
  showAddSectionModal() {
    this.newTemplateSectionModal.open();
  }

  showEditSectionModal(selectedSection: TemplateSection) {
    // Break connection from store so we dont modify it directly.
    this.selectedSection = Object.assign({}, selectedSection);
    this.editTemplateSectionModal.open();
  }

  showConfirmDeleteSectionModal(selectedSection: TemplateSection) {
    this.selectedSection = selectedSection;
    this.confirmSectionDeleteModal.open();
  }

  showConfirmDeleteControlModal(templateControl: TemplateControl) {
    this.selectedControl = templateControl;
    this.confirmControlDeleteModal.open();
  }

  showConfirmPublishTemplateModal() {
    this.confirmPublishTemplateModal.open();
  }

  showAssignModal() {
    this.assignModalComponent.open();
  }

  showCopyConfirmModal() {
    this.copyTemplateModal.open( { templateId: this.template.TemplateId });

  }
  showDiscardDraftModal() {
    this.discardDraftModal.open({});
  }

  //#region Events
  handleAddSectionComplete(templateSectionForm: any) {
    const templateSection = this.addSection(templateSectionForm.templateSectionName, templateSectionForm.templateSectionSubHeading);
    this.store.dispatch(new fromTemplateActions.AddSection({templateSection: templateSection}));
    this.saveTemplate();
  }

  handleEditSectionComplete(templateSection: TemplateSection) {
    this.store.dispatch(new fromTemplateActions.EditSection({templateSection: templateSection}));
    this.saveTemplate();
  }

  handleFieldSelectorPopoverSaved(jobInformationFields: JobInformationField[]) {
    this.store.dispatch(new fromTemplateActions.ReplaceJobInformationFields({jobInformationFields: jobInformationFields}));
    this.saveTemplate();
  }

  handleFieldSelectorPopoverShown() {
    this.store.dispatch(new fromTemplateActions.LoadAvailableJobInformationFields());
  }

  handleDeleteSectionConfirmed(templateSection: TemplateSection) {
    this.store.dispatch(new fromTemplateActions.DeleteSection({templateSection: templateSection}));
    this.saveTemplate();
  }

  handleDeleteControlConfirmed(templateControl: TemplateControl) {
    this.store.dispatch(new fromTemplateActions.DeleteControlFromSection({templateControl: templateControl}));
    this.saveTemplate();
  }

  handleExportSettingsClick() {
    this.router.navigate(['settings/job-description-views'], { queryParams: { templateId: this.template.TemplateId } });
  }

  handlePublishTemplateConfirmed() {
    this.publishTemplate();
  }

  handleCopyTemplateComplete(eventargs: any) {
    this.store.dispatch(new fromTemplateActions.CopyTemplate({templateId: eventargs.context.templateId, templateName: eventargs.templateName}));
  }

  handleControlDataChanges(dataRowChangeObj: any) {
    this.store.dispatch(new fromTemplateActions.UpdateControlData(dataRowChangeObj));
    this.saveThrottle.next(true);
  }

  trackByFn(index: number, section: TemplateSection) {
    return section.Id;
  }

  handleBulkControlDataChanges(bulkChangeObj: any) {
    const sourcedAttribute = bulkChangeObj.attributes.find(a => a.CanBeSourced);

    const dataRows = bulkChangeObj.bulkData.dataVals.map((d, index) => {
        const currentDataRow = cloneDeep(bulkChangeObj.bulkData.currentData[index]);
        let dataRow;

        if (currentDataRow) {
            currentDataRow[sourcedAttribute.Name] = d;
            dataRow = currentDataRow;
        } else {
            dataRow = this.jobDescriptionManagementService.createDataRow(bulkChangeObj.attributes, d);
            dataRow.Id += index;
        }

        return dataRow;
    });

    this.store.dispatch(new fromTemplateActions.ReplaceControlData({
      templateControl: bulkChangeObj.control, dataRows: dataRows}));
    this.saveThrottle.next(true);
  }

  handleControlAdditionalPropertiesChangesDetected(eventArgs: any) {
    this.store.dispatch(new fromTemplateActions.UpdateControlAdditionalProperties({
      templateControl: eventArgs.control, additionalProperties: eventArgs.additionalProperties}));
      this.saveTemplate();
  }

  handleControlDataRowAdded(addDataRowObj: any) {
    this.store.dispatch(new fromTemplateActions.AddDataRowToControl({
      templateControl: addDataRowObj.control, dataRow: this.jobDescriptionManagementService.createDataRow(addDataRowObj.attributes)}));

    if (addDataRowObj.save) {
        this.saveThrottle.next(true);
    }
  }

  handleControlDataRowDeleted(dataRowDeletedObj: any) {
    this.store.dispatch(new fromTemplateActions.RemoveControlDataRow({
      templateControl: dataRowDeletedObj.control, dataRowId: dataRowDeletedObj.dataRowId}));
    this.saveThrottle.next(true);
  }

  handleEditControlLabelClicked(templateControl: TemplateControl) {
    this.sharedJdmStore.dispatch(new fromJdmSharedActions.LoadControlTypes());
    const control = this.controlTypes.filter(c => c.Type === templateControl.Type && c.ControlVersion === templateControl.ControlVersion);
    this.labelControlTypeComponent.open(templateControl.Label, (newLabel, additionalProperties) => {
      this.store.dispatch(new fromTemplateActions.UpdateControlLabel({templateControl, newLabel}));
      this.saveTemplate();
    }, true, templateControl, control[0]);
  }

  handleDiscardDraftConfirmed(event$: any) {
    this.store.dispatch(new fromTemplateActions.DiscardTemplateDraft({templateId: this.template.TemplateId}));
  }

  handleSectionSettingUpdated(sectionSetting: TemplateSettingsSection) {
    this.store.dispatch(new fromTemplateActions.UpdateSectionSetting(sectionSetting));
  }

  handleControlSettingUpdate(controlSetting: TemplateSettingsControl) {
    this.store.dispatch(new fromTemplateActions.UpdateControlSetting(controlSetting));
  }

  handleUploadLogoClicked(event$: any) {
    this.loadTemplate();
    this.selectTemplateLogoModal.open();
  }

  handleTemplateLogoSelectedComplete(companyLogo: CompanyLogo) {
    this.store.dispatch(new fromTemplateActions.UpdateTemplateLogo({logoUrl: companyLogo.StoragePath}));
    this.saveTemplate();
  }

  handleConflictOrSaveErrorModalClosed() {
    this.store.dispatch(new fromTemplateActions.ClearSaveTemplateError());
  }

  manageControlsClick() {
    this.router.navigate([`settings/company-controls`]);
  }
  //#endregion Events

  //#region Private Methods

  private addSection(newSectionName: string, newSectionSubHeading: string) {
    const templateSection: TemplateSection = {
      Id: this.templateService.generateEpochId(),
      Name: newSectionName,
      SubHeading: newSectionSubHeading,
      Controls: []
    };
    return templateSection;
  }

  private initSaveThrottle() {
      const saveThrottle$ = this.saveThrottle.debounceTime(500);

      saveThrottle$.subscribe(save => {
          this.saveTemplate();
      });
  }

  private defineDiscardDraftModalOptions() {
      this.discardDraftModalOptions = {
          Title: 'Discard Draft',
          Body: `Discarding this draft will result in all non-published work being removed.
                 In some instances, this could result in the template being deleted.<br/><br/> Would you like to continue?`,
          ConfirmText: 'Discard',
          CancelText: 'No',
          IsDelete: true
      };
  }

  private initControlTypeSubscription() {
    this.controlTypesSubscription = this.controlTypesLatest$.subscribe(controlTypes => {
      if (controlTypes) {
        this.controlTypes = controlTypes;
        this.templateDnDService.setControlTypes(this.controlTypes);
        this.companyControlTypes = controlTypes.filter(ct => ct.CompanyId);
        this.systemControlTypes = controlTypes.filter(ct => !ct.CompanyId);
      }
    });
    this.sharedJdmStore.dispatch(new fromJdmSharedActions.LoadControlTypes());
  }

  private initDnDSubscriptions() {
    // Init Template Page Drag and Drop
    this.templateDnDService.initTemplatePageDnD(this.labelControlTypeComponent);
    // Init Job Description Management Drag and Drop
    this.jobDescriptionManagementDnDService.initJobDescriptionManagementDnD(JobDescriptionManagementDndSource.Template, (control, oldIndex, newIndex) => {
      this.store.dispatch(new fromTemplateActions.ReorderControlData({ templateControl: control, oldIndex, newIndex }));
      this.saveThrottle.next(true);
    });
  }

  private initTemplateSubscriptions() {
    this.templateAssignmentSummarySubscription = this.templateAssignmentSummary$.subscribe((summary) => {
      this.templateAssignmentSummary = summary;
    });
    this.templateSettingsSubscription = this.templateSettings$.subscribe(setting => this.templateSettings = setting);
    this.templateSaveSubscription = this.template$.subscribe(template => {
      if (template) {
        this.template = cloneDeep(template);
        this.templateDnDService.setTemplate(template);
      }
    });
    this.templateSaveErrorSubscription = this.templateSaveError$.subscribe(e => {
      if (e) {
        if (e.IsConflict) {
          this.conflictErrorModal.open();
        } else {
          this.saveErrorModal.open();
        }
      }
    });
    this.templateSectionCheckSubscription = this.template$.subscribe(template => {
      if (template && template.Sections && !template.Sections.length) {
            this.showAddSectionModal();
      }
    });
  }

  private initLogoSubscription() {
    this.identitySubscription = this.identity$.subscribe(userContext => {
      this.identity = userContext;
      this.companyName = userContext.CompanyName;
    });
    this.companySubscription = this.company$.subscribe(company => {
      if (company) {
        this.companyName = company.CompanyName;
        this.companyLogoPath = company?.CompanyLogo
          ? this.identity.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + company.CompanyLogo
          : '';
        this.publicBaseUrl = this.identity.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/';
      }
    });
    this.sharedJdmStore.dispatch(new fromJdmSharedActions.LoadCompanyLogo(this.identity.CompanyId));
  }

  private loadTemplate() {
    this.route.params.subscribe((params: Params) => {
      this.templateId = parseInt(params['id'], 10);
      if (this.templateId > 0) {
        this.store.dispatch(new fromTemplateActions.LoadTemplate({ templateId: this.templateId }));
        this.store.dispatch(new fromTemplateActions.LoadTemplateAssignmentSummary({ templateId: this.templateId }));
      } else {
        this.store.dispatch(new fromTemplateActions.LoadTemplateError({ errorMessage: MessageHelper.buildErrorMessage('Error loading this template.') }));
      }
    });
  }

  //#endregion Private Methods
}
