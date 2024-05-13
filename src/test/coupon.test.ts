import { faker } from '@faker-js/faker';
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

describe('getCoupons', () => {
  it('should return arrays of coupon', async () => {
    const data = {
      page: 1,
      limit: 10,
      keyword: 'abc',
      percentage: 30,
      startDate: new Date('2024-03-30'),
      endDate: new Date('2024-05-30'),
    };

    const {coupons, count} = await couponService.getCoupons(data);

    const words = data.keyword.toLocaleLowerCase().split(' ');

    expect(count).toBeGreaterThanOrEqual(0);
    expect(coupons).toBeInstanceOf(Array);
    coupons.forEach(coupon => {
      expect(coupon).toBeInstanceOf(Coupon);
      expect(new Date(coupon.startDate).getTime()).toBeLessThanOrEqual(new Date(data.startDate).getTime());
      expect(new Date(coupon.endDate).getTime()).toBeGreaterThanOrEqual(new Date(data.endDate).getTime());
      expect(coupon.percentage).toEqual(data.percentage);
      const nameContainsKeyword = words.some(word => coupon.name.toLocaleLowerCase().includes(word));
      expect(nameContainsKeyword).toBe(true);
    });
  });
});

describe('getCouponByName', () => {
  it('should find a coupon by its name', async () => {
    const coupon = await couponService.findCouponByName('sale-20%');

    expect(coupon).toBeInstanceOf(Coupon);
    expect(coupon.name).toEqual('sale-20%');
  });

  it('should return null if no coupon found with the given name', async () => {
    const coupon = await couponService.findCouponByName('nonexistent-coupon');

    expect(coupon).toBeNull();
  });
});

describe('createCoupon', () => {
  it('should return a new coupon', async () => {
    const data = {
      name: faker.internet.displayName(),
      percentage: faker.number.int({min: 1, max: 100}),
      startDate: faker.date.anytime(),
      endDate: faker.date.anytime(),
    };

    const coupon = await couponService.createCoupon(data);

    expect(coupon).toBeInstanceOf(Coupon);
    expect(coupon.name).toEqual(data.name);
    expect(coupon.percentage).toEqual(data.percentage);
    expect(new Date(coupon.startDate).getTime()).toBeLessThanOrEqual(new Date(data.startDate).getTime());
    expect(new Date(coupon.endDate).getTime()).toBeGreaterThanOrEqual(new Date(data.endDate).getTime());
  });
});

describe('getCouponById', () => {
  it('should find a coupon by its id', async () => {
    const randomId = faker.number.int({min: 1, max:5});

    const coupon = await couponService.getCouponById(randomId);

    expect(coupon).toBeInstanceOf(Coupon);
    expect(coupon.id).toEqual(randomId);
  });
});

describe('updateCoupon', () => {
  it('should return a new coupon', async () => {
    const randomId = faker.number.int({min: 1, max:5});

    const coupon = await couponService.getCouponById(randomId);
    
    const data = {
      name: faker.internet.displayName(),
      percentage: faker.number.int({min: 1, max: 100}),
      startDate: faker.date.anytime(),
      endDate: faker.date.anytime(),
    };

    const newCoupon = await couponService.updateCoupon(coupon, data);

    expect(newCoupon).toBeInstanceOf(Coupon);
    expect(newCoupon.name).toEqual(data.name);
    expect(newCoupon.percentage).toEqual(data.percentage);
    expect(new Date(newCoupon.startDate).getTime()).toBeLessThanOrEqual(new Date(data.startDate).getTime());
    expect(new Date(newCoupon.endDate).getTime()).toBeGreaterThanOrEqual(new Date(data.endDate).getTime());
  });
});
