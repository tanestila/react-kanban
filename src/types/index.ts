export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanState {
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];

  // Actions
  addColumn: (column: Omit<Column, "cardIds">) => void;
  deleteColumn: (columnId: string) => void;
  updateColumn: (columnId: string, title: string) => void;

  addCard: (card: Omit<Card, "id" | "createdAt">) => void;
  deleteCard: (cardId: string) => void;
  updateCard: (
    cardId: string,
    updates: Partial<Omit<Card, "id" | "createdAt">>,
  ) => void;

  moveCard: (cardId: string, toColumnId: string) => void;
  reorderCards: (columnId: string, cardIds: string[]) => void;
}
