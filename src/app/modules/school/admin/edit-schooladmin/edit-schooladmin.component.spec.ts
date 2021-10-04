import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchooladminComponent } from './edit-schooladmin.component';

describe('EditSchooladminComponent', () => {
  let component: EditSchooladminComponent;
  let fixture: ComponentFixture<EditSchooladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSchooladminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchooladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
