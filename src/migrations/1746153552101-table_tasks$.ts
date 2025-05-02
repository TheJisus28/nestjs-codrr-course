import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableTasks$1746153552101 implements MigrationInterface {
  name = 'TableTasks$1746153552101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('IN_PROGRESS', 'COMPLETED', 'PENDING', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "task_name" character varying(50) NOT NULL, "task_description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'PENDING', "responsable_name" character varying(50) NOT NULL, "project_id" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`,
    );
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
