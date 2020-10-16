import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { TestBed } from '@angular/core/testing';

import { $PASCAL_CASE$Service } from './$KEBAB_CASE$.service';

describe('$CAMEL_CASE$Service', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', () => {
  httpClient = TestBed.get(HttpClient);
  const service: $PASCAL_CASE$Service = TestBed.get($PASCAL_CASE$Service);
  expect(service).toBeTruthy();
  });
});
