import React, { useEffect, useMemo, useState } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import { createEditor, Descendant } from 'slate';
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react';
import * as Y from 'yjs';

export function Element({ element, attributes, children }: RenderElementProps) {
  switch ((element as any).type as string) {
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-5xl my-5">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-3xl my-2">
          {children}
        </h2>
      );
    case 'inline-code':
      return (
        <code {...attributes} className="border-2 bg-gray-100">
          {children}
        </code>
      );
    case 'block-quote':
      return (
        <blockquote {...attributes} className="mb-2 text-gray-400 flex text-lg">
          <p className="my-1">{children}</p>
        </blockquote>
      );
    default:
      return (
        <p {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
}

export function Simple() {
  const [value, setValue] = useState<Descendant[]>([]);
  const [connected, setConnected] = useState(false);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: 'ws://127.0.0.1:1234',
        // parameters: { key: HOCUSPOCUS_WRITE_KEY },
        name: 'slate-yjs-demo',
        onConnect: () => setConnected(true),
        onMessage: (e) => {
          console.log(e);
        },
        onDisconnect: () => setConnected(false),
      }),
    []
  );

  const editor = useMemo(() => {
    const sharedType = (provider.document.get(
      'content',
      Y.XmlText
    ) as any) as Y.XmlText;
    return withReact(withYHistory(withYjs(createEditor(), sharedType)) as any);
  }, [provider.document]);

  // Disconnect YjsEditor on unmount in order to free up resources
  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => () => provider.disconnect(), [provider]);

  return (
    <div className="flex justify-center my-32 mx-10">
      <Slate value={value} onChange={setValue} editor={editor}>
        <Editable
          className="max-w-4xl w-full flex-col"
          renderElement={Element}
          // renderLeaf={Leaf}
          placeholder="Write something ..."
        />
      </Slate>
      {/* <ConnectionToggle connected={connected} onClick={toggleConnection} /> */}
    </div>
  );
}
