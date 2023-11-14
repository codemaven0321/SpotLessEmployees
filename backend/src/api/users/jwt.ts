import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';

/**
 * encode data
 */
export async function encode(
	payload: JWTPayload,
	key: string | undefined = undefined
) {
	if (!key) key = randomUUID();
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS512' })
		.setIssuedAt()
		.sign(new TextEncoder().encode(key));

	return { jwt, key };
}

/**
 * decode data
 *
 * @return {Promise<false | JWTPayload>}
 *                      - false,  when signature is invalid
 *                      - JWTPayload, when signature is valid, return the payload
 */
export async function decode(jwt: string, key: string) {
	try {
		const { payload } = await jwtVerify(jwt, new TextEncoder().encode(key), {
			algorithms: ['HS512']
		});
		return payload;
	} catch {
		return false;
	}
}
