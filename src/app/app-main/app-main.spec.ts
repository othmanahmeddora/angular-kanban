import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMain } from './app-main';

describe('AppMain', () => {
  let component: AppMain;
  let fixture: ComponentFixture<AppMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMain],
    }).compileComponents();

    fixture = TestBed.createComponent(AppMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
