import React, { useState, useEffect } from 'react';
import { PluginElementContext } from '@burner-wallet/types';
import FortmaticButton from './FortmaticButton';

const FortmaticSettings: React.FC<PluginElementContext> = ({ accounts, actions, BurnerComponents }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const authenticated = !actions.canCallSigner('enable', 'fortmatic');
    setAuthenticated(authenticated);
    const setEmailAsync = async () => {
      if (authenticated) {
        const user = await actions.callSigner('user', 'fortmatic')
        setEmail(user)
      }
    }
    setEmailAsync();
    
  }, [accounts]);

  const logout = () => actions.callSigner('logout', 'fortmatic');

  return (
    <div>
      <h2>Fortmatic</h2>
      {authenticated ? (
        <div>
          <div>You are logged in with Fortmatic</div>
          {email && (<div>{email}</div>)}
          <BurnerComponents.Button onClick={logout}>Log out</BurnerComponents.Button>
        </div>
      ) : (
        <div>
          <FortmaticButton Button={BurnerComponents.Button} onClick={async () => {
            const account = await actions.callSigner('enable', 'fortmatic');
            setAuthenticated(!!account);
          }} />
        </div>
      )}
    </div>
  );
};

export default FortmaticSettings;
