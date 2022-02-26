import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFooterComponent } from './fixed-footer.component';

describe('FixedFooterComponent', () => {
  let component: FixedFooterComponent;
  let fixture: ComponentFixture<FixedFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
