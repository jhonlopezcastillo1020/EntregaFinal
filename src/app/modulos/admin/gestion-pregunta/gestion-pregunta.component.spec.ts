import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPreguntaComponent } from './gestion-pregunta.component';

describe('GestionPreguntaComponent', () => {
  let component: GestionPreguntaComponent;
  let fixture: ComponentFixture<GestionPreguntaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionPreguntaComponent]
    });
    fixture = TestBed.createComponent(GestionPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
