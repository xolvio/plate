/** @jsx jsx */

import * as isHotkey from 'is-hotkey';
import { ELEMENT_DEFAULT } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { SPEditor } from '@udecode/plate-core';
import { createLeadingBlockPlugin, withLeadingBlock } from './createLeadingBlockPlugin';
import { jsx } from '@udecode/plate-test-utils';

jsx;

// describe('when last node is invalid', () => {
//   const input = (
//     <editor>
//       <hh1>test</hh1>
//       <hh1>test2</hh1>
//     </editor>
//   ) as any;
//
//   const output = (
//     <editor>
//       <hh1>test</hh1>
//       <hh1>test2</hh1>
//       <hdefault>
//         <htext />
//       </hdefault>
//     </editor>
//   ) as any;
//
//   it('should be', () => {
//     const editor = withLeadingBlock({
//       rules: [{ hotkey: 'left' }, { hotkey: 'up' }],
//       movableBlockTypes: [ELEMENT_TABLE],
//       defaultType: ELEMENT_DEFAULT,
//     })(input as SPEditor);
//
//     editor.normalizeNode([input, []]);
//
//     expect(input.children).toEqual(output.children);
//   });
// });
//
// describe('when level = 1', () => {
//   const input = (
//     <editor>
//       <element>
//         <hh1>test</hh1>
//         <hh1>test2</hh1>
//       </element>
//     </editor>
//   ) as any;
//
//   const output = (
//     <editor>
//       <element>
//         <hh1>test</hh1>
//         <hh1>test2</hh1>rules =
//         <hdefault>
//           <htext />
//         </hdefault>
//       </element>
//     </editor>
//   ) as any;
//
//   it('should be', () => {
//     const editor = withLeadingBlock({
//       rules: [{ hotkey: 'left' }, { hotkey: 'up' }],
//       movableBlockTypes: [ELEMENT_TABLE],
//       defaultType: ELEMENT_DEFAULT,
//     })(input as SPEditor);
//
//     editor.normalizeNode([input, []]);
//
//     expect(input.children).toEqual(output.children);
//   });
// });
//
// describe('when using query', () => {
//   const input = (
//     <editor>
//       <hh1>test</hh1>
//       <hh1>test2</hh1>
//     </editor>
//   ) as any;
//
//   const output = (
//     <editor>
//       <hh1>test</hh1>
//       <hh1>test2</hh1>
//     </editor>
//   ) as any;
//
//   it('should be', () => {
//     const editor = withLeadingBlock({
//       rules: [{ hotkey: 'left' }, { hotkey: 'up' }],
//       movableBlockTypes: [ELEMENT_TABLE],
//       defaultType: ELEMENT_DEFAULT,
//     })(input as SPEditor);
//
//     editor.normalizeNode([input, []]);
//
//     expect(input.children).toEqual(output.children);
//   });
// });

const input = (
  <editor>
    <htable>
      test
      <cursor />
    </htable>
  </editor>
) as any;

const event = new KeyboardEvent('keyup') as any;

const output = (
  <editor>
    test{'\n'}
    <cursor />
    <htable />
  </editor>
) as any;

it('should be', () => {
  jest.spyOn(isHotkey, 'default').mockReturnValue(true);
  withLeadingBlock({
    rules: [{ hotkey: 'left' }, { hotkey: 'up' }],
    movableBlockTypes: [ELEMENT_TABLE],
    defaultType: ELEMENT_DEFAULT,
  })(input)(event);
  console.log(input.children)
  expect(input.children).toEqual(output.children);
});
