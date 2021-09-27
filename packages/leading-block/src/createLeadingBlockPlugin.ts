import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import { ELEMENT_CODE_BLOCK } from '@udecode/plate-code-block';
import {
  ELEMENT_DEFAULT,
  getBlockAbove,
  insertNodes,
  isSelectionAtBlockStart,
} from '@udecode/plate-common';
import { SPEditor } from '@udecode/plate-core';
import { ELEMENT_IMAGE } from '@udecode/plate-image';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import isHotkey from 'is-hotkey';
import { Editor, Transforms } from 'slate';

export interface LeadingBlockRule {
  hotkey: string;
}

export interface LeadingBlockOnKeyDownOptions {
  rules?: LeadingBlockRule[];
  movableBlockTypes?: string[];
  defaultType?: string;
}

const imageDetected = (editor: SPEditor) => {
  const firstElement = editor.children[0];
  return (
    firstElement.type === ELEMENT_IMAGE ||
    firstElement.children[0].type === ELEMENT_IMAGE
  );
};

const isValidPositionAndElement = (
  editor: SPEditor,
  movableBlockTypes: string[]
) => {
  const isStart = isSelectionAtBlockStart(editor);
  const isAtStartOfEditor =
    editor.selection?.anchor.path[0] === 0 &&
    editor.selection?.anchor.path[1] === 0 &&
    editor.selection?.anchor.offset === 0;

  if (!isStart || !isAtStartOfEditor) {
    return false;
  }

  if (movableBlockTypes.includes(ELEMENT_IMAGE) && imageDetected(editor)) {
    return true;
  }

  const firstElement = editor.children[0];
  return movableBlockTypes.includes(firstElement.type.toLowerCase());
};

/**
 * Add a trailing block when the last node type is not `type` and when the editor has .
 */
export const withLeadingBlock = ({
  rules = [{ hotkey: 'left' }, { hotkey: 'up' }],
  movableBlockTypes = [
    ELEMENT_TABLE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_IMAGE,
  ],
  defaultType = ELEMENT_DEFAULT,
}: LeadingBlockOnKeyDownOptions) => (editor: SPEditor) => (
  event: KeyboardEvent
) => {
  const entry = getBlockAbove(editor);
  if (!entry) {
    return;
  }

  rules.forEach(({ hotkey }) => {
    if (!isHotkey(hotkey, event)) {
      return;
    }

    if (!editor.selection) {
      return;
    }

    if (!isValidPositionAndElement(editor, movableBlockTypes)) {
      return;
    }

    event.preventDefault();

    // Insert empty text before current block element
    insertNodes(
      editor,
      { type: defaultType, children: [{ text: '' }] },
      { at: [0] }
    );

    // Set cursor position at start of document
    Transforms.select(editor, Editor.start(editor, []));
  });
};

export const createLeadingBlockPlugin = (options = {}) => ({
  onKeyDown: withLeadingBlock(options),
});
