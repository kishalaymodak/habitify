export interface TaskActivity {
  taskId: string;
  taskDone: boolean;
  date: string;
}

export interface Task {
  id: string;
  taskName: string;
  taskDesctription: string;
  createDate: string;
  taskActivity: TaskActivity[];
}

export type TasksResponse = Task[];
export type TaskActivityResposnse = TaskActivity[];

export interface HeatMapType {
  startDay: string;
  endDay: string;
  data: TaskActivityResposnse;
}
