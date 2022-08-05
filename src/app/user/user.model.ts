import { Entity, Schema, FieldDefinition } from "redis-om";

import { generateId } from "../../utils/generateId";

export interface UserModel {
  name: string;
  email: string;
  password: string;
}

export class UserModel extends Entity {
  get id() {
    return this.entityId;
  }

  isNull() {
    return [this.email, this.password, this.name].every((val) => val === null);
  }

  toJSON() {
    return {
      id: this.entityId,
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }
}

export const RedisUserSchemaDefinitions: Partial<
  Record<keyof UserModel, FieldDefinition>
> = {
  name: {
    type: "string",
  },
  email: {
    type: "string",
  },
  password: {
    type: "string",
  },
};

export const UserModelSchema = new Schema(
  UserModel,
  RedisUserSchemaDefinitions,
  {
    prefix: "User",
    dataStructure: "JSON",
    idStrategy: generateId,
  }
);
