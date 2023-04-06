import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitRebaseComponent } from './unit-rebase.component';

describe('UnitRebaseComponent', () => {
  let component: UnitRebaseComponent;
  let fixture: ComponentFixture<UnitRebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitRebaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitRebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
