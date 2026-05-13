export interface VpsAccessRequestDTO {
  host: string;
  username?: string;
}

export interface VpsAccessResultDTO {
  allowed: boolean;
  reason?: string;
}
