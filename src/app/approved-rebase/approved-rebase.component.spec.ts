import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRebaseComponent} from "./approved-rebase.component";

describe('NotificationComponent', () => {
  let component: ApprovedRebaseComponent;
  let fixture: ComponentFixture<ApprovedRebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedRebaseComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApprovedRebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
