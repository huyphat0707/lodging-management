import { api } from "./shared";
import type { OperationalTask, TaskStatus, TaskPriority } from "./types";

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
  propertyId: string;
  roomId?: string;
}

export const tasksApi = {
  getTasks: async (propertyId?: string): Promise<OperationalTask[]> => {
    const url = propertyId ? `/tasks?propertyId=${propertyId}` : "/tasks";
    return api.get<OperationalTask[]>(url);
  },

  getTaskById: async (id: string): Promise<OperationalTask> => {
    return api.get<OperationalTask>(`/tasks/${id}`);
  },

  createTask: async (data: CreateTaskDto): Promise<OperationalTask> => {
    return api.post<OperationalTask>("/tasks", data);
  },

  updateTask: async (id: string, data: Partial<CreateTaskDto>): Promise<OperationalTask> => {
    return api.patch<OperationalTask>(`/tasks/${id}`, data);
  },

  deleteTask: async (id: string): Promise<void> => {
    return api.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: TaskStatus): Promise<OperationalTask> => {
    return api.patch<OperationalTask>(`/tasks/${id}/status`, { status });
  },
};
