import { usePlateId as usePlateIdBase } from '@udecode/plate-core';

export function usePlateId(): any {
  return usePlateIdBase() ?? undefined;
}
