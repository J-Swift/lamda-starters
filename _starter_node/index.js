const USERNAME = process.env.USERNAME;

exports.handler = async (event, context) => {
  let result = null;
  
  if (!USERNAME) {
    return context.fail(`Must set USERNAME envvar!`);
  }

  try {
    const exampleParam = event.jimmy;
    const exampleParamWithFallback = event.jimmy2 ? event.jimmy2 : null;

    result = JSON.stringify({
      hello: USERNAME,
      param: exampleParam,
      paramWithFallback: exampleParamWithFallback,
    }, null, 2);
  } catch (error) {
    return context.fail(error);
  } finally {
  }

  return context.succeed({statusCode: 200, body: result});
};

