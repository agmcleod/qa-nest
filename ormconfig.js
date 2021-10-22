module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
  synchronize: process.env.NODE_ENV === 'test',
}
