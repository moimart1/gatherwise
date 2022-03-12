import { ApiProperty } from '@nestjs/swagger';

export class AppInfo {
  @ApiProperty()
  name: string;
  @ApiProperty()
  version: string;
  @ApiProperty({ type: String, format: 'date-time' })
  buildDate: string;
  @ApiProperty({ type: String, format: 'date-time' })
  startDate: string;
  @ApiProperty()
  branchName: string;
  @ApiProperty()
  commitHash: string;
  @ApiProperty()
  developmentStage: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');
const startDate = new Date().toISOString();

// Most of information comes from Jenkins during build process
export const info: AppInfo = {
  name: packageJson.name,
  version: process.env.APP_FULLVERSION ?? packageJson.version,
  buildDate: process.env.APP_BUILD_DATE ?? 'n/c',
  startDate: startDate,
  branchName: process.env.APP_BRANCH_NAME ?? 'n/c',
  commitHash: process.env.APP_COMMIT_HASH ?? 'n/c',
  developmentStage: process.env.APP_DEVELOPMENT_STAGE ?? 'local-dev',
};

export function toString() {
  return `${info.name} v${info.version}`;
}
