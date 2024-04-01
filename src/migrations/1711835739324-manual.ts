import { MigrationInterface, QueryRunner } from 'typeorm'

export class Manual1711835739324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('INSERT INTO "public"."roles"("name") VALUES (\'admin\'),(\'user\')')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM "public"."roles" WHERE "name"=\'admin\' OR "name"=\'user\''
    )
  }
}
