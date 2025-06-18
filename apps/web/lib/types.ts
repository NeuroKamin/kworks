export type FormResult<T = object> = {
  errors?: string[];
  data?: T;
};
