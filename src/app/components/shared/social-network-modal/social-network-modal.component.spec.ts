import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkModalComponent } from './social-network-modal.component';

describe('SocialNetworkModalComponent', () => {
  let component: SocialNetworkModalComponent;
  let fixture: ComponentFixture<SocialNetworkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialNetworkModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialNetworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
