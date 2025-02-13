export interface Board {
    id: string;
    projectId: string;
    columns: Column[];
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Task {
    id: string;
    columnId: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
}
