import { PlateEditor } from '@udecode/plate-core';
import { Location, NodeEntry } from 'slate';
import { Thread } from '../Thread';
import { ThreadNode, ThreadNodeData } from '../types';
export declare function updateThread<T = {}>(editor: PlateEditor<T>, { thread, elementProps, }: {
    thread: Thread;
    at?: Location;
    elementProps?: Partial<ThreadNodeData>;
}): NodeEntry<ThreadNode> | undefined;
//# sourceMappingURL=updateThread.d.ts.map