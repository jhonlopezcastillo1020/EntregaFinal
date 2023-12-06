import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalInstanciaComponent } from './form-modal-instancia.component';

describe('FormModalInstanciaComponent', () => {
  let component: FormModalInstanciaComponent;
  let fixture: ComponentFixture<FormModalInstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormModalInstanciaComponent]
    });
    fixture = TestBed.createComponent(FormModalInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
