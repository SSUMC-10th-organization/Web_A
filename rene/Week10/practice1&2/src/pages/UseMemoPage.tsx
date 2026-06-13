import { useState, useMemo } from 'react';
import TextInput from '../components/TextInput';
import { findPrimeNumbers } from '../utils/math';

const Practice2 = () => {
  console.log("Practice2 rendered");

  const [limit, setLimit] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleChangeText = (text: string) => {
    setText(text);
  };

  // const primes = findPrimeNumbers(limit);
  const primes = useMemo(() => findPrimeNumbers(limit), [limit]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>Practice 2: useMemo</h1>
      <label>
        숫자 입력 (소수찾기):
        <input 
          type="number" 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))} 
        />
      </label>

      <h2> 소수 리스트 : </h2>
      <div className='flex flex-wrap gap-2'>
        {primes.map((prime) => (
          <div key={prime}>{prime}&nbsp;</div>
        ))}
      </div>

      <label>
        {text}
        다른 입력 테스트: <TextInput onChange={handleChangeText} />
      </label>
    </div>  
  );
};

export default Practice2;