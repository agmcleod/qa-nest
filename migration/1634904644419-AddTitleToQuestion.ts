import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTitleToQuestion1634904644419 implements MigrationInterface {
    name = 'AddTitleToQuestion1634904644419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "title" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
    }

}
