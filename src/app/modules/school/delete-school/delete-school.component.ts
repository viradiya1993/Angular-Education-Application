import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SchoolsService } from '../../../services';

@Component({
  selector: 'app-delete-school-modal',
  templateUrl: './delete-school.component.html',
  styleUrls: ['./delete-school.component.scss']
})
export class DeleteSchoolComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private schoolService: SchoolsService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.isLoading = true;
    const sb = this.schoolService.deleteSchool(this.id).pipe(
      delay(1000),
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(res => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: err.message,
      });
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
