import { IsString } from "class-validator";

export class LoginPomeziDto {
  @IsString() password!: string;
  @IsString() email!: string;
}
