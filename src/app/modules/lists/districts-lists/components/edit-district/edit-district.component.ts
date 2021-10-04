import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DistrictService, StatesService } from '../../../../../services';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-edit-district',
  templateUrl: './edit-district.component.html',
  styleUrls: ['./edit-district.component.scss']
})
export class EditDistrictComponent implements OnInit {
  @Input() districtData: any;
  isLoading: boolean = false;
  formGroup: FormGroup;
  stateList = [];
  editMode = false;
  constructor(
    public districtService: DistrictService,
    public stateservice: StatesService,
    public sharedService: SharedService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    this.getStateList();
  }

  loadCustomer() {
    if (!this.districtData) {
      this.editMode = false;
      this.loadForm();
    } else {
      this.editMode = true;
      this.loadForm();
      this.formGroup.controls['name'].setValue((this.districtData.name).toUpperCase());
      this.formGroup.controls['sauCode'].setValue(this.districtData.sauCode);
      this.formGroup.controls['stateId'].setValue(this.districtData.stateId);
      this.formGroup.disable();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      stateId: [null, Validators.compose([Validators.required])],
      sauCode: ['', Validators.compose([Validators.required, Validators.min(10), Validators.max(100000)])]
    });
  }



  //Fetch state
  getStateList() {
    this.stateservice.getState('', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.stateList = res.data;
      }
    })
  }

  //Final Save
  save() {
    if (this.districtData) {
      // this.edit();
    } else {
      this.create();
    }
  }


  create() {
    this.sharedService.showLoader();
    if (this.formGroup.invalid) {
      this.sharedService.hideLoader();
      return
    }
    //const formData = this.formGroup.value;
    const formData = {}
    formData['name'] = this.formGroup.controls.name.value;
    formData['stateId'] = this.formGroup.controls.stateId.value;
    formData['sauCode'] = String(this.formGroup.controls.sauCode.value);
    if (!this.isLoading) {
      this.isLoading = true;
      this.districtService.createDistrict(formData).subscribe((res: any) => {
        if (res) {
          this.sharedService.hideLoader();
          this.isLoading = false;
          this.modal.close();
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
        }
      }, err => {
        this.sharedService.hideLoader();
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: err
        });
      })
    }
  }

  //Close Model
  cancel() {
    this.modal.close();
  }

  get f() {
    return this.formGroup.controls;
  }


  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.formGroup.controls[controlName];
  //   if (controlName == 'sauCode' && control.value.substr(0, 4) !== "SAU-") {
  //     return true && (control.dirty || control.touched);
  //   }
  //   return control.invalid && (control.dirty || control.touched);
  // }
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
