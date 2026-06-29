import { useCallback, useState } from 'react';
import CountButton from '../components/countButton';
import TextInput from '../components/TextInput';

const Practice1 = () => {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleIncreaseCount = useCallback((value: number) => {
    //setCount(count + value); // stale closure 문제 발생: count가 0으로 고정됨
    setCount((prev) => prev + value); // stale closure을 막는 방법: setState에 함수형 업데이트 사용
  }, []);

  const handleText = useCallback((value: string) => {
    setText(value);
  }, []);

  return (
    <div>
      <h1>Practice 1: 최적화 사용</h1>
      <h2>Count: {count}</h2>
      <CountButton onClick={handleIncreaseCount} />
      <h2>Text: {text}</h2>
      <TextInput onChange={handleText} />
    </div>
  );
};

export default Practice1;