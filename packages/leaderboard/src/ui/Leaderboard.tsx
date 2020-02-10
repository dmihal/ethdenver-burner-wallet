import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PluginPageContext } from '@burner-wallet/types';
import Box from '3box';
import makeBlockie from 'ethereum-blockies-base64';

const TopFive = styled.div`
  background-image: url('https://i.imgur.com/hiE3eK7.png');
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: left;
  height: 50px;
  width: 100%;
  background-size: auto 26px;
`

const EveryBodyElse = styled.div`
  background-image: url('https://i.imgur.com/7AKwc5A.png');
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: left;
  height: 50px;
  width: 100%;
  background-size: auto 26px;
`

const Table = styled.table`
  margin-bottom: 18px;
  border-collapse: collapse;

  & h2 {
    width: fit-content;
  }
`

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
    padding: 6px 0 ;
    margin-top: 15px;
    height: 56px
    vertical-align: top;

    & h3 {
      margin: 0;
    }

    & p {
      margin: 0;
      white-space:nowrap;
    }
  }

  ${({ isTopFive }) => {
    if (isTopFive) {
      return `
        & h3 {
          font-size: 20px;
        }
      `;
    } else {
      return `
      border-bottom: 1px solid #ffffff2e;
      `
    }
  }
  }
`

const DataRank = styled.td`
  width: 8%;
  & p {
    opacity: .6
  }
`

const DataUser = styled.td`
  ${({ isTopFive }) => {
    if (isTopFive) {
      return `
      width: 75%;
      `;
    } else {
      'width: 67%;'
    }
  }
  }
`

const DataXP = styled.td`
  width: 25%;

  ${({ isTopFive }) => {
    if (isTopFive) {
      return `
        & p {
          font-size: 16px;
        }
      `;
    }
  }
  }
  
`

const Profile = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const ProfilePicture = styled.img`
  min-width: 45px;
  min-height: fit-content;
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
  height: fit-content;
  min-height: 45px;

  & h3 {
    height: 65%;
    font-weight: 800;
  }
`

const ProfileMetaNames = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  height: fit-content;

  & p {
    opacity: .6;
    font-size: 13px;
  }

  & p:first-of-type {
    margin-right: 6px;
  }

  & a {
    text-decoration: none;
    color: white;
  }
`

const LoadingAnimation = styled.div`
  background-image: url('https://svgshare.com/i/Hdi.svg');
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: center;
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
`

const daoMemberRequest = (offset) => {
  return {
    query: `{
    daos(where: {id: "0x294f999356ed03347c7a23bcbcf8d33fa41dc830"}) {
      reputationHolders(first: 10, skip: ${offset}, orderBy: balance, orderDirection: desc) {
        address
        balance
      }
    }
  }`,
  }
};

const topFiveDaoMemberRequest = () => {
  return {
    query: `{
    daos(where: {id: "0x294f999356ed03347c7a23bcbcf8d33fa41dc830"}) {
      reputationHolders(first: 5, skip: 0, orderBy: balance, orderDirection: desc) {
        address
        balance
      }
    }
  }`,
  }
};

const createProfiles = async (reputationHolders) => {
  const fetchedProfiles = await Promise.all(reputationHolders.map(address => Box.getProfile(address)));
  const verifiedAccounts = await Promise.all(fetchedProfiles.map(address => Box.getVerifiedAccounts(address)));
  const ensNamesArray = await Promise.all(fetchedProfiles.map(address => fetchENSNames(address)));

  return {
    fetchedProfiles,
    verifiedAccounts,
    ensNamesArray,
  }
}

const shortenEthAddr = (str) => {
  const shortenStr = str && `${str.substring(0, 5)}...${str.substring(str.length - 5, str.length)}`;
  return shortenStr;
};

const handleRankProfiles = (completeProfiles) => {
  const reputationHolders = Object.values(completeProfiles);
  return reputationHolders.sort((a, b) => {
    const balanceA = parseInt(a.balance);
    const balanceB = parseInt(b.balance);
    if (balanceA < balanceB) return 1;
    if (balanceA > balanceB) return -1;
    return 0;
  });
};

const assembleCompleteProfiles = (reputationHolders, userList) => {
  const { fetchedProfiles, verifiedAccounts, ensNamesArray } = userList;
  const completeProfiles = {};
  reputationHolders.forEach((user, i) => {
    const { name, image } = fetchedProfiles[i];
    const { twitter } = verifiedAccounts[i];
    const ensName = ensNamesArray[i];

    completeProfiles[user.address] = {
      address: user.address,
      balance: user.balance,
      name,
      image,
      twitter,
      ensName,
    }
  });
  return completeProfiles;
}

const fetchDAOMembers = async (requestShape, offset) => {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/daostack/alchemy', {
    method: 'POST',
    body: JSON.stringify(requestShape(offset)),
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

// polling every five minutes for updates to the leaderboard
function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const fetchENSNames = async (address) => {
  const ensDomainRequest = {
    query: ` {
        domains(where:{ owner: "${address}" }) {
          name
        }
      }`,
  };

  const res = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
    method: 'POST',
    body: JSON.stringify(ensDomainRequest),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 200 && res.status !== 201) console.log('Failed', res);

  const {
    data,
    errors,
  } = await res.json();

  if (errors) console.log('errors', errors);
  if (data.domains.length) return data.domains[0].name;
}

const LeaderboardPage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents }) => {
  const { Page } = BurnerComponents;
  const StyledPage = styled(Page)`
  background-color: #231047;
  color: white;

  & rect {
    fill: #ffffff;
  }

  & h1 {
    background-image: url('https://i.imgur.com/cNaIE8G.png');
    background-repeat: no-repeat;
    background-position-y: center;
    background-position-x: left;
    height: 50px;
    width: 100%;
    background-size: auto 30px;
    color: transparent;
  }

  & svg {
    fill: white;
  }
`
  const [rankingOrder, setRankedProfiles] = useState([]);
  const [topFiveOrder, setTopFiveProfiles] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [offset, setOffset] = useState(5);

  useInterval(handleFetchDaoMembers, 300000);
  useInterval(handleTopFive, 300000);

  async function handleTopFive() {
    const topFiveHolders = await fetchDAOMembers(topFiveDaoMemberRequest, null);
    const topFive = await createProfiles(topFiveHolders);
    const topFiveProfiles = assembleCompleteProfiles(topFiveHolders, topFive);
    const topFiveProfilesRanked = handleRankProfiles(topFiveProfiles);

    setTopFiveProfiles(topFiveProfilesRanked);
  }

  async function handleFetchDaoMembers() {
    setShowLoading(true);
    const reputationHolders = await fetchDAOMembers(daoMemberRequest, offset);
    const mainList = await createProfiles(reputationHolders);
    const completeProfiles = assembleCompleteProfiles(reputationHolders, mainList);
    const allProfilesRanked = handleRankProfiles(completeProfiles);

    setRankedProfiles(prevOrder => [...prevOrder, ...allProfilesRanked]);
    setShowLoading(false);
  }

  useEffect(() => {
    handleTopFive();

    const scrollListener = () => {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
      const { body } = document;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;

      if (windowBottom >= docHeight) {
        setOffset(prevOffset => prevOffset + 10);
      }
    };
    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  useEffect(() => {
    handleFetchDaoMembers();
  }, [offset]);

  return (
    <StyledPage title="Leaderboard">
      <TopFive />
      <Table>
        <TableBody>
          {topFiveOrder.map((account, i) => (
            <LeaderRow
              profile={account}
              xp={account.balance}
              address={account.address}
              key={account.address}
              offset={offset}
              rank={i + 1}
              isTopFive={true}
            />
          ))}
        </TableBody>
      </Table>

      <EveryBodyElse />
      <Table>
        <TableBody>
          {rankingOrder.map((account, i) => (
            <LeaderRow
              profile={account}
              xp={account.balance}
              address={account.address}
              key={account.address}
              offset={offset}
              rank={i + 1}
              isTopFive={false}
            />
          ))}
        </TableBody>
      </Table>

      <LoadingWrapper>
        {showLoading && <LoadingAnimation />}
      </LoadingWrapper>
    </StyledPage>
  );
};

export default LeaderboardPage;

const LeaderRow = ({ profile, xp, address, rank, isTopFive }) => {
  const { image, name, twitter, ensName } = profile;
  const src = image ? `https://ipfs.infura.io/ipfs/${image[0].contentUrl['/']}` : makeBlockie(address);

  return (
    <TableRow isTopFive={isTopFive}>
      {!isTopFive && (
        <DataRank>
          <p>{rank + 5}</p>
        </DataRank>
      )}

      <DataUser isTopFive={isTopFive}>
        <Profile>
          {isTopFive && <ProfilePicture src={src} alt="Profile" />}
          <ProfileNames isTopFive={isTopFive}>
            <h3>
              {name || shortenEthAddr(address)}
            </h3>

            <ProfileMetaNames>
              {name && <p>{shortenEthAddr(address)}</p>}
              {ensName && (
                <a href={`https://${ensName}`}>
                  <p>{ensName}</p>
                </a>
              )}
              {twitter && (
                <a href={`https://twitter.com/${twitter}`}>
                  <p>{`@${twitter}`}</p>
                </a>
              )}
            </ProfileMetaNames>
          </ProfileNames>
        </Profile>
      </DataUser>

      <DataXP isTopFive={isTopFive}>
        <p>
          {`${(xp / 1000000000000000000).toFixed(0)} pts`}
        </p>
      </DataXP>
    </TableRow>
  )
}