import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CountryService } from '../../../../../services';

@Component({
  selector: 'app-delete-country-modal',
  templateUrl: './delete-country.component.html',
  styleUrls: ['./delete-country.component.scss']
})
export class DeleteCountryComponent implements OnInit {
  @Input() id: number;
  isLoading: boolean = false;


  constructor(public sharedService: SharedService, private countryService: CountryService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  //Delete Country
  deleteCountry() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.countryService.deleteCountry(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.loggerSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.modal.close();
        this.sharedService.loggerSuccess(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }


}
