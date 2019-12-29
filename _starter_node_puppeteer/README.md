## Gotchas

Puppeteer is a little more involved than other lambda workflows because you need to

1) ship a special chromium binary in your function code
1) configure s3 buckets for code updates
1) increase the defaults for memory/runtime
1) do extra work to get local testing to work

## Shipping special Chromium binary

This is already handled by the provided package.json. It uses [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda). You want to be sure that the versions for `chrome-aws-lambda` and `puppeteer-core` match if you change them.

## Creating s3 bucket

You will want to upload your code updates to an s3 buckets instead of the usual direct zip upload. If you don't then you will deal with very slow uploads and run into timeouts if it takes more than 5 minutes to upload.

I recommend using the aws-cli for this:

```sh
aws s3 mb s3://{name-of-your-bucket}
```

After you do this, you will want to set the appropriate values in the deploy script.

## Increasing lambda defaults

Default lambda timeout is 3 seconds, so you will want to bump that up. AWS actually gives CPU power proportional to the amount of RAM you configure, so the more RAM you allocate the faster your code will run. This is very useful for puppeteer workflows, since it is inherantly slow.

I recommend the following:

- RAM: 1600mb
- Timeout: 60 seconds

## Local testing

I recommend following the recommendation [in the `chrome-aws-lambda` wiki](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development#workaround). Basically, you want to install the full version of `puppeteer` as a dev dependency and then you will be able to run your function code. Make sure you remove this from your `package.json` and `rm -rf node_nodules` before you run the deploy script, or else you will significantly increase the package size.