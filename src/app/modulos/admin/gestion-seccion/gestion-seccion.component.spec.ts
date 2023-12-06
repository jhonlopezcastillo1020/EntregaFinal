import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSeccionComponent } from './gestion-seccion.component';

describe('GestionSeccionComponent', () => {
  let component: GestionSeccionComponent;
  let fixture: ComponentFixture<GestionSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionSeccionComponent]
    });
    fixture = TestBed.createComponent(GestionSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
