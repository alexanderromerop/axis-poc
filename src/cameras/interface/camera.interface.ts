export const SUPPORTED_MANUFACTURERS = ['Axis', 'Hanwha'] as const;

export type SupportedManufacturer = typeof SUPPORTED_MANUFACTURERS[number];

export interface ICamera {
    manufacturer: SupportedManufacturer,
    ip: string,
    user: string,
    password: string,
    id: string,
}