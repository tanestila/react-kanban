import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { KanbanState } from "@/types";

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      // Начальное состояние
      columns: {
        "column-1": {
          id: "column-1",
          title: "To Do",
          cardIds: ["card-1", "card-2"],
        },
        "column-2": {
          id: "column-2",
          title: "In Progress",
          cardIds: ["card-3"],
        },
        "column-3": {
          id: "column-3",
          title: "Done",
          cardIds: [],
        },
      },
      cards: {
        "card-1": {
          id: "card-1",
          title: "Изучить TypeScript",
          description: "Пройти продвинутый курс по TypeScript",
          columnId: "column-1",
          createdAt: new Date("2026-01-30"),
        },
        "card-2": {
          id: "card-2",
          title: "Настроить ESLint",
          description: "Настроить современный конфиг для проекта",
          columnId: "column-1",
          createdAt: new Date("2026-01-30"),
        },
        "card-3": {
          id: "card-3",
          title: "Создать канбан доску",
          description: "Реализовать базовую функциональность",
          columnId: "column-2",
          createdAt: new Date("2026-01-30"),
        },
      },
      columnOrder: ["column-1", "column-2", "column-3"],

      // Actions для колонок
      addColumn: (column) =>
        set((state) => {
          const newColumnId = `column-${Date.now()}`;
          const newColumn = {
            ...column,
            id: newColumnId,
            cardIds: [],
          };
          return {
            columns: {
              ...state.columns,
              [newColumnId]: newColumn,
            },
            columnOrder: [...state.columnOrder, newColumnId],
          };
        }),

      deleteColumn: (columnId) =>
        set((state) => {
          const { [columnId]: deletedColumn, ...remainingColumns } =
            state.columns;

          // Удаляем карточки из этой колонки
          const cardsToDelete = deletedColumn?.cardIds || [];
          const remainingCards = { ...state.cards };
          cardsToDelete.forEach((cardId) => {
            delete remainingCards[cardId];
          });

          return {
            columns: remainingColumns,
            cards: remainingCards,
            columnOrder: state.columnOrder.filter((id) => id !== columnId),
          };
        }),

      updateColumn: (columnId, title) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              title,
            },
          },
        })),

      // Actions для карточек
      addCard: (card) =>
        set((state) => {
          const newCardId = uuidv4();
          const newCard = {
            ...card,
            id: newCardId,
            createdAt: new Date(),
          };
          const column = state.columns[card.columnId];

          return {
            cards: {
              ...state.cards,
              [newCardId]: newCard,
            },
            columns: {
              ...state.columns,
              [card.columnId]: {
                ...column,
                cardIds: [...column.cardIds, newCardId],
              },
            },
          };
        }),

      deleteCard: (cardId) =>
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;

          const column = state.columns[card.columnId];
          const updatedCardIds = column.cardIds.filter((id) => id !== cardId);

          const { [cardId]: deletedCard, ...remainingCards } = state.cards;

          return {
            cards: remainingCards,
            columns: {
              ...state.columns,
              [card.columnId]: {
                ...column,
                cardIds: updatedCardIds,
              },
            },
          };
        }),

      updateCard: (cardId, updates) =>
        set((state) => ({
          cards: {
            ...state.cards,
            [cardId]: {
              ...state.cards[cardId],
              ...updates,
              updatedAt: new Date(),
            },
          },
        })),

      // Перемещение карточек
      moveCard: (cardId, toColumnId) =>
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;

          const fromColumn = state.columns[card.columnId];
          const toColumn = state.columns[toColumnId];

          // Удаляем из старой колонки
          const fromCardIds = fromColumn.cardIds.filter((id) => id !== cardId);

          // Добавляем в новую колонку (в конец)
          const toCardIds = [...toColumn.cardIds, cardId];

          return {
            cards: {
              ...state.cards,
              [cardId]: {
                ...card,
                columnId: toColumnId,
                updatedAt: new Date(),
              },
            },
            columns: {
              ...state.columns,
              [card.columnId]: {
                ...fromColumn,
                cardIds: fromCardIds,
              },
              [toColumnId]: {
                ...toColumn,
                cardIds: toCardIds,
              },
            },
          };
        }),

      reorderCards: (columnId, cardIds) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              cardIds,
            },
          },
        })),
    }),
    {
      name: "kanban-storage",
    },
  ),
);
