import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripsComponent } from './edit-trips.component';

describe('EditTripsComponent', () => {
  let component: EditTripsComponent;
  let fixture: ComponentFixture<EditTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
