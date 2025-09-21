import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkTypeModalComponent } from './social-network-type-modal.component';

describe('SocialNetworkTypeModalComponent', () => {
  let component: SocialNetworkTypeModalComponent;
  let fixture: ComponentFixture<SocialNetworkTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialNetworkTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialNetworkTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
