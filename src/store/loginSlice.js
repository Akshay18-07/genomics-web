import { createSlice } from "@reduxjs/toolkit";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

const adminMail = "admin@gmail.com";
const userMail = "user1@gmail.com";
const user2Mail = "user2@gmail.com";

const initialState = {
  error: "",
  token: "",
  rememberMe: false,
  user: {
    id: "",
    name: "",
    email: "",
    role: "",
    Password: "",
  },
  product: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    onLogin: (state, action) => {
      const { user, rememberMe } = action.payload;

      if (user?.email == adminMail) {
        state.user.id = "1";
        state.user.name = user.email;
        state.user.email = user.email;
        state.user.role = "admin";
        state.error = "";
      } else if (user?.email == userMail || user?.email == user2Mail) {
        state.user.id = "1";
        state.user.name = user.email;
        state.user.email = user.email;
        console.log(user, "kajsbdkjasndkjasbn");
        state.user.role = "user";
        state.error = "";
      } else {
        state.error = "No user found";
      }
      state.token = "token";
      state.user.Password = user.Password;
      state.rememberMe = rememberMe;
    },
    logout: () => {
      return initialState;
    },
    addProduct: (state, action) => {
      state.product = action.payload;
    },
  },
});

export const { onLogin, logout, addProduct } = loginSlice.actions;

export default loginSlice.reducer;
