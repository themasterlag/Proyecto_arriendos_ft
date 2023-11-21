import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPagoNovedadesComponent } from './tipo-pago-novedades.component';

describe('TipoPagoNovedadesComponent', () => {
  let component: TipoPagoNovedadesComponent;
  let fixture: ComponentFixture<TipoPagoNovedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPagoNovedadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPagoNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
