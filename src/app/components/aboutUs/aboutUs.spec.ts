import { ComponentFixture, TestBed } from '@angular/core/testing';

import { aboutUs } from './aboutUs';

describe('Users', () => {
  let component: aboutUs;
  let fixture: ComponentFixture<aboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [aboutUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(aboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
