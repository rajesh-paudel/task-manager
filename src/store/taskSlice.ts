import { createSlice } from "@reduxjs/toolkit";
import type { Task } from "../types/task";
import type { PayloadAction } from "@reduxjs/toolkit";
interface TaskState {
  items: Record<string, Task>;
  status: "idle" | "loading" | "synced" | "error";
  error: string | null;
}
const initialState: TaskState = {
  items: {},
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksReceived(state, action: PayloadAction<Record<string, Task>>) {
      state.items = action.payload;
      state.status = "synced";
      state.error = null;
    },
    tasksLoading(state) {
      state.status = "loading";
    },
    tasksError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },

    tasksCleared(state) {
      state.items = {};
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { tasksReceived, tasksLoading, tasksError, tasksCleared } =
  taskSlice.actions;
export default taskSlice.reducer;
