export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title: string;
  isCompleted: boolean;
}