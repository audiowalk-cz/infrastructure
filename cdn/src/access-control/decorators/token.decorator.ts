import { ExecutionContext, Type, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { validateSync } from "class-validator";
import { verify } from "jsonwebtoken";
import { Config } from "src/config";

export const Token = createParamDecorator(
  <T extends Type<any>>(tokenClass: T, ctx: ExecutionContext): InstanceType<T> | null => {
    const request = ctx.switchToHttp().getRequest();

    const header = request.headers["authorization"];
    if (!header) throw new UnauthorizedException();

    const tokenString = header.split(" ")[1];

    const tokenData = verify(tokenString, Config.auth.secret);

    const token = Object.assign(new tokenClass(), tokenData);

    if (validateSync(token).length > 0) return null;

    return token as InstanceType<T>;
  },
);
