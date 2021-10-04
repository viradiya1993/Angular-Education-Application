import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EndorsmentsService } from 'src/app/services/endorsments.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-delete-endorsments',
  templateUrl: './delete-endorsments.component.html',
  styleUrls: ['./delete-endorsments.component.css']
})
export class DeleteEndorsmentsComponent implements OnInit {
  @Input() id: any;
  isLoading = false;

  constructor(public endorsmentsService: EndorsmentsService, public modal: NgbActiveModal, public sharedservice: SharedService) { }

  ngOnInit(): void {
  }

  //Delete endorsement 
  deleteEndorsement () {
    if (!this.isLoading) {
      this.isLoading = true;
      this.endorsmentsService.deleteEndorsement(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          Swal.fire(res.message);
        }
      }, err => {
        this.isLoading = false;
        Swal.fire(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }

}
