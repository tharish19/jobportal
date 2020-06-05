import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSelectionComponent } from './job-selection.component';

describe('JobSelectionComponent', () => {
  let component: JobSelectionComponent;
  let fixture: ComponentFixture<JobSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
