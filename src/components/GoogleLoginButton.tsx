import { GoogleIconSvg } from '../ui/jy/IconSvg';

const GoogleLoginButton = () => {
  return (
    <div className="w-full">
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#fff',
          border: '1px solid #DBDBDB',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'bacground-color 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#F5F5F5';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#fff';
        }}
      >
        {/* 카카오 아이콘 SVG */}
        <GoogleIconSvg />
        Google 로그인
      </button>
    </div>
  );
};

export default GoogleLoginButton;
