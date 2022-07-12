import React from 'react';
import ReactDOM from 'react-dom';
import { StyledProps } from '@udecode/plate-styled-components';
import { CommonThreadAndSideThreadProps, Thread } from '../Thread';
import { ThreadPosition } from '../useComments';
import { createSideThreadStyles } from './SideThread.styles';

type SideThreadProps = {
  position: ThreadPosition;
  container?: HTMLElement;
} & StyledProps &
  CommonThreadAndSideThreadProps;

export function SideThread({ position, container, ...props }: SideThreadProps) {
  const { root } = createSideThreadStyles(props);

  return ReactDOM.createPortal(
    <div
      css={root.css}
      className={root.className}
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      <Thread
        {...props}
        showResolveThreadButton
        showReOpenThreadButton={false}
        showMoreButton
      />
    </div>,
    container || document.body
  );
}
