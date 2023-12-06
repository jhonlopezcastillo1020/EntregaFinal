import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormInstitucionComponent } from './modal-form-institucion.component';

describe('ModalFormInstitucionComponent', () => {
  let component: ModalFormInstitucionComponent;
  let fixture: ComponentFixture<ModalFormInstitucionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormInstitucionComponent]
    });
    fixture = TestBed.createComponent(ModalFormInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
