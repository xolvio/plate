/** @jsx jsx */

import { PlateEditor } from '@udecode/plate-core';
import { jsx } from '@udecode/plate-test-utils';
import { findThreadNodeEntries } from '../findThreadNodeEntries';
import { findThreadNodeEntry } from '../findThreadNodeEntry';
import { isThread } from '../isThread';
import { upsertThread } from './upsertThread';

jsx;

const user = {
  id: '1',
  name: 'Jon Doe',
};

describe('upsertThread', () => {
  describe('updating an existing thread', () => {
    it('updates the existing thread', () => {
      const thread = {
        id: 2,
        comments: [
          {
            id: 2,
            text: 'A comment',
            createdAt: Date.now(),
            createdBy: { ...user },
          },
          {
            id: 3,
            text: 'A second comment',
            createdAt: Date.now(),
            createdBy: { ...user },
          },
        ],
        isResolved: true,
        createdBy: { ...user },
      };

      const editor = ((
        <editor>
          <hp>
            <hthread thread={thread}>Text with a resolved thread</hthread>
          </hp>
        </editor>
      ) as any) as PlateEditor;

      upsertThread(editor, {
        thread: {
          ...thread,
          isResolved: false,
        },
      });

      const threadNodeEntry = findThreadNodeEntry(editor, thread)!;

      const [threadNode] = threadNodeEntry;
      const { thread: threadOnNode } = threadNode;

      expect(threadOnNode.isResolved).toEqual(false);
    });

    it('replaces the existing thread node', () => {
      const thread = {
        id: 2,
        comments: [
          {
            id: 2,
            text: 'A comment',
            createdAt: Date.now(),
            createdBy: { ...user },
          },
          {
            id: 3,
            text: 'A second comment',
            createdAt: Date.now(),
            createdBy: { ...user },
          },
        ],
        isResolved: true,
        createdBy: { ...user },
      };

      const editor = ((
        <editor>
          <hp />
          <hp>
            <hthread thread={thread}>Text with a resolved thread</hthread>
          </hp>
          <hp />
        </editor>
      ) as any) as PlateEditor;

      upsertThread(editor, {
        thread: {
          ...thread,
          isResolved: false,
        },
      });

      const threadNodeEntries = Array.from(findThreadNodeEntries(editor));
      const threadNodeEntriesWithId = threadNodeEntries.filter(
        ([node]) => isThread(editor, node) && node.thread.id === thread.id
      );

      expect(threadNodeEntriesWithId).toHaveLength(1);
    });
  });

  describe('inserting thread at selection', () => {});
});
