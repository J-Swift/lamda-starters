const twilio = require('twilio');

const FROM_NUMBER = process.env.FROM_NUMBER;
const TWILIO_ACCT_SID = process.env.TWILIO_ACCT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const SERVER_ERROR = 500;
const CLIENT_ERROR = 400;

const failureWithMessage = (context, statusCode, error) => {
  const body = JSON.stringify({error}, null, 2);

  return context.succeed({statusCode, body});
};

const successWithBody = (context, data) => {
  const body = JSON.stringify({data}, null, 2);

  return context.succeed({statusCode: 200, body});
}

exports.handler = async (event, context) => {
  let result = null;
  
  if (!FROM_NUMBER) {
    return failureWithMessage(context, SERVER_ERROR, 'Must set FROM_NUMBER envvar!');
  }

  if (!TWILIO_AUTH_TOKEN) {
    return failureWithMessage(context, SERVER_ERROR, 'Must set TWILIO_AUTH_TOKEN envvar!');
  }

  if (!TWILIO_ACCT_SID) {
    return failureWithMessage(context, SERVER_ERROR, 'Must set TWILIO_ACCT_SID envvar!');
  }

  try {
    const client = twilio(TWILIO_ACCT_SID, TWILIO_AUTH_TOKEN);

    const body = JSON.parse(event.body);
    if (!body) {
      return failureWithMessage(context, CLIENT_ERROR, 'Must provide a body with [toNumber, mediaUrl]!');
    }

    const to = body.toNumber;
    const mediaUrl = body.mediaUrl;

    if (!to) {
      return failureWithMessage(context, CLIENT_ERROR, 'Must provide a toNumber!');
    }
    if (!mediaUrl) {
      return failureWithMessage(context, CLIENT_ERROR, 'Must provide a mediaUrl!');
    }

    const fax = await client.fax.faxes.create({
      from: FROM_NUMBER,
      to,
      mediaUrl,
    });

    result = {
      faxStatus: fax.status,
      faxId: fax.sid,
    };
  } catch (error) {
    return context.fail(error);
  } finally {
  }

  return successWithBody(context, result);
};
