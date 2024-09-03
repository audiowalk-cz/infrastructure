import { Injectable } from "@nestjs/common";
import { sign, SignOptions } from "jsonwebtoken";
import { Config } from "src/config";

export interface TokenData {
  product: string;
}

@Injectable()
export class TokenService {
  async generateToken<T>(tokenData: TokenData, options: Pick<SignOptions, "expiresIn" | "notBefore">): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const signOptions: SignOptions = {
        expiresIn: "1d",
        ...options,
      };

      sign(tokenData, Config.token.secret, signOptions, (err, token) => (err ? reject(err) : resolve(token)));
    });
  }
}
