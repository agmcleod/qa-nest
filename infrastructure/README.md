# Creating Stacks

The commands used to create stacks have been stored in a **Makefile**. Each command requires the following arguments:

- `user`: Name of the AWS user profile to execute CloudFormation templates (i.e. the value of `--profile` when executing `aws cloudformation deploy` commands)
- `env`: Environment name; should be either **staging** or **production**

Example:

```
make container-registry user= env=
```
