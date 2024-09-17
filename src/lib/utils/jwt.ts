import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

const TOKEN_LIFESPAN = 86_400; // in seconds

export async function signJwt(payload: Record<string, unknown>): Promise<string> {
  return await new Promise((res, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_LIFESPAN * 1000 }, function (err, token) {
      if (err || !token) {
        return reject(err ?? 'Error signing JWT');
      }
      return res(token);
    });
  });
}

export async function verifyJwt(token: string): Promise<string | jwt.JwtPayload> {
  return await new Promise((res, reject) => {
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err || !decoded) {
        return reject(err ?? 'Error verifying JWT');
      }

      return res(decoded);
    });
  });
}
