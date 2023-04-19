import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
async function googleVerify(token = '') {

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  // const payload = ticket.getPayload();
  const {name, picture, email} = ticket.getPayload();
  return {
    nombre: name,
    img: picture,
    correo: email
  }
}

googleVerify().catch(console.error);

export {googleVerify}