import { TestBed } from '@angular/core/testing';

import { newsDetailService } from './newsDetail-service';

describe('newsDetailService', () => {
  let service: newsDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(newsDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
