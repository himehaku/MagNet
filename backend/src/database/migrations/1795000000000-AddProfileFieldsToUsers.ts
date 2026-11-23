import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileFieldsToUsers1795000000000
  implements MigrationInterface
{
  name = 'AddProfileFieldsToUsers1795000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "location" character varying(150)
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "skills" text[] NOT NULL DEFAULT '{}'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "interests" text[] NOT NULL DEFAULT '{}'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "experience_years" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "preferred_remote" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "preferred_remote"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "experience_years"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "interests"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "skills"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "location"
    `);
  }
}