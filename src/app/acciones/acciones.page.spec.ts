import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionesPage } from './acciones.page';

describe('AccionesPage', () => {
  let component: AccionesPage;
  let fixture: ComponentFixture<AccionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
