import { AppDataSource } from '../database/dataSource';
import { Coupon } from '../entities/coupon.entity';
import * as couponService from '../services/coupon.service';

let connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
});

afterAll(async () => {
  await connection.destroy();
});

describe('findCouponByName', () => {
  it('should find a coupon by its name within valid date range', async () => {
    const coupon = await couponService.findCouponByName('sale-20%');

    expect(coupon).toBeInstanceOf(Coupon);
    expect(coupon.name).toEqual('sale-20%');
    expect(new Date(coupon.startDate).getTime()).toBeLessThanOrEqual(new Date().getTime());
    expect(new Date(coupon.endDate).getTime()).toBeGreaterThan(new Date().getTime());
  });

  it('should return null if no coupon found with the given name', async () => {
    const coupon = await couponService.findCouponByName('nonexistent-coupon');

    expect(coupon).toBeNull();
  });
});
