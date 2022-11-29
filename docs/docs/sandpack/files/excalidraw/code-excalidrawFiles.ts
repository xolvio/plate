import { excalidrawValueFile } from './code-excalidrawValue';
import { initialDataExcalidrawFile } from './code-initialDataExcalidraw';
import { userFile } from './code-user';

export const excalidrawFiles = {
  ...excalidrawValueFile,
  ...initialDataExcalidrawFile,
  ...userFile,
};
