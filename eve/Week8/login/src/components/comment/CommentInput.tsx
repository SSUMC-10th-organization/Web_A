import styled from 'styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

const CommentInput = ({
  value,
  onChange,
  onSubmit,
  isPending,
}: Props) => {
  return (
    <InputRow>
      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="댓글을 입력해주세요"
      />

      <button
        onClick={onSubmit}
        disabled={isPending}
      >
        작성
      </button>
    </InputRow>
  );
};

export default CommentInput;

const InputRow = styled.div`
  display: flex;

  gap: 10px;

  margin-bottom: 30px;

  input {
    flex: 1;

    padding: 18px;

    border-radius: 12px;

    border: 1px solid #444;

    background: #1a1b1e;

    color: #fff;

    outline: none;

    font-size: 1rem;
  }

  button {
    width: 100px;

    border: none;

    border-radius: 12px;

    background: #5a5d66;

    color: white;

    font-weight: bold;

    cursor: pointer;
  }
`;