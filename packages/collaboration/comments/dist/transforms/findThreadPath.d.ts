import { PEditor } from '@udecode/plate-core';
import { Location } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { Thread } from '../Thread';
export declare function findThreadPath<T>(editor: PEditor<T> & HistoryEditor & ReactEditor & T, thread: Thread): Location | undefined;
//# sourceMappingURL=findThreadPath.d.ts.map