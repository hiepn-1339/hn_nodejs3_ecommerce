export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum LengthInput {
  MIN_LENGTH = 6,
  MAX_LENGTH = 20,

  MIN_LENGTH_TEXT = 1,
  MAX_LENGTH_TEXT = 255,
}

export enum Query {
  PAGE_DEFAULT = 1,
  LIMIT_DEFAULT = 9,
}

export enum ErrorCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400
}

export enum Status {
  SUCCESS = 'Success',
  FAIL = 'Fail',
  ERROR = 'Error',
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
