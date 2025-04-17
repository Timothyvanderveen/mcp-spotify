import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import AuthClient from '~/auth/authClient.js';

const t = SpotifyApi.withAccessToken(
  process.env.SPOTIFY_CLIENT_ID!,
  AuthClient.tokenJson,
  {
    fetch: async (req, init) => {
      let response = await fetch(req, init);

      if (response.status === 401) {
        const refresh_token = AuthClient.tokenJson.refresh_token;
        await AuthClient.refreshAccessToken(refresh_token);

        response = await fetch(req, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${AuthClient.tokenJson.access_token}`,
          },
        });
      }

      return response;
    },
  },
);

t.authenticate();

export default t;
