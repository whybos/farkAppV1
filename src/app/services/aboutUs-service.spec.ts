import { TestBed } from '@angular/core/testing';

import { aboutUsService } from './aboutUs-service';

describe('UserService', () => {
  let service: aboutUsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(aboutUsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
