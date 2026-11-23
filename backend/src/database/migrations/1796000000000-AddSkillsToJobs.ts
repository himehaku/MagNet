import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkillsToJobs1796000000000
  implements MigrationInterface
{
  name = 'AddSkillsToJobs1796000000000';

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "skills" text[] NOT NULL DEFAULT '{}'
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "skills"
    `);
  }
}