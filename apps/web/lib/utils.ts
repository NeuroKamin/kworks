import { z } from "zod";

import { FormResult } from "./types";

export const formError = (issues: z.ZodIssue[]): FormResult => {
  return {
    errors: issues.map((issue) => issue.message),
  };
};

export const okResult = <T = object>(data?: T): FormResult<T> => {
  return {
    data,
  };
};
