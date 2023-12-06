import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormUsuarioComponent } from './modal-form-usuario.component';

describe('ModalFormUsuarioComponent', () => {
  let component: ModalFormUsuarioComponent;
  let fixture: ComponentFixture<ModalFormUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormUsuarioComponent]
    });
    fixture = TestBed.createComponent(ModalFormUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
