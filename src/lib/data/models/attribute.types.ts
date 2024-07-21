export const ATTRIBUTE_TYPES = ['string', 'number', 'boolean'] as const;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
export type AttributeValue = number | string | boolean | null;
