import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketComponent } from './new-market.component';

describe('NewMarketComponent', () => {
  let component: NewMarketComponent;
  let fixture: ComponentFixture<NewMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMarketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
