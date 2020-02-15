import React from 'react';
import styled from 'styled-components';

const ItemLink = styled.a`
  display: block;
  color: black;
  text-decoration: none;
  margin: 8px 0;
  border-bottom: solid 1px gray;
`;

interface ItemProps {
  dao: any;
}

const DAOItem: React.FC<ItemProps> = ({ dao }) => {

  const [scheme] = dao.schemes.filter((scheme: any) => scheme.name === 'ContributionRewardExt');

  if (!scheme) {
    return null;
  }

  const url = `https://alchemy-xdai.daostack.io/dao/${dao.id}/scheme/${scheme.id}/crx`;
  return (
    <ItemLink href={url} target="dao">
      <div>{dao.name}</div>
      <ul>
        {dao.proposals.filter((proposal: any) => proposal.stage === 'Executed').map((proposal: any) => (
          <li key={proposal.title}>{proposal.title}</li>
        ))}
      </ul>
    </ItemLink>
  )
}

export default DAOItem;
