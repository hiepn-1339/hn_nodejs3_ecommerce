import { LessThanOrEqual, MoreThan } from 'typeorm';
import { AppDataSource } from '../database/dataSource';
import { Coupon } from '../entities/coupon.entity';

const couponRepository = AppDataSource.getRepository(Coupon);

export const findCouponByName = async (name: string) => {
  return await couponRepository.findOne({
    where: {
      name,
      startDate: LessThanOrEqual(new Date()),
      endDate: MoreThan(new Date()),
    },
  });
};
