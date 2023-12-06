import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormEncuestaComponent } from './modal-form-encuesta.component';

describe('ModalFormEncuestaComponent', () => {
  let component: ModalFormEncuestaComponent;
  let fixture: ComponentFixture<ModalFormEncuestaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormEncuestaComponent]
    });
    fixture = TestBed.createComponent(ModalFormEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
