import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubAdminComponent } from './delete-sub-admin.component';

describe('DeleteSubAdminComponent', () => {
  let component: DeleteSubAdminComponent;
  let fixture: ComponentFixture<DeleteSubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSubAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
