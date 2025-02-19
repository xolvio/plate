import { getPluginType, PlateEditor, TText, Value } from '@udecode/plate-core';
import { ELEMENT_LINK } from '../createLinkPlugin';
import { TLinkElement } from '../types';

export interface CreateLinkNodeOptions {
  url: string;
  text?: string;
  children?: TText[];
}

export const createLinkNode = <V extends Value>(
  editor: PlateEditor<V>,
  { url, text = '', children }: CreateLinkNodeOptions
): TLinkElement => {
  const type = getPluginType(editor, ELEMENT_LINK);

  return {
    type,
    url,
    children: children ?? [{ text }],
  };
};
