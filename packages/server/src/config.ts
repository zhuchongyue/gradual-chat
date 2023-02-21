import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
  hostname: string;
  port: number;
  jwtSecret: string;
  tokenExpiresTime: number; // 单位为秒
  databaseUrl: string;
  dbEntitiesPath: string[];
  debugLogging: boolean;
  dbsslconn: boolean;
  cronJobExpression: string;
}

const isDev = process.env.NODE_ENV === 'development'

const config: Config = {
  hostname: 'localhost',
  port: +(process.env.PORT || 3000),
  debugLogging: isDev,
  dbsslconn: !isDev,
  jwtSecret: process.env.JWT_SECRET || "your-secret-whatever",
  tokenExpiresTime: parseInt(process.env.TOKEN_EXPIRES_TIME || '0', 10) || (7 * 24 * 60 * 60), // 默认7天
  databaseUrl: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/apidb",
  dbEntitiesPath: [
    ... isDev ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  ],
  cronJobExpression: "0 * * * *"
}

export { config }