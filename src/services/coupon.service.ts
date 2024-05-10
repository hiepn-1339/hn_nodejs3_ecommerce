import { LessThanOrEqual, MoreThan } from 'typeorm';
import { AppDataSource } from '../database/dataSource';
import { Coupon } from '../entities/coupon.entity';
import dayjs from 'dayjs';

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

export const getCoupons = async (data: any) => {
  const query = couponRepository.createQueryBuilder('coupon');

  if (data.keyword) {
    query.where('MATCH(coupon.name) AGAINST (:keyword IN BOOLEAN MODE)', { keyword: data.keyword });
  }

  if (data.percentage) {
    query.andWhere('coupon.percentage = :percentage', {
      percentage: data.percentage,
    });
  }

  if (data.startDate) {
    query.andWhere('coupon.startDate >= :startDate', {
      startDate: dayjs(data.startDate).startOf('day').toDate(),
    });
  }

  if (data.endDate) {
    query.andWhere('coupon.endDate <= :endDate', {
      endDate: dayjs(data.endDate).endOf('day').toDate(),
    });
  }

  const count = await query.getCount();

  const coupons = await query
    .orderBy('coupon.created_at', 'DESC')
    .limit(data.limit)
    .offset((data.page - 1) * data.limit)
    .getMany();


  return {coupons, count};
};
