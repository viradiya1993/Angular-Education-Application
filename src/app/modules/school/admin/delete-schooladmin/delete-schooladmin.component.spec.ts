import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSchooladminComponent } from './delete-schooladmin.component';

describe('DeleteSchooladminComponent', () => {
  let component: DeleteSchooladminComponent;
  let fixture: ComponentFixture<DeleteSchooladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSchooladminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSchooladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
