import { useEffect, useMemo, useState } from 'react';
import { usePlateEditorState } from '@udecode/plate-core';
import { usePlateId } from './usePlateId';

function last<T>(array: T[]): T {
  return array[array.length - 1];
}

export function usePreviousEditor() {
  const id = usePlateId();

  /**
   * The higher the index, the more recent the editor.
   */
  // FIXME: editorHistory seems to be reinitialized with initialState
  const [editorHistory0, setEditorHistory0] = useState<string | null>(null);
  const [editorHistory1, setEditorHistory1] = useState<string | null>(id);

  useEffect(
    function logEditorHistory() {
      console.log('editorHistory', editorHistory0, editorHistory1);
    },
    [editorHistory0, editorHistory1]
  );

  useEffect(
    function updateEditorHistory() {
      const previousEditorId = editorHistory1;
      console.log(
        'a22',
        [editorHistory0, editorHistory1],
        id !== previousEditorId,
        id,
        previousEditorId
      );
      if (id !== previousEditorId) {
        setEditorHistory0(previousEditorId);
        setEditorHistory1(id);
      }
    },
    [editorHistory0, editorHistory1, id]
  );

  const previousEditorId = editorHistory0;

  const previousEditor = usePlateEditorState(previousEditorId ?? undefined);

  return previousEditorId ? previousEditor : null;
}
