import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionPage } from './accion.page';

describe('AccionPage', () => {
  let component: AccionPage;
  let fixture: ComponentFixture<AccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
