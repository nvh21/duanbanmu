import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherModal } from './voucher-modal';

describe('VoucherModal', () => {
  let component: VoucherModal;
  let fixture: ComponentFixture<VoucherModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
