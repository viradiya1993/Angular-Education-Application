import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DistrictService } from '../../../../../services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-districts-city',
  templateUrl: './delete-districts.component.html',
  styleUrls: ['./delete-districts.component.scss']
})
export class DeleteDistrictsComponent implements OnInit {
  @Input() id: any;
  isLoading = false;

  constructor(
    public districtService: DistrictService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  deleteDistrict() {
   if (!this.isLoading) {
     this.isLoading = true;
     this.districtService.deleteDistrict(this.id).subscribe((res: any) => {
       if (res) {
         this.modal.close();
         Swal.fire({
          icon: 'success',
          text: res.message,
        });
       }
     }, err => {
      Swal.fire({
        icon: 'error',
        text: err
      });
     })
   }
  }

  //Model Close
  cancel() {
    this.modal.close();
  }

  ngOnDestroy(): void {
    
  }

}
