import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatesService } from '../../../../../services';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-edit-states',
  templateUrl: './edit-states.component.html',
  styleUrls: ['./edit-states.component.scss']
})

export class EditStatesModalComponent implements OnInit {
  @Input() stateData: any;
  isLoading: boolean = false;
  formGroup: FormGroup;
  

  constructor(
    private stateService: StatesService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadState();
  }

  //Load State data
  loadState() {
    if (!this.stateData) {
      this.loadForm();
      this.formGroup.controls['country'].setValue('United State');
      this.formGroup.controls['country'].disable();
    } else {
      this.loadForm();
      this.formGroup.controls['name'].setValue((this.stateData?.name).toUpperCase())
      this.formGroup.controls['country'].setValue((this.stateData?.country).toUpperCase())
      this.formGroup.disable();
    }
  }

  //Load Form
  loadForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      country: ['', Validators.compose([Validators.required])]
    });
  }

  
  //Final save
  save() {
    if (this.formGroup.invalid) {
      return
    }
    const formData = {};
    formData['name'] = this.formGroup.controls.name.value;
    formData['country'] = this.formGroup.controls.country.value;
    if (!this.isLoading) {
      this.isLoading = true;
      this.stateService.addState(formData).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
         // this.sharedService.loggerSuccess(res.message);
         Swal.fire({
          icon: 'success',
          title: res.message,
        });
        }
      }, err => {
        this.isLoading = false;
        //this.sharedService.loggerError(err)
        Swal.fire({
          icon: 'error',
          title: err
        });
      })
    }
  }

  //close model
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
