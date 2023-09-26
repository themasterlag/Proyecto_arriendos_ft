import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InhautorizadoComponent } from './inhautorizado.component';

describe('InhautorizadoComponent', () => {
  let component: InhautorizadoComponent;
  let fixture: ComponentFixture<InhautorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InhautorizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InhautorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
