import { IAutocompletePrediction } from 'interfaces';
import {
  Api_AcquisitionFile,
  Api_AcquisitionFileOwner,
  Api_AcquisitionFilePerson,
  Api_AcquisitionFileProperty,
} from 'models/api/AcquisitionFile';
import { fromTypeCode, toTypeCode } from 'utils/formUtils';

import { PropertyForm } from '../../shared/models';
import {
  AcquisitionOwnerFormModel,
  AcquisitionRepresentativeFormModel,
  AcquisitionSolicitorFormModel,
  AcquisitionTeamFormModel,
  WithAcquisitionOwners,
  WithAcquisitionTeam,
} from '../common/models';

export class AcquisitionForm implements WithAcquisitionTeam, WithAcquisitionOwners {
  id?: number;
  fileName?: string = '';
  legacyFileNumber?: string = '';
  assignedDate?: string;
  deliveryDate?: string;
  rowVersion?: number;
  // Code Tables
  acquisitionFileStatusType?: string;
  acquisitionPhysFileStatusType?: string;
  acquisitionType?: string;
  // MOTI region
  region?: string;
  properties: PropertyForm[] = [];
  team: AcquisitionTeamFormModel[] = [];
  owners: AcquisitionOwnerFormModel[] = [];

  project?: IAutocompletePrediction;
  product: string = '';
  fundingTypeCode?: string;
  fundingTypeOtherDescription: string = '';
  ownerSolicitor: AcquisitionSolicitorFormModel = new AcquisitionSolicitorFormModel(null);
  ownerRepresentative: AcquisitionRepresentativeFormModel = new AcquisitionRepresentativeFormModel(
    null,
  );

  toApi(): Api_AcquisitionFile {
    return {
      id: this.id,
      fileName: this.fileName,
      rowVersion: this.rowVersion,
      assignedDate: this.assignedDate,
      deliveryDate: this.deliveryDate,
      legacyFileNumber: this.legacyFileNumber,
      fileStatusTypeCode: toTypeCode(this.acquisitionFileStatusType),
      acquisitionPhysFileStatusTypeCode: toTypeCode(this.acquisitionPhysFileStatusType),
      acquisitionTypeCode: toTypeCode(this.acquisitionType),
      regionCode: toTypeCode(Number(this.region)),
      projectId: this.project?.id !== undefined && this.project?.id !== 0 ? this.project?.id : null,
      productId: this.product !== '' ? Number(this.product) : null,
      fundingTypeCode: toTypeCode(this.fundingTypeCode),
      fundingOther: this.fundingTypeOtherDescription,
      // ACQ file properties
      fileProperties: this.properties.map<Api_AcquisitionFileProperty>(ap => {
        return {
          id: ap.id,
          propertyName: ap.name,
          isDisabled: ap.isDisabled,
          displayOrder: ap.displayOrder,
          rowVersion: ap.rowVersion,
          property: ap.toApi(),
          propertyId: ap.apiId,
          acquisitionFile: { id: this.id },
        };
      }),
      acquisitionFileOwners: this.owners
        .filter(x => !x.isEmpty())
        .map<Api_AcquisitionFileOwner>(x => x.toApi()),
      acquisitionTeam: this.team
        .filter(x => !!x.contact && !!x.contactTypeCode)
        .map<Api_AcquisitionFilePerson>(x => x.toApi(this.id || 0)),
      acquisitionFileOwnerSolicitors: this.ownerSolicitor.contact
        ? [this.ownerSolicitor.toApi()]
        : [],
      acquisitionFileOwnerRepresentatives: this.ownerRepresentative.contact
        ? [this.ownerRepresentative.toApi()]
        : [],
    };
  }

  static fromApi(model: Api_AcquisitionFile): AcquisitionForm {
    const newForm = new AcquisitionForm();
    newForm.id = model.id;
    newForm.fileName = model.fileName || '';
    newForm.rowVersion = model.rowVersion;
    newForm.assignedDate = model.assignedDate;
    newForm.deliveryDate = model.deliveryDate;
    newForm.legacyFileNumber = model.legacyFileNumber;
    newForm.acquisitionFileStatusType = fromTypeCode(model.fileStatusTypeCode);
    newForm.acquisitionPhysFileStatusType = fromTypeCode(model.acquisitionPhysFileStatusTypeCode);
    newForm.acquisitionType = fromTypeCode(model.acquisitionTypeCode);
    newForm.region = fromTypeCode(model.regionCode)?.toString();
    // ACQ file properties
    newForm.properties = model.fileProperties?.map(x => PropertyForm.fromApi(x)) || [];
    newForm.product = model.product?.id?.toString() ?? '';
    newForm.fundingTypeCode = model.fundingTypeCode?.id;
    newForm.fundingTypeOtherDescription = model.fundingOther || '';
    newForm.project =
      model.project !== undefined
        ? { id: model.project?.id || 0, text: model.project?.description || '' }
        : undefined;
    newForm.ownerSolicitor = model.acquisitionFileOwnerSolicitors?.length
      ? AcquisitionSolicitorFormModel.fromApi(model.acquisitionFileOwnerSolicitors[0])
      : new AcquisitionSolicitorFormModel(null);
    newForm.ownerRepresentative = model.acquisitionFileOwnerRepresentatives?.length
      ? AcquisitionRepresentativeFormModel.fromApi(model.acquisitionFileOwnerRepresentatives[0])
      : new AcquisitionRepresentativeFormModel(null);

    return newForm;
  }
}
