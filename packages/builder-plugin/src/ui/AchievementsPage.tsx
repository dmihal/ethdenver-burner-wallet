import React, { useState, useEffect } from 'react';
import { PluginPageContext, Asset, AccountBalanceData } from '@burner-wallet/types';
import BuilderPlugin, { Achievement } from '../BuilderPlugin';
import styled from 'styled-components';

const Empty = styled.div`
  flex: 1;
`;

const AchievementsPage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents, plugin }) => {
  const _plugin = plugin as BuilderPlugin;
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { Page, History } = BurnerComponents;
  return (
    <Page title="Achievements">
      {achievements.length === 0 && (
        <Empty>Nothing yet... go complete some challenges</Empty>
      )}

      {achievements.map((achievement: Achievement) => (
        <div key={achievement.title}>
          <div>{achievement.title}</div>
          <div>{achievement.description}</div>
        </div>
      ))}
    </Page>
  );
}

export default AchievementsPage;
