import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice'
import chatReducer from './chat/chatSlice'
import userReducer from './user/userSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    chat: chatReducer,
    user: userReducer
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>