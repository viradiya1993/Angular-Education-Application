import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDistrictsComponent } from './components/delete-district/delete-districts.component';
import { EditDistrictComponent } from './components/edit-district/edit-district.component';

import { CountryService, StatesService, DistrictService } from '../../../services';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-districts-lists',
  templateUrl: './districts-lists.component.html',
  styleUrls: ['./districts-lists.component.css']
})
export class DistrictsListsComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  length: any;
  stateId: any;
  stateList = [];
  districtList = [];


  constructor(
    private modalService: NgbModal,
    public commonservice: CommonService,
    public stateservice: StatesService,
    public districtService: DistrictService,
    public sharedservice: SharedService) { this.sharedservice.showLoader(); }

  ngOnInit(): void {
    this.getDistrictList();
    this.getStateList();
  }



  // form actions
  create() {
    this.edit(undefined);
  }

  edit(districtData: any) {
    const modalRef = this.modalService.open(EditDistrictComponent, this.modelFunctionality);
    modalRef.componentInstance.districtData = districtData;
    modalRef.result.then((result) => {
      this.getDistrictList();
    })
  }

  delete(id: any) {
    const modalRef = this.modalService.open(DeleteDistrictsComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getDistrictList();
    })
  }

  // Fetch State
  getStateList() {
    this.stateservice.getState('', '', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedservice.hideLoader();
        this.stateList = res.data;
      }
    })
  }

  // Fetch City
  getDistrictList() {
    this.districtService.getDistrict(this.searchKey, this.stateId, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.sharedservice.hideLoader();
        this.districtList = res.data;
        this.length = res.count;
      }
    }, err => {
      this.sharedservice.hideLoader();
      Swal.fire({
        icon: 'error',
        text: err
      });
      //this.sharedservice.loggerError(err.message);
    })
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getDistrictList();
    }
  }

  //Filter state 
  Filterstate(data: any) {
    this.stateId = data?._id;
    this.getDistrictList();
  }

  //Filter district status
  districtStatus(data: any) {
    this.activeInactive = data?.value;
    this.getDistrictList();
  }


  //Set Pagination Index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getDistrictList();
  }

  //Active Inactive District
  activeInactiveDistrict(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to active district?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.districtService.activeInactiveDistrict(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.getDistrictList();
              Swal.fire({
                icon: 'success',
                text: res.message,
              });
            }
          }, err => {
            this.sharedservice.hideLoader();
            Swal.fire({
              icon: 'error',
              text: err
            });
          })
        }
      })
    } else {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Deactive district?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.districtService.activeInactiveDistrict(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.getDistrictList();
              Swal.fire({
                icon: 'success',
                text: res.message,
              });
            }
          }, err => {
            this.sharedservice.hideLoader();
            Swal.fire({
              icon: 'error',
              text: err
            });
          })
        }
      })
    }
  }
}
