import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1711873987072 implements MigrationInterface {
    name = 'Auto1711873987072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refreshToken" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refreshToken" SET NOT NULL`);
    }

}
