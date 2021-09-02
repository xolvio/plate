import React, { useCallback, useMemo, useState } from 'react';
import {
  createBasicElementPlugins,
  createHistoryPlugin,
  createPlateComponents,
  createReactPlugin,
  setNodes,
  useEditorRef,
} from '@udecode/plate';
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from '@udecode/plate-break';
import { Plate, SPRenderElementProps } from '@udecode/plate-core';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import {
  editableProps,
  options,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSoftBreakPlugin,
} from '../../config/pluginOptions';

const plugins = [
  createReactPlugin(),
  createHistoryPlugin(),
  ...createBasicElementPlugins(),
  createResetNodePlugin(optionsResetBlockTypePlugin),
  createSoftBreakPlugin(optionsSoftBreakPlugin),
  createExitBreakPlugin(optionsExitBreakPlugin),
];

const components = createPlateComponents();

export const EditableVoidElement = ({
  attributes,
  children,
  element,
}: SPRenderElementProps) => {
  const [inputValue, setInputValue] = useState('');

  const {
    description = [{ children: [{ text: 'Plate Editor' }] }],
    slateValue = [{ children: [{ text: 'Slate Editor' }] }],
  } = element;
  const editor = useEditorRef();
  const slateEditor = useMemo(
    () => withHistory(withReact(createEditor() as ReactEditor)),
    []
  );

  const handleChange = useCallback(
    (e) => {
      const path = ReactEditor.findPath(editor, element);
      setNodes(editor, { description: e }, { at: path });
    },
    [editor, element]
  );

  const handleSlateChange = useCallback(
    (e) => {
      const path = ReactEditor.findPath(editor, element);
      setNodes(editor, { slateValue: e }, { at: path });
    },
    [editor, element]
  );

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div style={{ boxShadow: '0 0 0 3px #ddd', padding: '8px' }}>
        <h4>Name:</h4>
        <input
          style={{ margin: '8px 0' }}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <h4>Left or right handed:</h4>
        <input
          style={{ width: 'unset' }}
          type="radio"
          name="handedness"
          value="left"
        />{' '}
        Left
        <br />
        <input
          style={{ width: 'unset' }}
          type="radio"
          name="handedness"
          value="right"
        />{' '}
        Right
        <h4>Tell us about yourself:</h4>
        <div style={{ padding: '20px', border: '2px solid #ddd' }}>
          <Plate
            id="editable-void-basic-elements"
            plugins={plugins}
            components={components}
            onChange={handleChange}
            options={options}
            initialValue={description}
            editableProps={editableProps}
          />
        </div>
        <Slate
          editor={slateEditor}
          value={slateValue}
          onChange={handleSlateChange}
        >
          <Editable placeholder="Enter some plain text..." />
        </Slate>
      </div>
      {children}
    </div>
  );
};
