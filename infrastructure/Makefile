SHELL := /bin/bash

# `env` and `user` variables are required for each target

ifndef env
  ifneq ($(MAKECMDGOALS),help)
    $(error ************ Missing 'env' variable ************)
  endif
endif

ifndef user
  ifneq ($(MAKECMDGOALS),help)
    $(error ************ Missing 'user' variable ************)
  endif
endif


# Create The Container Registery
container-registry:
	aws cloudformation deploy \
		--stack-name $(env)-repo \
		--template-file templates/registry.yaml \
		--parameter-overrides RepositoryName=$(env)-qa-app-api \
		--profile $(user)

# Create The VPC
vpc:
	aws cloudformation deploy \
		--stack-name $(env)-vpc \
		--template-file templates/vpc.yaml \
		--parameter-overrides EnvironmentName=$(env) \
		--profile $(user)

# Create Security Groups
security-groups:
	aws cloudformation deploy \
		--stack-name $(env)-sg \
		--template-file templates/security-groups.yaml \
		--parameter-overrides EnvironmentName=$(env) \
			VpcStack=$(env)-vpc \
		--profile $(user)

# Store RDS credentials into SSM
rds-creds:
	aws ssm put-parameter --name "/$(env)/TYPEORM_PASSWORD" --type SecureString --value $(password) --profile $(user)

jwt-creds:
	aws ssm put-parameter --name "/$(env)/JWT_SIGN_KEY" --type SecureString --value $(key) --profile $(user)

# Create RDS Database
# A password will need to be stored in SSM prior to creating this stack
rds:
	aws cloudformation deploy \
		--stack-name $(env)-db \
		--template-file templates/db.yaml \
		--parameter-overrides \
			EnvironmentName=$(env) \
			VpcStack=$(env)-vpc \
			SgStack=$(env)-sg \
			DBInstanceIdentifer=$(env)-db \
			DBName=$(env)_db \
			DBUsername=qaapp_$(env) \
		--profile $(user)

# Upon creating the stack, use the dbstack.json to create a policy to prevent accidental updates to the stack, causing data loss:
rds-policy:
	aws cloudformation set-stack-policy \
		--stack-policy-body file://templates/dbstack.json \
		--stack-name $(env)-db \
		--profile $(user)

### Setup API SSL Cert (only run when you need to create & verify the SSL cert, and when DNS is setup).
# api-ssl:
# 	aws cloudformation deploy \
# 		--stack-name $(env)-certs \
# 		--template-file templates/certs.yaml \
# 		--parameter-overrides \
# 			EnvironmentName=$(env) \
# 			ApiDomainName=qa-app-api.$(domain) \
# 		--profile $(user)

# Create roles
roles:
	aws cloudformation deploy \
		--stack-name $(env)-roles \
		--template-file templates/roles.yaml \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameter-overrides \
			EnvironmentName=$(env) \
		--profile $(user)

# Create backend app
# This will create the ECS cluster with the AWS Fargate launch type. Be sure you have a Docker Image tagged with latest in the ECR before running this, otherwise it won't complete
backend:
	aws cloudformation deploy \
		--stack-name $(env)-api \
		--template-file templates/api-fargate.yaml \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameter-overrides \
			EcrStack=$(env)-repo \
			VpcStack=$(env)-vpc \
			SgStack=$(env)-sg \
			DbStack=$(env)-db \
			EnvironmentName=$(env) \
			RolesStack=$(env)-roles \
		--profile $(user)

db-tasks:
	aws cloudformation deploy \
		--stack-name $(env)-db-migrate \
		--template-file templates/db-tasks.yaml \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameter-overrides \
			EcrStack=$(env)-repo \
			EnvironmentName=$(env) \
			DbStack=$(env)-db \
			RolesStack=$(env)-roles \
		--profile $(user)
