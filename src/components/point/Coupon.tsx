import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Coupon = () => {
  const { user } = useAuth();

  return <div>Coupon</div>;
};

export default Coupon;
