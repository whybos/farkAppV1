import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForms } from './admin-forms';

describe('AdminForms', () => {
  let component: AdminForms;
  let fixture: ComponentFixture<AdminForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
