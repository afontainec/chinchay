import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { New$PASCAL_CASE$Component } from './new-$KEBAB_CASE$.component';

describe('New$PASCAL_CASE$ComponentComponent', () => {
  let httpClient: HttpClient;
  let component: New$PASCAL_CASE$Component;
  let fixture: ComponentFixture<New$PASCAL_CASE$Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule ],
      declarations: [ New$PASCAL_CASE$Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(New$PASCAL_CASE$Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});