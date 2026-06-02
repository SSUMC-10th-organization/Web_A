import { useReducer, useState } from 'react';

interface CompanyState {
  name: string;
  error: string | null;
};

interface CompanyAction {
  type: 'CHANGE_NAME' | 'RESET_NAME';
  payload: string;
};

// 리듀서 함수 - 상태 업데이트 로직을 정의
function reducer(state: CompanyState, action: CompanyAction): CompanyState {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_NAME':
      return { ...state, name: payload };
    case 'RESET_NAME':
      return { ...state, name: '' };
    default:
      throw new Error('Invalid action type');
  }
}


export default function CompanyPage() {
  // useState를 사용하여 입력된 회사 이름을 관리
  const [company, setCompany] = useState('');
  const handleChangeCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
  };

  
  // useReducer를 사용하여 회사 이름과 에러 상태를 관리
  const [state, dispatch] = useReducer(reducer, {
    name: 'Naver',
    error: null,
  })

  return (
    <div>
      <h1>Company Page</h1>
      <p>회사 이름: {state.name}</p>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <input 
        type="text" 
        style= {{ margin : '10px' }}
        value={company} 
        placeholder="회사 이름을 입력하세요"
        onChange={handleChangeCompany} 
      />
      <button onClick={() => 
        dispatch({ type: 'CHANGE_NAME', payload: company })}
      > 회사 이름 변경 </button>
      <button onClick={() => 
        dispatch({ type: 'RESET_NAME', payload: '' })}
      > 회사 이름 초기화 </button>
    </div>
  );
}