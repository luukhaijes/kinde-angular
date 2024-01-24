import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedOutComponent } from './logged-out.component';

describe('LoggedOutComponent', () => {
  let component: LoggedOutComponent;
  let fixture: ComponentFixture<LoggedOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoggedOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoggedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
