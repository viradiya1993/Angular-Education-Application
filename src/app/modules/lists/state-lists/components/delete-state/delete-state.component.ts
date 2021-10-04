import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StatesService } from '../../../../../services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-delete-customer-modal',
  templateUrl: './delete-state.component.html',
  styleUrls: ['./delete-state.component.scss']
})
export class DeleteStateComponent implements OnInit {
  @Input() id: any;
  isLoading = false;

  constructor(private stateService: StatesService, public modal: NgbActiveModal, public sharedService: SharedService) { }

  ngOnInit(): void {
  }

  deleteState() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.stateService.deleteState(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          //this.sharedService.loggerSuccess(res.message);
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
        }
      }, err => {
        this.isLoading = false;
        //this.sharedService.loggerError(err);
        Swal.fire({
          icon: 'error',
          title: err
        });
      })
    }
  }
}
