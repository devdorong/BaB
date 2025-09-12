import { useState } from 'react';
import { ButtonFillLG, ButtonFillMd, ButtonLineLg, ButtonLineMd } from '../../ui/dorong/button';
import { LogoLg, LogoMd, LogoSm } from '../../ui/dorong/Ui';

function MemberPage() {
  return (
    <div>
      <h2>MemberPage</h2>
      <LogoLg />
      <LogoMd />
      <LogoSm />
      <ButtonLineMd>button</ButtonLineMd>
      <ButtonFillMd>button</ButtonFillMd>
      <ButtonLineLg>button</ButtonLineLg>
      <ButtonFillLG>button</ButtonFillLG>
    </div>
  );
}

export default MemberPage;
