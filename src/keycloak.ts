import Keycloak from 'keycloak-js';
import { keycloakClientID, keycloakUrl } from './utils/ip';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: keycloakUrl,
  realm: 'master',
  clientId: keycloakClientID,
});

export default keycloak;
