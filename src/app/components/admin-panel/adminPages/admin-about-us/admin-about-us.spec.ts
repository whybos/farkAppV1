import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutUs } from './admin-about-us';

describe('AdminAboutUs', () => {
  let component: AdminAboutUs;
  let fixture: ComponentFixture<AdminAboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAboutUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
