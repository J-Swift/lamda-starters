require 'json'

USERNAME = ENV['USERNAME']

def lambda_handler(event:, context:)
  result = nil

  raise 'Must set USERNAME envvar!' unless USERNAME

  begin
    example_param = event['jimmy']

    result = {
      hello: USERNAME,
      param: example_param,
    };
  rescue Exception => e
    raise e
  end

  { statusCode: 200, body: JSON.pretty_generate(result) }
end

