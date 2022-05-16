import {
  findNode,
  getPluginType,
  PlateEditor,
  TEditor,
} from '@udecode/plate-core';
import { NodeEntry } from 'slate';
import { ELEMENT_THREAD } from './createThreadPlugin';
import { isThread } from './isThread';
import { Thread } from './Thread';
import { ThreadNode } from './types';

export function findThreadNodeEntry(
  editor: TEditor,
  thread: Thread
): NodeEntry<ThreadNode> | null {
  const a = findNode<ThreadNode>(editor, {
    at: [],
    match(node: any) {
      return (
        isThread(editor as PlateEditor, node) && node.thread.id === thread.id
      );
    },
  });
  console.log('a', a);
  return a ?? null;
}
