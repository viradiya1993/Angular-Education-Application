import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppConst } from '../constant/app.constant';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  // MatPaginator Inputs
  length: any;
  pageSize = AppConst.pageSize;
  pageSizeOptions: number[] = AppConst.pageSizeOptions;
  pageEvent: PageEvent;
  offSet: any = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() childMessage: number;
  @Input() index: number;
  @Output() messageEvent = new EventEmitter<any>();
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // console.log(this.childMessage, this.index);

  }

  ngOnChanges() {
    this.cdr.detectChanges();
    this.paginator.pageIndex = this.index;
  }

  getNext(event: PageEvent) {
    // console.log(event);
    this.messageEvent.emit(event);
    // if (this.childMessage >= 10) {
    //   this.messageEvent.emit(event);
    // }
  }


}
