interface Task{
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    assignedId: string;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}