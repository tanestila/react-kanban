import React from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useKanbanStore } from "@/store/useKanbanStore";
import { Column } from "./Column";

export const Board: React.FC = () => {
  const { columnOrder, columns, moveCard, reorderCards } = useKanbanStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    // Если элемент не переместили (отменили перетаскивание)
    if (!destination) {
      return;
    }

    // Если элемент вернулся на то же место
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Перемещение колонок
    if (type === "column") {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      useKanbanStore.setState({ columnOrder: newColumnOrder });
      return;
    }

    // Перемещение карточек внутри одной колонки
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newCardIds = Array.from(column.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      reorderCards(source.droppableId, newCardIds);
      return;
    }

    // Перемещение карточек между колонками
    moveCard(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Kanban Board
        </h1>

        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-120px)]"
            >
              {columnOrder.map((columnId, index) => (
                <Column key={columnId} columnId={columnId} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
