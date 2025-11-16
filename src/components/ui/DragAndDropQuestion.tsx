// src/components/ui/DragAndDropQuestion.tsx
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { UserAnswer, ObserverQuestion } from '../Assessment';

// Define categories exactly as they appear in the question
const CATEGORIES = ['Tightly Coupled', 'Loosely Coupled'] as const;

interface DragAndDropQuestionProps {
  question: ObserverQuestion;
  answer?: UserAnswer;
  updateAnswer: (payload: Partial<UserAnswer>) => void;
}

// Helper: StrictMode-safe Droppable (fixes React 18 double-render issue)
const StrictModeDroppable: React.FC<{
  children: (provided: any, snapshot: any) => React.ReactNode;
  droppableId: string;
}> = ({ children, droppableId }) => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(animation);
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable droppableId={droppableId}>{children}</Droppable>;
};

export const DragAndDropQuestion: React.FC<DragAndDropQuestionProps> = ({
  question,
  answer,
  updateAnswer,
}) => {
  // Initialize categories state
  const getInitialAnswer = (): Record<string, number[]> => {
    const initial: Record<string, number[]> = {
      'Tightly Coupled': [],
      'Loosely Coupled': [],
      source: question.options.map((o) => o.id), // All start in source
    };

    if (answer?.type === 'drag_drop' && 'categories' in answer && answer.categories) {
      return answer.categories;
    }
    return initial;
  };

  const [categories, setCategories] = React.useState(getInitialAnswer);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCat = source.droppableId;
    const destCat = destination.droppableId;
    const itemId = Number(result.draggableId);

    // Prevent drag from source to source (no-op)
    if (sourceCat === destCat) return;

    const newCategories = { ...categories };

    // Remove from source
    newCategories[sourceCat] = newCategories[sourceCat].filter((id) => id !== itemId);

    // Add to destination
    newCategories[destCat].splice(destination.index, 0, itemId);

    setCategories(newCategories);
    updateAnswer({
      type: 'drag_drop',
      categories: newCategories,
    });
  };

  // Guard: No options
  if (!question.options || question.options.length === 0) {
    return <p className="text-red-500">Error: No options defined.</p>;
  }

  return (
    <div className="drag-drop-container space-y-8">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Source Bucket: All statements start here */}
        <div className="mb-8">
          <h4 className="font-semibold text-lg text-slate-800 text-center mb-4">
            Statements
          </h4>
          <StrictModeDroppable droppableId="source">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`
                  min-h-32 p-5 rounded-xl border-2 transition-all bg-white
                  ${snapshot.isDraggingOver
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-dashed border-slate-300'
                  }
                `}
              >
                {categories.source.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm">
                    No statements left
                  </p>
                ) : (
                  categories.source.map((optionId, idx) => {
                    const option = question.options.find((o) => o.id === optionId);
                    if (!option) return null;
                    return (
                      <Draggable
                        key={option.id}
                        draggableId={String(option.id)}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              p-3 mb-2 rounded-lg border shadow-sm text-sm font-medium cursor-move select-none
                              ${snapshot.isDragging
                                ? 'bg-green-100 border-green-400 shadow-xl rotate-1'
                                : 'bg-white border-slate-300 hover:shadow-md'
                              }
                            `}
                          >
                            {option.text}
                          </div>
                        )}
                      </Draggable>
                    );
                  })
                )}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </div>

        {/* Category Buckets */}
        <div className="grid md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="space-y-3">
              <h4 className="font-semibold text-lg text-slate-800 text-center">
                {cat}
              </h4>
              <StrictModeDroppable droppableId={cat}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`
                      min-h-32 p-4 rounded-xl border-2 transition-all
                      ${snapshot.isDraggingOver
                        ? 'border-blue-500 bg-blue-50 shadow-inner'
                        : 'border-dashed border-slate-300 bg-slate-50'
                      }
                    `}
                  >
                    {categories[cat].length === 0 ? (
                      <p className="text-center text-slate-400 text-sm">
                        Drop statements here
                      </p>
                    ) : (
                      categories[cat].map((optionId, idx) => {
                        const option = question.options.find((o) => o.id === optionId);
                        if (!option) return null;
                        return (
                          <Draggable
                            key={option.id}
                            draggableId={String(option.id)}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  p-3 mb-2 rounded-lg border shadow-sm text-sm font-medium
                                  ${snapshot.isDragging
                                    ? 'bg-blue-100 border-blue-400 shadow-lg rotate-1'
                                    : 'bg-white border-slate-300'
                                  }
                                `}
                              >
                                {option.text}
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <p className="text-xs text-slate-500 mt-6 text-center">
        Drag each statement from <strong>Statements</strong> into the correct category: <strong>Tightly Coupled</strong> or <strong>Loosely Coupled</strong>.
      </p>
    </div>
  );
};