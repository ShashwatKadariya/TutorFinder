import { ReadOnlyType } from 'src/utils';

type TrefreshTokenCreate = { refresh_token: string } & (
  | { kind: 'userId'; userId: string }
  | { kind: 'tutorId'; tutorId: string }
);

export type refreshTokenCreate = ReadOnlyType<TrefreshTokenCreate>;
