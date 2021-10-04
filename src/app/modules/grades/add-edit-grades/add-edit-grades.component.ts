import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GradesService } from 'src/app/services/grades.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
	selector: 'app-add-edit-grades',
	templateUrl: './add-edit-grades.component.html',
	styleUrls: ['./add-edit-grades.component.css']
})
export class AddEditGradesComponent implements OnInit {
	isLoading: boolean = false;
	formGroup: FormGroup;
	constructor(private fb: FormBuilder, public modal: NgbActiveModal, public gradeservice: GradesService, public sharedservice: SharedService) { }

	ngOnInit(): void {
		this.setFormGroup();
	}

	//Set Form Group
	setFormGroup() {
		this.formGroup = this.fb.group({
			name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
		});
	}

	//Final save
	save() {
		if (this.formGroup.invalid) {
			return
		}
		const formData = {};
		formData['name'] = this.formGroup.controls.name.value;
		if (!this.isLoading) {
			this.isLoading = true;
			this.gradeservice.createGrades(formData).subscribe((res: any) => {
				if (res) {
					this.isLoading = false;
					this.modal.close();
					this.sharedservice.swalSuccess(res.message);
				}
			}, err => {
				this.isLoading = false;
				this.sharedservice.swalError(err);
			})
		}
	}

	//Close model
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
