import { useReducer, useState } from 'react'
import './App.css'

// state에 대한 interface
interface State {
  counter: number;
}

// reducer에 대한 interface
interface Action {
  type: 'INCREMENT' | 'DECREMENT' | 'RESET_TO_ZERO';
  payload?: number;
}

function reducer(state: State, action: Action): State {
  // type과 payload는 dispatch 호출 1번에만 존재하는 일회성 데이터
  const { type, payload = 1 } = action;

  // ...state를 통해서 기존의 state를 유지하면서, 
  // counter만 업데이트해야함.
  // 라이브러리 immer를 사용하면 불변성을 유지하기 위한 작업을 할 필요가 없음. 찾아보기.
  switch (type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + payload };
    case 'DECREMENT':
      return { ...state, counter: state.counter - payload };
    case 'RESET_TO_ZERO':
      return { ...state, counter: 0 };
    default:
      throw new Error('Invalid action type');
  }
}

// action = { type: 'INCREMENT', payload: 3 }
//          ─────────────────   ──────────
//               "뭘 할지"         "얼마나"


export default function CounterPage() {
  const [count, setCount] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
  });


  return (
    <div>
      <h1>useReducer 실습</h1>
      <div>
        <h2>useState Counter: {count}</h2>
        <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      </div>
      <div>
        <h2>useReducer Counter: {state.counter}</h2>
        <button onClick={(): void => 
          dispatch({ 
            type: 'INCREMENT', payload: 3}
          )}>Increment</button>
        <button onClick={(): void => dispatch({ type: 'DECREMENT' })}>Decrement</button>
        <button onClick={(): void => dispatch({ type: 'RESET_TO_ZERO' })}>Reset to Zero</button>
      </div>
    </div>
  )
}