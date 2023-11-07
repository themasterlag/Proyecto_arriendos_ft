import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoNovedadesComponent } from './motivoNovedades.component';

describe('MotivoNovedadesComponent', () => {
  let component: MotivoNovedadesComponent;
  let fixture: ComponentFixture<MotivoNovedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotivoNovedadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
