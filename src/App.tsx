import React from "react";
import { Board } from "@/components/Board";
import { AddColumn } from "@/components/AddColumn";
import { DragDropContext } from "@hello-pangea/dnd";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-16">
      <Board />

      {/* Кнопка добавления колонки */}
      <div className="fixed bottom-6 right-6">
        <AddColumn />
      </div>
    </div>
  );
}

export default App;
