import { useDispatch } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import auth from 'features/auth/store';

const rootReducer = combineReducers({
  auth: auth.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
