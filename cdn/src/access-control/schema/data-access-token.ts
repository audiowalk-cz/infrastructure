import { IsString } from "class-validator";

export class DataAccessToken {
  @IsString() projectId!: string;
}
