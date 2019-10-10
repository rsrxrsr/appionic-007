import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasoPage } from './caso.page';

describe('CasoPage', () => {
  let component: CasoPage;
  let fixture: ComponentFixture<CasoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
