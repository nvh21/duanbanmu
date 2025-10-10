import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherForm } from './voucher-form';

describe('VoucherForm', () => {
  let component: VoucherForm;
  let fixture: ComponentFixture<VoucherForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
