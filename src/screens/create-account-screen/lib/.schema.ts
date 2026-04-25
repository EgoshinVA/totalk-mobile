import { z } from 'zod';

export const profileInfoSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Name can only contain letters, spaces, and hyphens'),

    surName: z
        .string()
        .min(2, 'Surname must be at least 2 characters')
        .max(50, 'Surname must be less than 50 characters')
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Surname can only contain letters, spaces, and hyphens'),

    patronymic: z
        .string()
        .max(50, 'Patronymic must be less than 50 characters')
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]*$/, 'Patronymic can only contain letters, spaces, and hyphens')
        .optional()
        .or(z.literal('')),
});

export type ProfileInfoData = z.infer<typeof profileInfoSchema>;

export const validateProfileInfo = (data: unknown) => {
    return profileInfoSchema.safeParse(data);
};