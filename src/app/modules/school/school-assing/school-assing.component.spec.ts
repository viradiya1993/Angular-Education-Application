import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAssingComponent } from './school-assing.component';

describe('SchoolAssingComponent', () => {
  let component: SchoolAssingComponent;
  let fixture: ComponentFixture<SchoolAssingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolAssingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAssingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
