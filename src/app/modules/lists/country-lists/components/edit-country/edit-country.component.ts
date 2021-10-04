import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../../../../../services';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.scss'],
})

export class EditCountryModalComponent implements OnInit {
  @Input() countryData: any;
  isLoading: boolean = false;
  formGroup: FormGroup;

  constructor(
    private countryService: CountryService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loadCountry();
  }

  //Load Country Data
  loadCountry() {
    if (!this.countryData) {
      this.loadForm();
    } else {
      this.loadForm();
      this.formGroup.controls['countryName'].setValue((this.countryData.name).toUpperCase());
      this.formGroup.controls['countryCode'].setValue(this.countryData.countryCode)
      this.formGroup.disable();
    }
  }

  // Load Form Data
  loadForm() {
    this.formGroup = this.fb.group({
      countryName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      countryCode: ['', Validators.compose([Validators.required])]
    });
  }


  // Final Save
  save() {
    if (this.formGroup.invalid) {
      return
    }
    const formData = {};
    formData['countryName'] = this.formGroup.controls.countryName.value;
    formData['countryCode'] = this.formGroup.controls.countryCode.value;
    if (!this.isLoading) {
      this.isLoading = true;
      this.countryService.addCountry(formData).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.loggerSuccess(res.message);
        }
      }, err => {
        this.modal.close();
        this.sharedService.loggerError(err)
      })
    }
  }

  //Close model
  close() {
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
