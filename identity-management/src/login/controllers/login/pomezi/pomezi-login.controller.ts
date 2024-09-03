import { BadGatewayException, Body, Controller, ForbiddenException, Logger, Post } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { IsDateString, IsNumber, IsString, validateSync } from "class-validator";
import { DateTime } from "luxon";
import { LoginResponseDto } from "src/login/dto/login.dto";
import { TokenService } from "src/login/services/token/token.service";

export class PomeziRegistration {
  @IsDateString() datetime: string;
  @IsNumber() product: number;
}

export class LoginPomeziDto {
  @IsString() @ApiProperty() mail!: string;
  @IsString() @ApiProperty() hash!: string;
  @IsNumber() @ApiProperty() product!: number;
}

@Controller("login/pomezi")
@ApiTags("Login")
export class PomeziLoginController {
  private readonly logger = new Logger(PomeziLoginController.name);

  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async loginPomezi(@Body() body: LoginPomeziDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for ${body.mail} with hash ${body.hash} for product ${body.product}`);

    try {
      const registration = await axios
        .get(`https://pomezi.com/claim/${body.mail}/${body.hash}/${body.product}`)
        .then((res) => res.data)
        .then((data) => this.validateRegistration(data, body.product));

      const date = DateTime.fromISO(registration.datetime);

      const expiresIn = Math.ceil(date.plus({ days: 1 }).diffNow().as("seconds"));

      console.log(`Registration is valid for ${expiresIn} seconds`);

      const token = await this.tokenService.generateToken({ product: `pomezi-${body.product}` }, { expiresIn });

      return { token, data: registration };
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;

      const message = err.response?.data?.message || err.message;
      throw new BadGatewayException(`Failed to get registration data: ${message}`);
    }
  }

  private validateRegistration(registrationData: unknown, product: number): PomeziRegistration {
    const registration: PomeziRegistration = Object.assign(new PomeziRegistration(), registrationData);

    const validationErrors = validateSync(registration);

    if (validationErrors.length > 0) throw new ForbiddenException("Invalid registration data returned from Pomezi");

    console.log(registration.product, product);
    if (registration.product !== product)
      throw new ForbiddenException("Invalid registration data", { description: "Product mismatch" });

    const date = DateTime.fromISO(registration.datetime);

    // date is invalid
    if (!date.isValid) throw new ForbiddenException("Invalid registration data", { description: "Invalid date" });

    // end of the registration day has passed
    if (date.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).diffNow().valueOf() < 0)
      throw new ForbiddenException("Invalid registration data", { description: "Registration expired" });

    // else it is valid registration
    return registration;
  }
}
