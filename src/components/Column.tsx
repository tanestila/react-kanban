import React, { useState } from "react";
import { useKanbanStore } from "@/store/useKanbanStore";
import { Card } from "./Card";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface ColumnProps {
  columnId: string;
  index: number;
}

export const Column: React.FC<ColumnProps> = ({ columnId, index }) => {
  const column = useKanbanStore((state) => state.columns[columnId]);
  const deleteColumn = useKanbanStore((state) => state.deleteColumn);
  const updateColumn = useKanbanStore((state) => state.updateColumn);
  const addCard = useKanbanStore((state) => state.addCard);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column?.title || "");
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");

  if (!column) return null;

  const handleSaveTitle = () => {
    updateColumn(columnId, title);
    setIsEditing(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    addCard({
      title: newCardTitle.trim(),
      description: newCardDescription.trim() || undefined,
      columnId,
    });

    setNewCardTitle("");
    setNewCardDescription("");
  };

  return (
    <Draggable draggableId={columnId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-100 rounded-lg shadow min-w-[300px] max-w-[350px] flex flex-col"
        >
          {/* Header с драг-хендлом */}
          <div
            {...provided.dragHandleProps}
            className="bg-white p-3 rounded-t-lg cursor-move flex items-center justify-between border-b"
          >
            {isEditing ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") {
                      setTitle(column.title);
                      setIsEditing(false);
                    }
                  }}
                  autoFocus
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <h2
                className="font-bold text-gray-800 cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditing(true)}
              >
                {column.title}
              </h2>
            )}
            <button
              onClick={() => deleteColumn(columnId)}
              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              title="Удалить колонку"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Cards - область для перетаскивания карточек */}
          <Droppable droppableId={columnId} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-3 space-y-2 overflow-y-auto max-h-[600px] ${
                  snapshot.isDraggingOver ? "bg-blue-50" : ""
                }`}
              >
                {column.cardIds.map((cardId, idx) => (
                  <Card key={cardId} cardId={cardId} index={idx} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Форма добавления карточки */}
          <div className="p-3 bg-white rounded-b-lg border-t">
            <form onSubmit={handleAddCard} className="space-y-2">
              <input
                type="text"
                placeholder="Название карточки"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Описание (опционально)"
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                type="submit"
                disabled={!newCardTitle.trim()}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Добавить карточку
              </button>
            </form>
          </div>
        </div>
      )}
    </Draggable>
  );
};
