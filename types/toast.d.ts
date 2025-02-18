import { ToastActionElement } from "@radix-ui/react-toast";
import { ReactNode } from "react";

export interface ToastData {
  title?: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'destructive';
}

export interface Toast extends ToastData {
  id: string;
  action?: ToastActionElement;
}

// Helper function to create toast data with ID
export const createToast = (data: ToastData): Toast => ({
  ...data,
  id: crypto.randomUUID()
}); 