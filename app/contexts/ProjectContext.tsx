import React, { createContext, useContext, useState } from 'react';
import { Project } from "@/types/project";

interface ProjectContextType{
    project: Project | null;
    createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [project, setProject] = useState<Project | null>(null);

    const createProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newProject: Project = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setProject(newProject);
    };

    const updateProject = (id: string, data: Partial<Project>) => {
        setProject(currentProject => {
            if (currentProject?.id !== id) return currentProject;
            return { ...currentProject, ...data, updatedAt: new Date() };
        });
    };

    const deleteProject = (id: string) => {
        setProject(currentProject => 
            currentProject?.id === id ? null : currentProject
        );
    };

    const setCurrentProject = (project: Project) => {
        setProject(project);
    };

    return (
        <ProjectContext.Provider value={{
            project,
            createProject,
            updateProject,
            deleteProject,
            setCurrentProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
}




export function useProject() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject Must Be Used Within A ProjectProvider');
    }
    return context;
}

