import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CountryService } from '../../../../../services';

@Component({
  selector: 'app-file-format-invalid-modal',
  templateUrl: './file-format-invalid.component.html',
  styleUrls: ['./file-format-invalid.component.scss']
})
export class FileFormatInvalidModel implements OnInit, OnDestroy {
  @Input() header: boolean;
  isLoading = false;
  subscriptions: Subscription[] = [];
  fileURL = './assets/media/error/CSV-error/test.csv';
  constructor(private customersService: CountryService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
