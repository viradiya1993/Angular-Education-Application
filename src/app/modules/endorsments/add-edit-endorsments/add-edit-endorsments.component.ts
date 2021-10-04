import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EndorsmentsService } from 'src/app/services/endorsments.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-add-edit-endorsments',
	templateUrl: './add-edit-endorsments.component.html',
	styleUrls: ['./add-edit-endorsments.component.css']
})
export class AddEditEndorsmentsComponent implements OnInit {
	@Input() endorsments: any;
	isLoading: boolean = false;
	editable = false;
	formGroup: FormGroup;


	constructor(private fb: FormBuilder, public modal: NgbActiveModal, public endorsmentsService: EndorsmentsService, public sharedservice: SharedService) { }

	ngOnInit(): void {
		this.loadForm();
	}
	get f() { return this.formGroup.controls; }

	//Load Form
	loadForm() {
		if (!this.endorsments) {
			this.editable = false;
			this.setFormGroup();
		} else {
			this.editable = true;
			this.setFormGroup();
			this.formGroup.patchValue(this.endorsments);
			this.formGroup.controls.number.disable();

		}
	}

	//Set Form Group
	setFormGroup() {
		this.formGroup = this.fb.group({
			name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
			number: ['', Validators.compose([Validators.required, Validators.min(100), Validators.max(1000000)])],
		});
	}

	//Final save
	save() {
		if (this.editable) {
			this.edit();
		} else {
			this.create();
		}
	}

	//Add Create
	create() {
		if (this.formGroup.invalid) {
			return
		}
		const formData = {};
		formData['name'] = this.formGroup.controls.name.value;
		formData['number'] = String(this.formGroup.controls.number.value);
		if (!this.isLoading) {
			this.isLoading = true;
			this.endorsmentsService.addEndorsments(formData).subscribe((res: any) => {
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

	//Edit Update
	edit() {
		const formData = {};
		formData['name'] = this.formGroup.controls.name.value;
		formData['number'] = String(this.formGroup.controls.number.value);
		if (!this.isLoading) {
			this.isLoading = true;
			this.endorsmentsService.updateEndorsments(formData, this.endorsments._id).subscribe((res: any) => {
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
