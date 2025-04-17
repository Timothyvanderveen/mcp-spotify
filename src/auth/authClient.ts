import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

interface TOKEN_JSON extends JSON {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}

export default {
  redirect_uri: `http://127.0.0.1:8888/callback`,
  token_json_path: path.resolve(process.argv[1], '../../token.json'),
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
    'user-read-playback-state',
  ].join(' '),
  get client_id() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    if (!clientId) {
      throw Error('Environment variable \'SPOTIFY_CLIENT_ID\' not set.');
    }
    return clientId;
  },
  get client_secret() {
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!clientSecret) {
      throw Error('Environment variable \'SPOTIFY_CLIENT_SECRET\' not set.');
    }
    return clientSecret;
  },
  get encodedAuthorizationString() {
    return 'Basic ' + Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64');
  },
  get tokenJson(): TOKEN_JSON {
    const tokenJson = JSON.parse(readFileSync(this.token_json_path, 'utf8'));
    this.validateTokenJson(tokenJson);
    return tokenJson;
  },
  set tokenJson(newTokenJson: JSON) {
    if (this.validateTokenJson(newTokenJson)) {
      writeFileSync(this.token_json_path, JSON.stringify(newTokenJson, null, 2));
    }
  },
  validateTokenJson(tokenJson: JSON): tokenJson is TOKEN_JSON {
    const isValid = [
      'access_token',
      'token_type',
      'expires_in',
      'refresh_token',
      'scope',
    ].every(v => Object.hasOwn(tokenJson, v));

    if (!isValid) {
      throw Error(`Invalid token.json`);
    }

    return true;
  },
  refreshAccessToken: async function (refresh_token: string) {
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Authorization': this.encodedAuthorizationString,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: this.client_id,
      }),
    };
    const body = await fetch(url, payload);

    this.tokenJson = Object.assign({ refresh_token }, await body.json());

    return this.tokenJson;
  },
};
