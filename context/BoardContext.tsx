import React, { useState,createContext,useContext } from 'react';
import type { Board, Column, Task } from '@/types/board';

//NOTE - BoardContext provides state management and functionality for the Kanban board.
interface BoardContextType {
    board: Board | null;
    columns: Column[];
    tasks: Task[];
    createColumn: (title: string) => void;
    updateColumn: (id: string, title: string) => void;
    deleteColumn: (id: string) => void;
    moveTask: (taskId: string, fromColumn: string, toColumn: string) => void;
    addTask: (columnId: string, task: Omit<Task, 'id' | 'columnId'>) => void;
    updateTask: (taskId: string, data: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    setCurrentBoard: (board: Board) => void;
    updateBoard: (data: Partial<Board>) => void;
    clearBoard: () => void;
    reorderTasks: (columnId: string, startIndex: number, endIndex: number) => void;
    reorderColumns: (startIndex: number, endIndex: number) => void;
}



const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
    const [board, setBoard] = useState<Board | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const createColumn = (title: string) => {
        const newColumn: Column = {
            id: crypto.randomUUID(),
            title,
            tasks: []
        };
        setColumns(prevColumns => [...prevColumns, newColumn]);
    };

    const updateColumn = (id: string, title: string) => {
        setColumns(prevColumns =>
            prevColumns.map(column =>
                column.id === id
                    ? { ...column, title }
                    : column
            )
        );
    };

    const deleteColumn = (id: string) => {
        //NOTE - Remove The Column From The Board
        setColumns(prevColumns => prevColumns.filter(column => column.id !== id));
        //NOTE - Remove All Tasks Associated With The Column
        setTasks(prevTasks => prevTasks.filter(task => task.columnId !== id));
    }

    const moveTask = (taskId: string, fromColumn: string, toColumn: string) => {
        //NOTE - Remove The Task From The Current Column
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, columnId: toColumn }
                    : task
            )
        );
    };

    const addTask = (columnId: string, task: Omit<Task, 'id' | 'columnId'>) => {
        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            columnId: columnId,
            title: '',
            description: '',
            status: 'todo'
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };
    const updateTask = (taskId: string, data: Partial<Task>) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, ...data } as Task // Add type assertion to ensure Task type
                    : task
            )
        );
    };

    const deleteTask = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }

    const setCurrentBoard = (board: Board) => {
        setBoard(board);
        setColumns(board.columns || []);
    };

    const updateBoard = (data: Partial<Board>) => {
        if (!board) return;
        setBoard(currentBoard => currentBoard ? { ...currentBoard, ...data } : null);
    };


const clearBoard = () => {
    setBoard(null);
    setColumns([]);
    setTasks([]);
};

const reorderTasks = (columnId: string, startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
        const columnTasks = prevTasks.filter(task => task.columnId === columnId);
        const otherTasks = prevTasks.filter(task => task.columnId !== columnId);
        
        const [movedTask] = columnTasks.splice(startIndex, 1);
        columnTasks.splice(endIndex, 0, movedTask);
        
        return [...otherTasks, ...columnTasks];
    });
};

const reorderColumns = (startIndex: number, endIndex: number) => {
    setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const [movedColumn] = newColumns.splice(startIndex, 1);
        newColumns.splice(endIndex, 0, movedColumn);
        return newColumns;
    });
};
    return (
        <BoardContext.Provider value={{
            board,
            columns,
            tasks,
            createColumn,
            updateColumn,
            deleteColumn,
            moveTask,
            addTask,
            updateTask,
            deleteTask,
            setCurrentBoard,
            updateBoard,
            clearBoard,
            reorderTasks,
            reorderColumns
        }}>
            {children}
        </BoardContext.Provider>
    );
}


export function useBoard() {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
}