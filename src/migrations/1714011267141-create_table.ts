import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1714011267141 implements MigrationInterface {
    name = 'CreateTable1714011267141';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `product` ADD `quantity_sold` int NOT NULL DEFAULT \'0\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `product` DROP COLUMN `quantity_sold`');
    }

}
