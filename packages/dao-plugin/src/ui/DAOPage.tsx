import React, { useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import DAOPlugin from '../DAOPlugin';
import styled from 'styled-components';
import DAOItem from './DAOItem';

const DAOPage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents, plugin }) => {
  const _plugin = plugin as DAOPlugin;
  const [buffidao, setBuffidao] = useState<any>(null);
  const [daos, setDAOs] = useState<any[]>([]);

  const fetchData = async () => {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/daostack/v38_0_xdai', {
      credentials: "omit",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-mode": "cors","sec-fetch-site":"same-site"
      },
      body: JSON.stringify({
        query: '{daos { id name register schemes { name id } proposals { title stage } } }',
        variables: null,
      }),
      method: "POST",
      mode: "cors",
    });
    const json = await response.json();
    setDAOs(json.data.daos.filter((dao: any) => {
      if (dao.name === 'BuffiDAO') {
        setBuffidao(dao);
        return false;
      }
      return dao.register === 'registered';
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { Page, History } = BurnerComponents;
  return (
    <Page title="DAOs">
      {buffidao && (
        <DAOItem dao={buffidao} />
      )}
      {daos.map((dao: any) => (
        <DAOItem dao={dao} key={dao.id} />
      ))}
    </Page>
  );
}

export default DAOPage;
