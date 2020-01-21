import React, { useState, useEffect, Component } from 'react';
import styled from 'styled-components';
import { PluginPageContext } from '@burner-wallet/types';
import Box from '3box';
import makeBlockie from 'ethereum-blockies-base64';

const TableBody = styled.tbody`
  margin-top: 8px;
`

const TableRow = styled.tr`
  width: 100%;
  
  & th {
    text-align: left;
    height: 40px;
  }

  & td {
    text-align: left;
    padding: 0;
    margin-top: 15px;
    vertical-align: center;
    height: 58px

    & h3 {
      margin: 0;
    }

    & p {
      margin: 0;
      white-space:nowrap;
    }
  }
`

const RankHeader = styled.th`
  width: 8%;
`

const UserHeader = styled.th`
  width: 50%;
`
const XPHeader = styled.th`
  width: 42%;
`

const Profile = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const ProfilePicture = styled.img`
  min-width: 45px;
  min-height: 45px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 12px;
`

const ProfileNames = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const daoMemberRequest = (offset) => {
  return {
    query: `{
    daos(where: {id: "0x294f999356ed03347c7a23bcbcf8d33fa41dc830"}) {
      reputationHolders(first: 12, skip: ${offset}, orderBy: balance, orderDirection: desc) {
        address
        balance
      }
    }
  }`,
  }
};

const shortenEthAddr = (str) => {
  const shortenStr = str && `${str.substring(0, 5)}...${str.substring(str.length - 5, str.length)}`;
  return shortenStr;
};

const getRankedProfiles = (reputationHolders) => {
  return reputationHolders.sort((a, b) => {
    const balanceA = parseInt(a.balance);
    const balanceB = parseInt(b.balance);
    if (balanceA < balanceB) return 1;
    if (balanceA > balanceB) return -1;
    return 0;
  });
};

const assembleCompleteProfiles = (reputationHolders, fetchedProfiles, fetchedVerifiedAccounts) => {
  const completeProfiles = {};
  reputationHolders.forEach((user, i) => {
    const { name, image } = fetchedProfiles[i];
    const { twitter } = fetchedVerifiedAccounts[i];

    completeProfiles[user.address] = {
      address: user.address,
      balance: user.balance,
      name,
      image,
      twitter,
    }
  });
  return completeProfiles;
}

const fetchDAOMembers = async (offset) => {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/daostack/alchemy', {
    method: 'POST',
    body: JSON.stringify(daoMemberRequest(offset)),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const {
    data,
    errors,
  } = await res.json();

  if (errors) console.log('errors', errors);

  return data.daos[0].reputationHolders;
};

const LeaderboardPage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents }) => {
  const { Page } = BurnerComponents;
  const [profiles, setProfiles] = useState({});
  const [rankingOrder, setRankedProfiles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isReady, setReady] = useState(false);

  async function handleFetchDaoMembers() {
    setReady(false);
    const reputationHolders = await fetchDAOMembers(offset);

    const fetchedProfiles = await Promise.all(reputationHolders.map(address => Box.getProfile(address)));
    const fetchedVerifiedAccounts = await Promise.all(fetchedProfiles.map(address => Box.getVerifiedAccounts(address)));

    const completeProfiles = assembleCompleteProfiles(reputationHolders, fetchedProfiles, fetchedVerifiedAccounts);
    const rankedProfiles = getRankedProfiles(reputationHolders);

    setProfiles(completeProfiles);
    setRankedProfiles(rankedProfiles);
    setReady(true);
  }

  useEffect(() => {
    handleFetchDaoMembers();
  }, [offset]);

  const loadMore = async (next) => {
    const offsetDelta = next ? 12 : -12;
    setOffset(offset + offsetDelta);
  }

  return (
    <Page title="Leaderboard">
      <table>
        <thead>
          <TableRow>
            <RankHeader>Rank</RankHeader>
            <UserHeader>User</UserHeader>
            <XPHeader>XP</XPHeader>
          </TableRow>
        </thead>

        {isReady && (
          <TableBody>
            {console.log('profiles', profiles)}
            {rankingOrder.map((account, i) => (
              <LeaderRow
                profile={profiles[account.address]}
                xp={account.balance}
                address={account.address}
                key={account.address}
                offset={offset}
                rank={i + 1}
              />
            ))}
          </TableBody>
        )}
      </table>

      {offset > 0 && (
        <button onClick={() => loadMore(false)}>
          Previous
        </button>
      )}

      <button onClick={() => loadMore(true)}>
        Next
      </button>
    </Page>
  );
};

export default LeaderboardPage;

const LeaderRow = ({ profile, xp, address, rank, offset }) => {
  const { image, name, twitter } = profile;
  const src = image ? `https://ipfs.infura.io/ipfs/${image[0].contentUrl['/']}` : makeBlockie(address);
  return (
    <TableRow>
      <td>
        <p>{rank + offset}</p>
      </td>
      <td>
        <Profile>
          <ProfilePicture src={src} alt="Profile" />
          <ProfileNames>
            <h3>
              {name || shortenEthAddr(address)}
            </h3>
            {twitter && <p>{`@${twitter}`}</p>}
          </ProfileNames>
        </Profile>
      </td>
      <td>
        <p>
          {`${xp / 10000000000000000000} pts`}
        </p>
      </td>
    </TableRow>
  )
}