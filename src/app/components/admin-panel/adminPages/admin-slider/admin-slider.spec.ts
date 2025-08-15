import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSlider } from './admin-slider';

describe('AdminSlider', () => {
  let component: AdminSlider;
  let fixture: ComponentFixture<AdminSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
