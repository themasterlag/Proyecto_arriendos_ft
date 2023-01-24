import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarpdvComponent } from './registrarpdv.component';

describe('RegistrarpdvComponent', () => {
  let component: RegistrarpdvComponent;
  let fixture: ComponentFixture<RegistrarpdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarpdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarpdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
