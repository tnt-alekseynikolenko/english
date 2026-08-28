export type DatabaseError = Error & {
  code?: string;
};