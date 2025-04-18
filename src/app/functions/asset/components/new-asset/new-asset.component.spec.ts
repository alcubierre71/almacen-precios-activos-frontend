import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetComponent } from './new-asset.component';

describe('NewAssetComponent', () => {
  let component: NewAssetComponent;
  let fixture: ComponentFixture<NewAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAssetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
