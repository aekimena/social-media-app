import { createSlice } from "@reduxjs/toolkit";

const updateSlice = createSlice({
  name: "updateSlice",
  initialState: {
    iconName: "",
    text: "",
    updateType: null,
    id: null,
    updateShown: false,
  },
  reducers: {
    showUpdate: (state, action) => {
      state.iconName = action.payload.iconName;
      state.text = action.payload.text;
      state.updateShown = true;
    },
    hideUpdate: (state, action) => {
      state.updateShown = false;
    },
  },
});

export const { showUpdate, hideUpdate } = updateSlice.actions;

export default updateSlice.reducer;
