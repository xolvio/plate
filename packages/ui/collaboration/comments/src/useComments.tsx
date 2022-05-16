import { useCallback, useEffect, useState } from 'react';
import {
  getAbove,
  getPluginType,
  usePlateEditorState,
} from '@udecode/plate-core';
import {
  Comment,
  deleteThread,
  ELEMENT_THREAD,
  findThreadNodeEntries,
  Thread,
  upsertThread,
  upsertThreadAtSelection,
  User,
} from '@xolvio/plate-comments';
import { NodeEntry, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { determineAbsolutePosition } from './determineAbsolutePosition';

export type OnSubmitComment = (
  thread: Thread,
  commentText: string
) => Promise<void>;

function replaceElement<T>(
  elements: T[],
  newElement: T,
  doesMatch: (element: T, newElement: T) => boolean
): T[] {
  return elements.map((element) =>
    doesMatch(element, newElement) ? newElement : element
  );
}

interface SomethingWithAnId {
  id: any;
}

function doBothElementsHaveTheSameId(
  elementA: SomethingWithAnId,
  elementB: SomethingWithAnId
): boolean {
  return elementA.id === elementB.id;
}

function replaceElementMatchingById<T extends { id: any }>(
  elements: T[],
  newElement: T
): T[] {
  return replaceElement(elements, newElement, doBothElementsHaveTheSameId);
}

function replaceComment(comments: Comment[], newComment: Comment): Comment[] {
  return replaceElementMatchingById(comments, newComment);
}

export interface ThreadPosition {
  left: number;
  top: number;
}

export type RetrieveUser = () => User | Promise<User>;
export type OnSaveComment = (comment: Comment) => void;

export function useComments({
  retrieveUser,
}: {
  retrieveUser: RetrieveUser;
}): {
  thread: Thread | null;
  position: ThreadPosition;
  onAddThread: () => void;
  onSaveComment: OnSaveComment;
  onSubmitComment: OnSubmitComment;
  onCancelCreateThread: () => void;
} {
  const editor = usePlateEditorState();
  window.editor = editor;
  const [thread, setThread] = useState<Thread | null>(null);
  const [threadPosition, setThreadPosition] = useState({ left: 0, top: 0 });
  const [
    newThreadThreadNodeEntry,
    setNewThreadThreadNodeEntry,
  ] = useState<NodeEntry | null>(null);

  const updateThreadPosition = useCallback(
    function updateThreadPosition(threadNodeEntry) {
      const selectionDOMNode = ReactEditor.toDOMNode(
        editor,
        threadNodeEntry[0]
      );
      const selectionDOMNodePosition = determineAbsolutePosition(
        selectionDOMNode
      );

      const editorDOMNode = ReactEditor.toDOMNode(editor, editor);
      const {
        x: editorX,
        width: editorWidth,
      } = editorDOMNode.getBoundingClientRect();

      const newThreadPosition = {
        left: editorX + editorWidth + 16,
        top: selectionDOMNodePosition.top,
      };
      setThreadPosition(newThreadPosition);
    },
    [editor]
  );

  const showThread = useCallback(
    function showThread(threadNodeEntry: any) {
      const { thread: selectedThread } = threadNodeEntry[0];
      requestAnimationFrame(() => {
        updateThreadPosition(threadNodeEntry);
        setThread(selectedThread);
      });
    },
    [updateThreadPosition]
  );

  const hideThread = useCallback(function hideThread() {
    setThread(null);
  }, []);

  const onCancelCreateThread = useCallback(
    function onCancelCreateThread() {
      if (newThreadThreadNodeEntry) {
        deleteThread(editor, newThreadThreadNodeEntry[1]);
        setNewThreadThreadNodeEntry(null);
      }
    },
    [editor, newThreadThreadNodeEntry]
  );

  useEffect(
    function handleThreadIdInURL() {
      const url = new URL(window.location.href);
      const threadIdQueryParam = url.searchParams.get('thread');
      if (threadIdQueryParam) {
        const threadId = parseInt(threadIdQueryParam, 10);
        const threadNodeEntries = Array.from(findThreadNodeEntries(editor));
        const threadNodeEntry = threadNodeEntries.find(
          (threadNodeEntry2: any) => threadNodeEntry2[0].thread.id === threadId
        );
        if (threadNodeEntry) {
          ReactEditor.focus(editor);
          Transforms.select(editor, threadNodeEntry[1]);
          Transforms.collapse(editor, { edge: 'start' });
          showThread(threadNodeEntry);

          const domNode = ReactEditor.toDOMNode(editor, threadNodeEntry[0]);
          domNode.scrollIntoView();

          window.addEventListener('load', () => {
            updateThreadPosition(threadNodeEntry);
          });
        }
      }
    },
    [editor, showThread, updateThreadPosition]
  );

  useEffect(
    function onSelectionChange() {
      const type = getPluginType(editor, ELEMENT_THREAD);
      // FIXME: Show thread when putting caret before the first character of the text with which the thread is connected.
      const threadNodeEntry = getAbove(editor, {
        match: { type },
      });
      const isThreadNodeTheNewThreadNode =
        threadNodeEntry &&
        newThreadThreadNodeEntry &&
        threadNodeEntry[0].id === (newThreadThreadNodeEntry[0] as any).id;
      if (!isThreadNodeTheNewThreadNode) {
        onCancelCreateThread();
      }
      debugger;
      if (threadNodeEntry && !threadNodeEntry[0].thread.isResolved) {
        showThread(threadNodeEntry);
      } else {
        hideThread();
      }
    },
    [
      showThread,
      hideThread,
      editor,
      editor.selection,
      newThreadThreadNodeEntry,
      onCancelCreateThread,
    ]
  );

  const onAddThread = useCallback(
    async function onAddThread() {
      if (editor.selection) {
        const newThread: Thread = {
          id: Math.floor(Math.random() * 1000), // FIXME
          comments: [],
          isResolved: false,
          createdBy: await retrieveUser(),
        };
        const newThreadThreadNodeEntry2 = upsertThreadAtSelection(
          editor,
          newThread
        );
        setNewThreadThreadNodeEntry(newThreadThreadNodeEntry2);
      }
    },
    [editor, retrieveUser]
  );

  const updateThread = useCallback(
    function updateThread(newThread: Thread): void {
      upsertThread(editor, { thread: newThread });
      setNewThreadThreadNodeEntry(null);
      setThread(null);
    },
    [editor]
  );

  const onSaveComment = useCallback<OnSaveComment>(
    function onSaveComment(comment: Comment) {
      const newThread = {
        ...thread!,
        comments: replaceComment(thread!.comments, comment),
      };
      updateThread(newThread);
    },
    [thread, updateThread]
  );

  const onSubmitComment = useCallback<OnSubmitComment>(
    async function onSubmitComment(
      threadThatTheCommentIsSubmittedTo: Thread,
      commentText: string
    ) {
      const comment = {
        id: Math.floor(Math.random() * 1000), // FIXME
        text: commentText,
        createdAt: Date.now(),
        createdBy: await retrieveUser(),
      };
      const newThread = {
        ...threadThatTheCommentIsSubmittedTo!,
        isResolved: false,
        comments: [...threadThatTheCommentIsSubmittedTo!.comments, comment],
      };
      updateThread(newThread);
    },
    [retrieveUser, updateThread]
  );

  return {
    thread,
    position: threadPosition,
    onAddThread,
    onSaveComment,
    onSubmitComment,
    onCancelCreateThread,
  };
}
