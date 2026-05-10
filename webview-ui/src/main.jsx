import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Conformidade UI: badges e grupos devem ser derivados do estado real.
// Implementação em ReviewLeftbar: buildNavigationBadges(state) e buildRuleGroups(state).
createRoot(document.getElementById('root')).render(<App />);
