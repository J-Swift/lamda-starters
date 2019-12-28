const USERNAME = process.env.USERNAME;

exports.handler = async (event, context) => {
  if (!USERNAME) {
    return context.fail(`Must set USERNAME envvar!`);
  }

  let result = null;

  try {
    const exampleParam = event.jimmy;
    result = JSON.stringify({
      hello: USERNAME,
      param: exampleParam
    });
  } catch (error) {
    return context.fail(error);
  } finally {
  }

  return context.succeed({statusCode: 200, body: result});
};

