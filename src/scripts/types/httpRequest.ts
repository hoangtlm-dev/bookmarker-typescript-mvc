export type RequestOptions = {
  method: string;
  headers: Record<string, string>;
  body: FormData | string | null;
};
