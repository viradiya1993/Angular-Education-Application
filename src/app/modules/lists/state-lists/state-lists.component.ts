import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteStateComponent } from './components/delete-state/delete-state.component';
import { EditStatesModalComponent } from './components/edit-states/edit-states.component';

import { StatesService } from '../../../services';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2'
import { FileFormatInvalidModel } from './components/file-format-invalid/file-format-invalid.component';



@Component({
  selector: 'app-state-lists',
  templateUrl: './state-lists.component.html',
  styleUrls: ['./state-lists.component.css']
})
export class StateListsComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  length: any;
  countryList = [];
  stateList = [];


  constructor(
    private modalService: NgbModal,
    public stateService: StatesService,
    public sharedservice: SharedService,
    public commonservice: CommonService) { this.sharedservice.showLoader(); }

  ngOnInit(): void {
    this.getStateList();
  }

  //Fetch State
  getStateList() {
    this.stateService.getState(this.searchKey, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.sharedservice.hideLoader();
        this.stateList = res.data;
        this.length = res.count;
      }
    }, err => {
      this.sharedservice.hideLoader();
      //this.sharedservice.loggerError(err);
      Swal.fire({
        icon: 'error',
        title: err
      });
    })
  }



  // form actions
  create() {
    this.edit(undefined);
  }

  //Form edit actions
  edit(stateData: any) {
    const modalRef = this.modalService.open(EditStatesModalComponent, this.modelFunctionality);
    modalRef.componentInstance.stateData = stateData;
    modalRef.result.then((result) => {
      this.getStateList();
    })

  }

  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteStateComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getStateList();
    })
  }

  //Filter state status
  stateStatus(data: any) {
    this.activeInactive = data?.value;
    this.getStateList();
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getStateList();
    }
  }

  //Active Inactive State
  activeInactiveState(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this State?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.stateService.activeInactiveState(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.getStateList();
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
        text: 'Do you want to Deactivate this State?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.stateService.activeInactiveState(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.getStateList();
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

  //Set Pagination Index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getStateList();
  }

  //Add CSV file
  onAddFile(fileEvent) {
    const file = fileEvent.target.files[0];
    const fileName = file.name;
    if (!this.validateFile(fileName)) {
      // Open Model to show filename is not correct
      const modalRef = this.modalService.open(FileFormatInvalidModel, this.modelFunctionality);
      modalRef.result.then((result) => {
        this.getStateList();
      })
      return false;
    }
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csv: any = reader.result;
      let allTextLines = [];
      allTextLines = csv.split(/\r|\n|\r/);

      // Table Headings
      const headers = allTextLines[0].split(';');
      const headersValue = headers[0].split('\t');
      const headersCommaValue = headersValue[0].split(',');
      // console.log(headersCommaValue);
      if (!this.validateFileHeaders(headersCommaValue)) {
        // Open Model to show filename is not correct
        const modalRef = this.modalService.open(FileFormatInvalidModel);
        modalRef.componentInstance.header = true;
        modalRef.result.then((result) => {
          this.getStateList();
        })
        return false;
      } else {
        const formData = new FormData();
        formData.append('csv_file', file);
        this.stateService.uploadCSVFile(formData).subscribe((res: any) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: res.message,
            });
          }
        }, err => {
          Swal.fire({
            icon: 'error',
            title: err.message
          });
        });
      }
    };

  }

  // CSV Validation
  validateFile(name: string) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'csv') {
      return true;
    }
    else {
      return false;
    }
  }
  // CSV Validation Header
  validateFileHeaders(value) {
    let returnValue = false;
    // value[0].toLowerCase() === 'country_code' ?
    // value[1].toLowerCase() === 'country' ?
    value[2].toLowerCase() === 'state' ?
      value[3].toLowerCase() === 'district' ? returnValue = true : returnValue = false
      : returnValue = false
    // : returnValue = false
    // : returnValue = false;

    return returnValue;
  }
}


