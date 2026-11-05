import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsTable1793912008259 implements MigrationInterface {
    name = 'CreateJobsTable1793912008259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "title" character varying NOT NULL, "company" character varying NOT NULL, "description" text NOT NULL, "location" character varying, "remote" boolean, "category" character varying, "source" character varying NOT NULL, "source_url" text NOT NULL, "published_at" TIMESTAMP WITH TIME ZONE, "fetched_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c3446e741458350410e5ac434d" ON "jobs"  ("source", "external_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c3446e741458350410e5ac434d"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
    }

}
