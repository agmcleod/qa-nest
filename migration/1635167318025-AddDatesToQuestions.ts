import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDatesToQuestions1635167318025 implements MigrationInterface {
  name = 'AddDatesToQuestions1635167318025'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`)
  }
}
