import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Schools } from 'src/app/models/schools.model';
import { DistrictService, StatesService } from 'src/app/services';
import { SchoolsService } from 'src/app/services/schools.service';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.scss']
})
export class EditSchoolModalComponent implements OnInit {
  @Input() data: any;
  @Input() viewMode: any;
  isLoading: boolean = false;
  school: Schools;
  formGroup: FormGroup;

  stateArray = [];
  districtArray = [];
  editMode = false;

  countryName = 'United States';
  countryCode = '+1';
  showDistrict = false;
  constructor(
    private schoolService: SchoolsService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public sharedService: SharedService,
    public stateservice: StatesService,
    public districtservice: DistrictService,
  ) {
  }

  ngOnInit(): void {
    this.sharedService.showLoader();
    this.setStateDropdown();
    this.loadCustomer();
  }


  //Fetch Country
  setStateDropdown() {
    // Set State Array
    this.stateservice.getState('', 'false', '', '').subscribe((res: any) => {
      this.stateArray = res.data;
    });
  }

  loadCustomer() {
    if (!this.data) {
      this.editMode = false;
      this.loadForm();
      this.sharedService.hideLoader();
    } else {
      this.editMode = true;
      this.loadForm();
      this.setValueOnEdit();
    }
  }

  //Set Data on View 
  setValueOnEdit() {
    this.formGroup.patchValue(this.data);
    this.formGroup.controls.stateId.setValue((this.data?.stateId));
    this.onChangeState(this.data?.stateId)
  }

  get f() {
    return this.formGroup.controls;
  }

  //Load Form Data
  loadForm() {
    this.formGroup = this.fb.group({
      schoolName: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(50)])],
      schoolPhoneNumber: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(999999999999)])],
      districtId: [null, Validators.compose([Validators.required])],
      stateId: [null, Validators.compose([Validators.required])],
      country: [''],
      countryCode: [''],
      addressLine1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      addressLine2: [''],
      zipCode: ['', Validators.compose([Validators.required])]
    });
  }

  //Filter State
  onChangeState(data: any) {
    // Set FormControl for City
    this.districtArray = []
    this.f.districtId.setValue('');
    let stateId = data?._id ? data?._id : this.data?.stateId;
    if (stateId) {
      this.showDistrict = true;
    }
    // Set City Array
    this.districtservice.getDistrict('', stateId, 'false', '', '').subscribe((res: any) => {
      this.districtArray = res.data;
      if (this.editMode) {
        this.formGroup.controls['districtId'].setValue((this.data.districtId));
      }
    });
    if (this.viewMode) {
      this.formGroup.disable();
    }
    this.sharedService.hideLoader();

  }

  //Final Save
  save() {
    // Set Formdata
    const formData = this.formGroup.value;
    formData['country'] = this.countryName;
    formData['countryCode'] = this.countryCode;
    formData['schoolPhoneNumber'] = String(this.formGroup.controls.schoolPhoneNumber.value);
    formData['zipCode'] = String(this.formGroup.controls.zipCode.value);
    if (this.editMode) {
      this.edit(formData);
    } else {
      this.create(formData);
    }
  }
  //Edit
  edit(value) {
    if (this.formGroup.invalid) {
      return
    }
    if (!this.isLoading) {
      this.isLoading = true;
      this.schoolService.updateSchool(value, this.data._id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }

  }

  //Create
  create(value) {
    if (this.formGroup.invalid) {
      return
    }
    if (!this.isLoading) {
      this.isLoading = true;
      this.schoolService.createSchool(value).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
