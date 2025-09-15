import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkTypesComponent } from './social-network-types.component';

describe('SocialNetworkTypesComponent', () => {
  let component: SocialNetworkTypesComponent;
  let fixture: ComponentFixture<SocialNetworkTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialNetworkTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialNetworkTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
