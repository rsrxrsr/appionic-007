import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalmapaPage } from './modalmapa.page';

describe('ModalmapaPage', () => {
  let component: ModalmapaPage;
  let fixture: ComponentFixture<ModalmapaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalmapaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalmapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
