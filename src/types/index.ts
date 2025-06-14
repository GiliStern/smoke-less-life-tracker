
export type SmokeType = '🚬 Tobacco Mix' | '🌿 Herbal Mix';

export interface SmokeLog {
  id: string;
  type: SmokeType;
  timestamp: string;
  trigger?: string;
}
