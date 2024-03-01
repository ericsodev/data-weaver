
import { z } from 'zod';
export const registerSchema = z
	.object({
		username: z.string().max(30),
		password: z.string().min(8, { message: "password must be at least 8 characters long" }),
		password_confirm: z.string()
	})
	.refine((data) => data.password == data.password_confirm, {
		message: 'Passwords do not match',
		path: ['password_confirm']
	});
