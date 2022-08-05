import { Entity, Schema, FieldDefinition } from "redis-om";

import { generateId } from "../../utils/generateId";

export interface TodoModel {
  title: string;
  isCompleted: boolean;
  userId: string;
}

export class TodoModel extends Entity {
  get id() {
    return this.entityId
  }

  isNull() {
    return [this.title, this.isCompleted, this.userId].every(
      (val) => val === null
    );
  }

  toJSON() {
    return {
      id: this.entityId,
      title: this.title,
      isCompleted: this.isCompleted,
    };
  }
}

export const TodoSchemaDefinitions: Partial<
  Record<keyof TodoModel, FieldDefinition>
> = {
  title: {
    type: "string",
  },
  isCompleted: {
    type: "string",
  },
  userId: {
    type: "string",
  },
};

export const TodoModelSchema = new Schema(TodoModel, TodoSchemaDefinitions, {
  prefix: "Todo",
  dataStructure: "JSON",
  idStrategy: generateId,
});
