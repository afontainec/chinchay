import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Edit$PASCAL_CASE$Component } from './edit-$KEBAB_CASE$.component';

describe('Edit$PASCAL_CASE$ComponentComponent', () => {
  let httpClient: HttpClient;
  let component: Edit$PASCAL_CASE$Component;
  let fixture: ComponentFixture<Edit$PASCAL_CASE$Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule ],
      declarations: [ Edit$PASCAL_CASE$Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(Edit$PASCAL_CASE$Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});