This is a collection of projects meant to be used as the basis for new lambda functions.

Example use:

```sh
cp -r _starter_node my_cool_node_lambda_function
cd my_cool_node_lambda_function
code .

# ... writing code ...

./zip_it.sh
# Upload out/lambda.zip to your lambda dashboard
```

NOTE: you can ignore the `default.nix` if you don't use nix package manager
