
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { Show$PASCAL_CASE$Component } from './show-$KEBAB_CASE$.component';

describe('Show$PASCAL_CASE$ComponentComponent', () => {
  let httpClient: HttpClient;
  let component: Show$PASCAL_CASE$Component;
  let fixture: ComponentFixture<Show$PASCAL_CASE$Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule ],
      declarations: [ Show$PASCAL_CASE$Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(Show$PASCAL_CASE$Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});