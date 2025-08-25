import { useState } from 'react';

const Sample = (): JSX.Element => {
  return <div>샘플입니다.</div>;
};

const App = (): JSX.Element => {
  // ts
  const [count, setCount] = useState(0);

  // tsx
  return (
    <div>
      <h1>App</h1>
      <Sample></Sample>
      <div>Count : {count}</div>
      <button onClick={() => setCount(count + 1)}>증가</button>
      <button onClick={() => setCount(count - 1)}>감소</button>
      <button onClick={() => setCount(0)}>리셋</button>
    </div>
  );
};

export default App;
