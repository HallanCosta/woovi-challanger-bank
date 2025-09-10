export const DATABASE = '@bank_challanger_hallan';

export const TABLES = {
  USER: `${DATABASE}:user`,
  ACCOUNT: `${DATABASE}:account`,
  THEME: `${DATABASE}:theme`,
} as const;
