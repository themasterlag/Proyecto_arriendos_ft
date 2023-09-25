import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalVinculadoComponent } from './personal-vinculado.component';

describe('PersonalVinculadoComponent', () => {
  let component: PersonalVinculadoComponent;
  let fixture: ComponentFixture<PersonalVinculadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalVinculadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalVinculadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
