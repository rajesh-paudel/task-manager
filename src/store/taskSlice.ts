import { createSlice } from "@reduxjs/toolkit";
import type { Task } from "../types/task";
import type { PayloadAction } from "@reduxjs/toolkit";
interface TaskState {
  items: Record<string, Task>;
  sourceKey: string | null;
  status: "idle" | "loading" | "synced" | "error";
  error: string | null;
}
const initialState: TaskState = {
  items: {},
  sourceKey: null,
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksReceived(
      state,
      action: PayloadAction<{
        items: Record<string, Task>;
        sourceKey: string;
      }>,
    ) {
      state.items = action.payload.items;
      state.sourceKey = action.payload.sourceKey;
      state.status = "synced";
      state.error = null;
    },
    tasksLoading(state, action: PayloadAction<string>) {
      state.items = {};
      state.sourceKey = action.payload;
      state.status = "loading";
    },
    tasksError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },

    tasksCleared(state) {
      state.items = {};
      state.sourceKey = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { tasksReceived, tasksLoading, tasksError, tasksCleared } =
  taskSlice.actions;
export default taskSlice.reducer;
