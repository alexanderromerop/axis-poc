export const SUPPORTED_MANUFACTURERS = ['Axis', 'Hanwha'] as const;

export type SupportedManufacturer = typeof SUPPORTED_MANUFACTURERS[number];

export interface IMqttEventPayload {
  manufacturer: SupportedManufacturer;
  model: string;
  event_type: string;
  timestamp?: string | number;
}