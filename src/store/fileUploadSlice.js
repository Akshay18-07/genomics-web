import { createSlice } from "@reduxjs/toolkit";
import { filesData, filesDataOnquer } from "./data/file_upload_data";

const initialState = {
  files: [],
  status: "idle",
  error: null,
};

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      if (action.payload.email !== "admin@gmail.com") {
        if (action.payload.product == "Inherigene") {
          state.files = [...filesData.filter((item) => item.user == action.payload.email)];
        } else {
          console.log(
            action.payload.user,

            filesDataOnquer.filter((item) => item.user == action.payload.email)
          );
          state.files = [...filesDataOnquer.filter((item) => item.user == action.payload.email)];
        }
      } else {
        if (action.payload.product == "Inherigene") {
          state.files = [...filesData];
        } else {
          state.files = [...filesDataOnquer];
        }
      }
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    addFiles: (state, action) => {
      state.files = [...action.payload, ...state.files];
    },
    editFile: (state, action) => {
      // action.payload should have: id, updatedFields
      const { id, updatedFields } = action.payload;
      const idx = state.files.findIndex((f) => f.id === id);
      if (idx !== -1) {
        state.files[idx] = { ...state.files[idx], ...updatedFields };
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    deleteFile: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  addFile,
  addFiles,
  setStatus,
  setError,
  clearFiles,
  editFile,
  setInitialData,
  deleteFile,
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
