import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanciaComponent } from './instancia.component';

describe('InstanciaComponent', () => {
  let component: InstanciaComponent;
  let fixture: ComponentFixture<InstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanciaComponent]
    });
    fixture = TestBed.createComponent(InstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
