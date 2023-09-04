import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementosComponent } from './incrementos.component';

describe('IncrementosComponent', () => {
  let component: IncrementosComponent;
  let fixture: ComponentFixture<IncrementosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncrementosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
