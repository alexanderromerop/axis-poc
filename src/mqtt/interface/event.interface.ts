import { SupportedManufacturer } from "src/cameras/interface/camera.interface";

export interface IMqttEventPayload {
  manufacturer: SupportedManufacturer;
  model: string;
  event_type: string;
  timestamp?: string | number;
  id: string;
}