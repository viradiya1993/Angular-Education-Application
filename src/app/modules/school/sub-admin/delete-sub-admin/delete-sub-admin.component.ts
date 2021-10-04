import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubAdminService } from 'src/app/services';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-delete-sub-admin',
  templateUrl: './delete-sub-admin.component.html',
  styleUrls: ['./delete-sub-admin.component.scss']
})
export class DeleteSubAdminComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  constructor(public subAdmin: SubAdminService,public shared: SharedService, private modalService: NgbModal, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteSubAdmin() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.subAdmin.deleteSubAdmin(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.shared.swalSuccess(res.message);
          this.modal.close();
        }
      }, err => {
        this.isLoading = false;
        this.shared.swalError(err);
      })
    }
  }
  //close
  close() {
    this.modal.close();
  }
}