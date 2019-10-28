import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioPage } from './cuestionario.page';

describe('CuestionarioPage', () => {
  let component: CuestionarioPage;
  let fixture: ComponentFixture<CuestionarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuestionarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuestionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
