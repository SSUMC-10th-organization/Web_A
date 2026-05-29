import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import modalReducer from "../slices/modalSlice";

// 1. 저장소 생성
function createStore() {
    const store = configureStore({
        //2. 리듀서 설정
        reducer: {
            cart: cartReducer,
            modal: modalReducer,
        },
        
    });

    return store;
}

// store를 활용할 수 있도록 export - store 빼줌(Singleton)
const store = createStore();
export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch