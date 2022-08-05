import { ObjectId } from "bson";

export const getTimeFromObjectId = (id?: string | null) => {
  if (!id) {
    return null;
  }

  return new ObjectId(id).getTimestamp()?.getTime();
};

export const generateId = (): string => {
  return new ObjectId().toString();
};
