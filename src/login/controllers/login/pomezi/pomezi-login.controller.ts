import { BadGatewayException, Body, Controller, ForbiddenException, Logger, Post } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { IsDateString, IsString, validateSync } from "class-validator";
import { DateTime } from "luxon";
import { LoginResponseDto } from "src/login/dto/login.dto";
import { TokenService } from "src/login/services/token/token.service";

export class PomeziRegistration {
  @IsDateString() datetime: string;
  @IsString() product: string;
}

export class LoginPomeziDto {
  @IsString() @ApiProperty() mail!: string;
  @IsString() @ApiProperty() hash!: string;
  @IsString() @ApiProperty() product!: string;
}

@Controller("login/pomezi")
@ApiTags("Login")
export class PomeziLoginController {
  private readonly logger = new Logger(PomeziLoginController.name);

  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async loginPomezi(@Body() body: LoginPomeziDto): Promise<LoginResponseDto> {
    try {
      const registration = await axios
        .get(`https://pomezi.com/claim/${body.mail}/${body.hash}/${body.product}`)
        .then((res) => res.data);

      if (!this.validateRegistration(registration, body.product)) {
        throw new ForbiddenException("Invalid registration data");
      }

      const date = DateTime.fromISO(registration.datetime);

      const token = await this.tokenService.generateToken(
        {
          product: `pomezi-${body.product}`,
        },
        {
          expiresIn: date.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).diffNow().as("seconds"),
        },
      );

      return { token, data: registration };
    } catch (err) {
      throw new BadGatewayException("Failed to get registration data");
    }
  }

  private validateRegistration(registrationData: unknown, product: string): registrationData is PomeziRegistration {
    const registration: PomeziRegistration = Object.assign(new PomeziRegistration(), registrationData);

    if (validateSync(registration).length > 0) return false;

    if (registration.product !== product) return false;

    const date = DateTime.fromISO(registration.datetime);

    // date is invalid
    if (!date.isValid) return false;

    // end of the registration day has passed
    if (date.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).diffNow().valueOf() < 0) return false;

    // else it is valid registration
    return true;
  }
}
