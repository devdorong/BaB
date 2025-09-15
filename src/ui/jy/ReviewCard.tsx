import styled from 'styled-components';
import { ItalianFood } from '../tag';

const CardLayout = styled.div`
  display: inline-flex;
  padding-right: 24px;
  align-items: center;
  gap: 23px;
  border-radius: 16px;
  background: #fff;
  /* 박스 그림자 */
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
`;

const CardImage = styled.img`
  width: 240px;
  height: 226px;
  flex-shrink: 0;
`;

const Title = styled.div`
  color: #000;
  font-size: 23px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const RowCard = () => {
  return (
    <div>
      <CardLayout>
        <CardImage src="public/sample.jpg" />
        <div style={{ display: 'inline-b' }}>
          <ItalianFood />
          {/* <Title>{restaurant.name}</Title> */}
          <Title>가게제목</Title>
        </div>
      </CardLayout>
    </div>
  );
};
