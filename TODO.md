# next steps
1. [x] create google project
2. [x] query dynamo for created account
3. [x] create google auth client
4. [ ] 

# future
1. use `oAuth2Client.setCredentials(...TODO)`, where TODO is of Credentials type, here: `node_modules\google-auth-library\build\src\auth\credentials.d.ts`
2. implement refresh at next-auth level https://next-auth.js.org/tutorials/refresh-token-rotation#client-side

## Links
1. google auth flow with code: https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest#ways-to-authenticate
2. gmail thread api: https://developers.google.com/gmail/api/reference/rest/v1/users.threads#Thread
3. next auth models: https://next-auth.js.org/adapters/models
4. next auth refresh access token: https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
5. next auth set scopes: https://github.com/nextauthjs/next-auth/discussions/4557