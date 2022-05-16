import { PEditor } from '@udecode/plate-core';
import { Location } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { findThreadNodeEntry } from '../findThreadNodeEntry';
import { Thread } from '../Thread';

export function findThreadPath<T>(
  editor: PEditor<T> & HistoryEditor & ReactEditor & T,
  thread: Thread
): Location | undefined {
  const threadNodeEntry = findThreadNodeEntry(editor, thread);
  return threadNodeEntry ? threadNodeEntry[1] : undefined;
}
