// Monday.com uses numeric IDs, not UUIDs
// They use large integers for unique identification

let currentId = 1000000000; // Start with a large base number like Monday.com

export const generateId = (): string => {
  return (++currentId).toString();
};

export const generateBoardId = (): string => {
  return `board-${generateId()}`;
};

export const generateGroupId = (): string => {
  return `group-${generateId()}`;
};

export const generateItemId = (): string => {
  return `item-${generateId()}`;
};

export const generateColumnId = (): string => {
  return `col-${generateId()}`;
};