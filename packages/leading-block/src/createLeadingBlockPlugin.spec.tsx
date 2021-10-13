/** @jsx jsx */

import * as isHotkey from 'is-hotkey';
import { ELEMENT_DEFAULT } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { SPEditor } from '@udecode/plate-core';
import { createLeadingBlockPlugin, withLeadingBlock } from './createLeadingBlockPlugin';
import { jsx } from '@udecode/plate-test-utils';
import { ELEMENT_IMAGE } from '@udecode/plate-image';

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


it('being on the left most element of a table and pressing up should create a new paragraph above the table', () => {
  const input = (
    <editor>
      <htable><cursor />hello</htable>
    </editor>
  ) as any;

  const event = new KeyboardEvent('keyup') as any;

  const output = (
    <editor>
      <hp><htext /><cursor /></hp>
      <htable>hello</htable>
    </editor>
  ) as any;


  jest.spyOn(isHotkey, 'default').mockReturnValue(true);
  withLeadingBlock({
    rules: [{ hotkey: 'up' }],
    movableBlockTypes: [ELEMENT_TABLE],
    defaultType: ELEMENT_DEFAULT,
  })(input)(event);

  expect(input.children).toEqual(output.children);
});

it('with the cursor on an image and pressing left should create a new paragraph above the table', () => {
  const input = (
    <editor>
      <cursor />
      <himg url="https://i.imgur.com/removed.png" />
      hello
    </editor>
  ) as any;

  const event = new KeyboardEvent('keyleft') as any;

  const output = (
    <editor>
      <hp><htext /><cursor /></hp>
      <himg url="https://i.imgur.com/removed.png" />
      hello
    </editor>
  ) as any;

  console.log(JSON.stringify(input.children));
  console.log(JSON.stringify(output.children));

  jest.spyOn(isHotkey, 'default').mockReturnValue(true);
  withLeadingBlock({
    rules: [{ hotkey: 'left' }],
    movableBlockTypes: [ELEMENT_IMAGE],
    defaultType: ELEMENT_DEFAULT,
  })(input)(event);

  expect(input.children).toEqual(output.children);
});
