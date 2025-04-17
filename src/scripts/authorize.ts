import dotenv from 'dotenv';
import http from 'http';
import open from 'open';
import querystring from 'querystring';
import { URL } from 'url';
import AuthClient from '~/auth/authClient.js';

dotenv.config();

function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function startAuthFlow() {
  const state = generateRandomString(16);

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: AuthClient.client_id,
    scope: AuthClient.scopes,
    redirect_uri: AuthClient.redirect_uri,
    state,
  });

  const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

  await open(authUrl);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');

      if (!code || returnedState !== state) {
        res.writeHead(400);
        res.end('Invalid state or missing code');
        return;
      }

      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': AuthClient.encodedAuthorizationString,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: AuthClient.redirect_uri,
        }),
      });

      AuthClient.tokenJson = await tokenRes.json();

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Authentication successful! You can close this tab.');

      server.close();
    }
  });

  server.listen(8888, '127.0.0.1', () => {
    console.log(`Listening for callback on ${AuthClient.redirect_uri}`);
  });
}

await startAuthFlow();
