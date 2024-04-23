import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1713779232136 implements MigrationInterface {
    name = 'CreateTable1713779232136';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `product_image` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `url` varchar(255) NOT NULL, `product_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `cart` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `user_id` int NULL, UNIQUE INDEX `REL_f091e86a234693a49084b4c2c8` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `cart_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `quantity` int NOT NULL, `product_id` int NULL, `cart_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `coupon` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `percentage` int NOT NULL, `start_date` timestamp NOT NULL, `end_date` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `order` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `total` int NOT NULL, `name` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `payment_method` enum (\'BANK_TRANSFER\', \'CASH_ON_DELIVERY\') NOT NULL DEFAULT \'CASH_ON_DELIVERY\', `status` enum (\'PENDING\', \'APPROVED\', \'REJECTED\', \'CANCELLED\', \'COMPLETED\') NOT NULL DEFAULT \'PENDING\', `address` varchar(255) NOT NULL, `note` text NULL, `user_id` int NULL, `coupon_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `order_item` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `quantity` int NOT NULL, `price` int NOT NULL, `product_id` int NULL, `order_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `product` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `price` int NOT NULL, `description` varchar(255) NOT NULL, `rating_avg` float NOT NULL, `category_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `rating` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `comment` varchar(255) NULL, `rating_point` int NOT NULL, `product_id` int NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` enum (\'ADMIN\', \'USER\') NOT NULL DEFAULT \'USER\', `phone` varchar(255) NOT NULL, `gender` enum (\'MALE\', \'FEMALE\', \'OTHER\') NULL, `date_of_birth` date NULL, `avatar` varchar(255) NULL, `address` varchar(255) NOT NULL, `is_active` tinyint NOT NULL DEFAULT 0, `token_active` varchar(255) NULL, `token_active_expires` datetime NULL, `token_reset_password` varchar(255) NULL, `token_reset_password_expires` datetime NULL, `cart_id` int NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `REL_c506b756aa0682057bf66bdb3d` (`cart_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `slider_image` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `url` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `product_image` ADD CONSTRAINT `FK_dbc7d9aa7ed42c9141b968a9ed3` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `cart` ADD CONSTRAINT `FK_f091e86a234693a49084b4c2c86` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `cart_item` ADD CONSTRAINT `FK_67a2e8406e01ffa24ff9026944e` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `cart_item` ADD CONSTRAINT `FK_b6b2a4f1f533d89d218e70db941` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `order` ADD CONSTRAINT `FK_199e32a02ddc0f47cd93181d8fd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `order` ADD CONSTRAINT `FK_baced9282892a60354aaa789fb4` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `order_item` ADD CONSTRAINT `FK_5e17c017aa3f5164cb2da5b1c6b` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `order_item` ADD CONSTRAINT `FK_e9674a6053adbaa1057848cddfa` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `product` ADD CONSTRAINT `FK_0dce9bc93c2d2c399982d04bef1` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `rating` ADD CONSTRAINT `FK_2432a0d3bcc975f29eb1e43456b` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `rating` ADD CONSTRAINT `FK_17618c8d69b7e2e287bf9f8fbb3` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `user` ADD CONSTRAINT `FK_c506b756aa0682057bf66bdb3d3` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `user` DROP FOREIGN KEY `FK_c506b756aa0682057bf66bdb3d3`');
        await queryRunner.query('ALTER TABLE `rating` DROP FOREIGN KEY `FK_17618c8d69b7e2e287bf9f8fbb3`');
        await queryRunner.query('ALTER TABLE `rating` DROP FOREIGN KEY `FK_2432a0d3bcc975f29eb1e43456b`');
        await queryRunner.query('ALTER TABLE `product` DROP FOREIGN KEY `FK_0dce9bc93c2d2c399982d04bef1`');
        await queryRunner.query('ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e9674a6053adbaa1057848cddfa`');
        await queryRunner.query('ALTER TABLE `order_item` DROP FOREIGN KEY `FK_5e17c017aa3f5164cb2da5b1c6b`');
        await queryRunner.query('ALTER TABLE `order` DROP FOREIGN KEY `FK_baced9282892a60354aaa789fb4`');
        await queryRunner.query('ALTER TABLE `order` DROP FOREIGN KEY `FK_199e32a02ddc0f47cd93181d8fd`');
        await queryRunner.query('ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_b6b2a4f1f533d89d218e70db941`');
        await queryRunner.query('ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_67a2e8406e01ffa24ff9026944e`');
        await queryRunner.query('ALTER TABLE `cart` DROP FOREIGN KEY `FK_f091e86a234693a49084b4c2c86`');
        await queryRunner.query('ALTER TABLE `product_image` DROP FOREIGN KEY `FK_dbc7d9aa7ed42c9141b968a9ed3`');
        await queryRunner.query('DROP TABLE `slider_image`');
        await queryRunner.query('DROP INDEX `REL_c506b756aa0682057bf66bdb3d` ON `user`');
        await queryRunner.query('DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`');
        await queryRunner.query('DROP TABLE `user`');
        await queryRunner.query('DROP TABLE `rating`');
        await queryRunner.query('DROP TABLE `product`');
        await queryRunner.query('DROP TABLE `order_item`');
        await queryRunner.query('DROP TABLE `order`');
        await queryRunner.query('DROP TABLE `coupon`');
        await queryRunner.query('DROP TABLE `cart_item`');
        await queryRunner.query('DROP INDEX `REL_f091e86a234693a49084b4c2c8` ON `cart`');
        await queryRunner.query('DROP TABLE `cart`');
        await queryRunner.query('DROP TABLE `product_image`');
        await queryRunner.query('DROP TABLE `category`');
    }

}
