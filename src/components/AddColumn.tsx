import React, { useState } from "react";
import { useKanbanStore } from "@/store/useKanbanStore";

export const AddColumn: React.FC = () => {
  const addColumn = useKanbanStore((state) => state.addColumn);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addColumn({ title: title.trim() });
    setTitle("");
    setIsOpen(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow min-w-[300px] max-w-[350px] flex flex-col">
      {isOpen ? (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название колонки"
            autoFocus
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setIsOpen(false);
              }}
              className="px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg flex flex-col items-center justify-center h-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-sm font-medium">Добавить колонку</span>
        </button>
      )}
    </div>
  );
};
