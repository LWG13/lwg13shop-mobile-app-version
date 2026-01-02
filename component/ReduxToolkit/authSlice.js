import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

/* =======================
   INITIAL STATE
======================= */
const initialState = {
  token: null,
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  _id: null,
  image: "",
  desc: "",
  product: [],
  follower: "",
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
  editedProfile: false,
  loadingAuth: false,
  emailReset: "",
  firstAuth: false,
  secondAuth: false,
  successReset: false,
  error: "",
  createProductSuccess: false,
  createLoading: "",
  createStatus: "",
  deleteProductSuccess: false,
  editProductSuccess: false,
  searchResult: [],
  searchLoading: false,
  searchSuccess: false,
};

/* =======================
   AUTH THUNKS
======================= */

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://ecommerce-server-y5yv.onrender.com/user/signup",
        values
      );

      await SecureStore.setItemAsync("token", res.data);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công",
      });

      return res.data;
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Đăng ký thất bại",
        text2: err.response?.data || "Có lỗi xảy ra",
      });
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://ecommerce-server-y5yv.onrender.com/user/login",
        values
      );

      await SecureStore.setItemAsync("token", res.data);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
      });

      return res.data;
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: err.response?.data || "Sai tài khoản hoặc mật khẩu",
      });
      return rejectWithValue(err.response.data);
    }
  }
);

export const editProfile = createAsyncThunk(
  "auth/avatar",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `https://ecommerce-server-y5yv.onrender.com/user/signup/${values._id}`,
        values
      );

      await SecureStore.setItemAsync("token", res.data);

      Toast.show({
        type: "success",
        text1: "Cập nhật hồ sơ thành công",
      });

      return res.data;
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Cập nhật thất bại",
      });
      console.log(err.response.data)
      return rejectWithValue(err.response.data);
    }
  }
);

/* =======================
   LOAD USER FROM STORAGE
======================= */
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async () => {
    const token = await SecureStore.getItemAsync("token");
    return token;
  }
);

/* =======================
   SLICE
======================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser() {
      SecureStore.deleteItemAsync("token");
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          state.token = action.payload;
          state.username = user.username;
          state.email = user.email;
          state.loadingAuth = true
          state.phoneNumber = user.phoneNumber;
          state._id = user._id;
          state.image = user.image;
          state.desc = user.desc;
          state.password = user.password
        }
        state.loadingAuth = true;
      })
.addCase(loadUserFromStorage.pending, (state) => {
  state.loadingAuth = true;
})

      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "pending";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.username = user.username;
        state.email = user.email;
        state._id = user._id;
        state.image = user.image;
        state.desc = user.desc;
        state.registerStatus = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "reject";
        state.registerError = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.username = user.username;
        state.email = user.email;
        state._id = user._id;
        state.image = user.image;
        state.desc = user.desc;
        state.loginStatus = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "reject";
        state.loginError = action.payload;
      })

      .addCase(editProfile.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);
        state.token = action.payload;
        state.username = user.username;
        state.email = user.email;
        state._id = user._id;
        state.image = user.image;
        state.desc = user.desc;
        state.editedProfile = true;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;