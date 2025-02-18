import * as React from 'react';
import type { ToastProps } from "@/components/ui/toast";

export interface ToastData {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export type Toast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactElement;
};

export const createToast = (data: ToastData): Toast => ({
  ...data,
  id: crypto.randomUUID()
}); 