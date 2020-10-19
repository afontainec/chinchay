import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { Index$PASCAL_CASE$Component } from './index-$KEBAB_CASE$.component';

describe('Index$PASCAL_CASE$ComponentComponent', () => {
  let httpClient: HttpClient;
  let component: Index$PASCAL_CASE$Component;
  let fixture: ComponentFixture<Index$PASCAL_CASE$Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule ],
      declarations: [ Index$PASCAL_CASE$Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(Index$PASCAL_CASE$Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});