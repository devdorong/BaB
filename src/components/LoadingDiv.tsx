import { MoonLoader } from 'react-spinners';

function LoadingDiv() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      <MoonLoader speedMultiplier={0.7} />
    </div>
  );
}

export default LoadingDiv;
