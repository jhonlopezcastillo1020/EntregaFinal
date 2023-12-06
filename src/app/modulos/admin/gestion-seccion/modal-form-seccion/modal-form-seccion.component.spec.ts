import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormSeccionComponent } from './modal-form-seccion.component';

describe('ModalFormSeccionComponent', () => {
  let component: ModalFormSeccionComponent;
  let fixture: ComponentFixture<ModalFormSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormSeccionComponent]
    });
    fixture = TestBed.createComponent(ModalFormSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
