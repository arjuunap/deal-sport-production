import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesCrud } from './cities-crud';

describe('CitiesCrud', () => {
  let component: CitiesCrud;
  let fixture: ComponentFixture<CitiesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitiesCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
