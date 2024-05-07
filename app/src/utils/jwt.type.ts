import { ReadOnlyType } from './readOnlyType';

interface IJwtType {
  email: string;
  sub: string;
}

export type JwtType = ReadOnlyType<IJwtType>;
