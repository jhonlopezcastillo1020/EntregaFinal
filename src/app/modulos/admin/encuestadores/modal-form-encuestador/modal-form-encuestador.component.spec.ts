import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormEncuestadorComponent } from './modal-form-encuestador.component';

describe('ModalFormEncuestadorComponent', () => {
  let component: ModalFormEncuestadorComponent;
  let fixture: ComponentFixture<ModalFormEncuestadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormEncuestadorComponent]
    });
    fixture = TestBed.createComponent(ModalFormEncuestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
