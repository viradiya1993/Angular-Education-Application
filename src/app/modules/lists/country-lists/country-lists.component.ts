import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';



import { DeleteCountryComponent } from './components/delete-country/delete-country.component';
import { EditCountryModalComponent } from './components/edit-country/edit-country.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { CountryService } from 'src/app/services/country.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
	selector: 'app-country-lists',
	templateUrl: './country-lists.component.html',
	styleUrls: ['./country-lists.component.css']
})
export class CountryListsComponent implements OnInit {
	searchKey: any = null;
	activeInactive: any;
	page: any = 1;
	limit: number = AppConst.pageSize;
	length: any;
	searchGroup: any;
	countryList = [];
	modelFunctionality = AppConst.modelOpenFunctionality;

	@ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		public countryService: CountryService,
		private cd: ChangeDetectorRef,
		public sharedService: SharedService
	) {
		//this.sharedService.showLoader();
	}

	ngOnInit(): void {
		this.searchForm();
		//this.getCountryList();
	}

	//Fetch Country
	getCountryList() {
		this.countryService.getCountry(this.searchKey, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader()
				this.countryList = res.data;
				this.length = res.count;
			}
		})
	}

	//Search 
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(
				debounceTime(150),
				distinctUntilChanged()
			)
			.subscribe((val) => console.log(val));
	}

	// form actions
	create() {
		this.edit(undefined);
	}

	// Form edit action
	edit(countryData: any) {
		const modalRef = this.modalService.open(EditCountryModalComponent, this.modelFunctionality);
		modalRef.componentInstance.countryData = countryData;
		modalRef.result.then((result) => {
			this.getCountryList();
		})

	}

	// Delete Single
	delete(id: number) {
		const modalRef = this.modalService.open(DeleteCountryComponent, this.modelFunctionality);
		modalRef.componentInstance.id = id;
		modalRef.result.then((result) => {
			this.getCountryList();
		})
	}

	//Filter country status
	countryStatus(data: any) {
		this.activeInactive = data;
		this.getCountryList();
	}

	//Search
	search(searchData: any) {
		if (this.searchKey !== searchData) {
			this.searchKey = searchData
			this.limit = AppConst.pageSize;
			this.page = 1;
			this.getCountryList();
		}
	}

	//Set Pagination Index
	receiveMessage(event: any) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.getCountryList();
	}
}
