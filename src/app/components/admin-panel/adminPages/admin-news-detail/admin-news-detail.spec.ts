import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewsDetail } from './admin-news-detail';

describe('AdminNewsDetail', () => {
  let component: AdminNewsDetail;
  let fixture: ComponentFixture<AdminNewsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewsDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewsDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
