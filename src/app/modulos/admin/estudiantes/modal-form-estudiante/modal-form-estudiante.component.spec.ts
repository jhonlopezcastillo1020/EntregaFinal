import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormEstudianteComponent } from './modal-form-estudiante.component';

describe('ModalFormEstudianteComponent', () => {
  let component: ModalFormEstudianteComponent;
  let fixture: ComponentFixture<ModalFormEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormEstudianteComponent]
    });
    fixture = TestBed.createComponent(ModalFormEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
