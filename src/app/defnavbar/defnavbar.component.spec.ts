import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefnavbarComponent } from './defnavbar.component';

describe('DefnavbarComponent', () => {
  let component: DefnavbarComponent;
  let fixture: ComponentFixture<DefnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
