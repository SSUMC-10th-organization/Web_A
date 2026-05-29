// 1. 받을 데이터의 타입을 정의해
interface WelcomeDataProps {
  userId: number;
}

// 2. 컴포넌트에서 그 타입을 사용해
const WelcomeData = ({ userId }: WelcomeDataProps) => {
  return (
    <div>
      사용자 ID: {userId}
    </div>
  );
};

export default WelcomeData;