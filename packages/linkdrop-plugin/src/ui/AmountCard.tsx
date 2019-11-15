import React from 'react';
import { Asset } from '@burner-wallet/assets';
import styled from 'styled-components';

const Card = styled.div`
  display: inline-block;
  border-radius: 10px;
  border: solid 1px #AAAAAA;
  padding: 4px;
`;

interface AmountCardProps {
  asset: Asset;
  value: string;
}

const AmountCard: React.FC<AmountCardProps> = ({ value, asset }) => (
  <Card>
    {asset.name}:
    {asset.getDisplayValue(value)}
  </Card>
);

export default AmountCard;
