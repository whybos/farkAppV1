import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlog } from './admin-blog';

describe('AdminBlog', () => {
  let component: AdminBlog;
  let fixture: ComponentFixture<AdminBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
