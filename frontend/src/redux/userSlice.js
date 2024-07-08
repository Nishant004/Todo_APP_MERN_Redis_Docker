import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: null,
    user: null, 
  },
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload; 
    },
   
  },
});

export const { SetUser  } = userSlice.actions;
export default userSlice.reducer;

