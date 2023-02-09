import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragAndDrop } from "../../components/DragAndDrop";

export default function Assignments() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row">
        <DragAndDrop />
        <DragAndDrop />
      </div>
    </DndProvider>
  );
}
