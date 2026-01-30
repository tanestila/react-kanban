import React from "react";
import { useKanbanStore } from "@/store/useKanbanStore";

interface CardProps {
  cardId: string;
  index: number;
}

export const Card: React.FC<CardProps> = ({ cardId, index }) => {
  const card = useKanbanStore((state) => state.cards[cardId]);
  const deleteCard = useKanbanStore((state) => state.deleteCard);

  if (!card) return null;

  return (
    <div
      draggable
      className="bg-white rounded-lg shadow-md p-4 mb-2 cursor-move hover:shadow-lg transition-shadow"
      style={{
        animation: `fadeIn 0.3s ease ${index * 0.05}s`,
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
        <button
          onClick={() => deleteCard(cardId)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Удалить карточку"
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

      {card.description && (
        <p className="text-sm text-gray-600">{card.description}</p>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Создано: {new Date(card.createdAt).toLocaleDateString("ru-RU")}
        {card.updatedAt && (
          <span className="ml-2">
            Обновлено: {new Date(card.updatedAt).toLocaleDateString("ru-RU")}
          </span>
        )}
      </div>
    </div>
  );
};
