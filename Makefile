.PHONY: help install dev build preview deploy clean check-deps check-aws check-config terraform-init terraform-plan terraform-apply terraform-destroy terraform-output

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Configuration - can be overridden by environment variables
S3_BUCKET ?= YOUR_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID ?= YOUR_DISTRIBUTION_ID
AWS_REGION ?= eu-west-2
TERRAFORM_DIR := infra/terraform

help: ## Show this help message
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(GREEN)[INFO]$(NC) Installing dependencies..."
	@npm install
	@echo "$(GREEN)[INFO]$(NC) Dependencies installed successfully."

dev: ## Start development server
	@npm run dev

build: ## Build the application
	@echo "$(GREEN)[INFO]$(NC) Building the application..."
	@npm run build
	@if [ ! -d "dist" ]; then \
		echo "$(RED)[ERROR]$(NC) Build failed. dist/ directory not found."; \
		exit 1; \
	fi
	@echo "$(GREEN)[INFO]$(NC) Build completed successfully."

preview: build ## Preview the production build locally
	@npm run preview

check-deps: ## Check if required tools are installed
	@echo "$(GREEN)[INFO]$(NC) Checking dependencies..."
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)[ERROR]$(NC) npm is not installed. Please install Node.js and npm."; exit 1; }
	@command -v aws >/dev/null 2>&1 || { echo "$(RED)[ERROR]$(NC) AWS CLI is not installed. Please install it first."; exit 1; }
	@echo "$(GREEN)[INFO]$(NC) All dependencies are installed."

check-aws: ## Check if AWS credentials are configured
	@echo "$(GREEN)[INFO]$(NC) Checking AWS credentials..."
	@aws sts get-caller-identity >/dev/null 2>&1 || { echo "$(RED)[ERROR]$(NC) AWS credentials are not configured. Run 'aws configure' first."; exit 1; }
	@echo "$(GREEN)[INFO]$(NC) AWS credentials are valid."

check-config: ## Check if S3 bucket and CloudFront distribution are configured
	@if [ "$(S3_BUCKET)" = "YOUR_BUCKET_NAME" ]; then \
		echo "$(RED)[ERROR]$(NC) S3_BUCKET is not configured."; \
		echo "$(GREEN)[INFO]$(NC) Set it with: export S3_BUCKET=your-bucket-name"; \
		echo "$(GREEN)[INFO]$(NC) Or run: make deploy S3_BUCKET=your-bucket-name"; \
		exit 1; \
	fi
	@if [ "$(CLOUDFRONT_DISTRIBUTION_ID)" = "YOUR_DISTRIBUTION_ID" ] || [ -z "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "$(YELLOW)[WARN]$(NC) CLOUDFRONT_DISTRIBUTION_ID is not configured. CloudFront cache will not be invalidated."; \
	fi

get-terraform-config: ## Get configuration from Terraform outputs
	@if [ -d "$(TERRAFORM_DIR)" ] && [ -f "$(TERRAFORM_DIR)/terraform.tfstate" ]; then \
		echo "$(GREEN)[INFO]$(NC) Found Terraform state. Reading outputs..."; \
		cd $(TERRAFORM_DIR) && \
		S3_BUCKET=$$(terraform output -raw s3_bucket_name 2>/dev/null || echo ""); \
		CLOUDFRONT_DISTRIBUTION_ID=$$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo ""); \
		if [ -n "$$S3_BUCKET" ]; then \
			echo "$(GREEN)[INFO]$(NC) Using S3 bucket from Terraform: $$S3_BUCKET"; \
			echo "S3_BUCKET=$$S3_BUCKET" > ../../.terraform-config; \
		fi; \
		if [ -n "$$CLOUDFRONT_DISTRIBUTION_ID" ]; then \
			echo "$(GREEN)[INFO]$(NC) Using CloudFront distribution from Terraform: $$CLOUDFRONT_DISTRIBUTION_ID"; \
			echo "CLOUDFRONT_DISTRIBUTION_ID=$$CLOUDFRONT_DISTRIBUTION_ID" >> ../../.terraform-config; \
		fi; \
	fi

sync-s3: build check-deps check-aws check-config ## Sync built files to S3
	@echo "$(GREEN)[INFO]$(NC) Syncing to S3 bucket: $(S3_BUCKET)..."
	@aws s3 sync dist/ s3://$(S3_BUCKET) \
		--delete \
		--region $(AWS_REGION) \
		--cache-control "public, max-age=31536000" \
		--exclude "index.html" \
		--exclude "*.map"
	@aws s3 cp dist/index.html s3://$(S3_BUCKET)/index.html \
		--region $(AWS_REGION) \
		--cache-control "no-cache, no-store, must-revalidate" \
		--metadata-directive REPLACE
	@echo "$(GREEN)[INFO]$(NC) Successfully synced to S3."

invalidate-cloudfront: ## Invalidate CloudFront cache
	@if [ "$(CLOUDFRONT_DISTRIBUTION_ID)" = "YOUR_DISTRIBUTION_ID" ] || [ -z "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "$(YELLOW)[WARN]$(NC) Skipping CloudFront invalidation (distribution ID not configured)."; \
	else \
		echo "$(GREEN)[INFO]$(NC) Creating CloudFront invalidation..."; \
		INVALIDATION_ID=$$(aws cloudfront create-invalidation \
			--distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) \
			--paths "/*" \
			--query 'Invalidation.Id' \
			--output text); \
		echo "$(GREEN)[INFO]$(NC) CloudFront invalidation created: $$INVALIDATION_ID"; \
		echo "$(GREEN)[INFO]$(NC) Note: It may take several minutes for the invalidation to complete."; \
	fi

deploy: ## Build and deploy to S3 with CloudFront invalidation
	@echo "$(GREEN)[INFO]$(NC) Starting deployment process..."
	@echo ""
	@$(MAKE) -s check-deps
	@$(MAKE) -s check-aws
	@if [ -f ".terraform-config" ]; then \
		echo "$(GREEN)[INFO]$(NC) Loading Terraform configuration..."; \
		export $$(cat .terraform-config | xargs); \
	fi
	@$(MAKE) -s check-config
	@echo ""
	@echo "$(GREEN)[INFO]$(NC) Configuration:"
	@echo "$(GREEN)[INFO]$(NC)   S3 Bucket: $(S3_BUCKET)"
	@echo "$(GREEN)[INFO]$(NC)   CloudFront Distribution: $(if $(filter YOUR_DISTRIBUTION_ID,$(CLOUDFRONT_DISTRIBUTION_ID)),not configured,$(CLOUDFRONT_DISTRIBUTION_ID))"
	@echo "$(GREEN)[INFO]$(NC)   AWS Region: $(AWS_REGION)"
	@echo ""
	@$(MAKE) -s sync-s3
	@$(MAKE) -s invalidate-cloudfront
	@echo ""
	@echo "$(GREEN)[INFO]$(NC) Deployment completed successfully! 🚀"
	@if [ -f "$(TERRAFORM_DIR)/terraform.tfstate" ]; then \
		cd $(TERRAFORM_DIR) && \
		ENDPOINT=$$(terraform output -raw s3_website_endpoint 2>/dev/null || echo ""); \
		CF_DOMAIN=$$(terraform output -raw cloudfront_domain_name 2>/dev/null || echo ""); \
		if [ -n "$$ENDPOINT" ]; then \
			echo "$(GREEN)[INFO]$(NC) Website URL: http://$$ENDPOINT"; \
		fi; \
		if [ -n "$$CF_DOMAIN" ]; then \
			echo "$(GREEN)[INFO]$(NC) CloudFront URL: https://$$CF_DOMAIN"; \
		fi; \
	fi

clean: ## Remove build artifacts
	@echo "$(GREEN)[INFO]$(NC) Cleaning build artifacts..."
	@rm -rf dist
	@rm -f .terraform-config
	@echo "$(GREEN)[INFO]$(NC) Clean completed."

# Terraform targets
terraform-init: ## Initialize Terraform
	@echo "$(GREEN)[INFO]$(NC) Initializing Terraform..."
	@cd $(TERRAFORM_DIR) && terraform init

terraform-plan: ## Run Terraform plan
	@echo "$(GREEN)[INFO]$(NC) Running Terraform plan..."
	@cd $(TERRAFORM_DIR) && terraform plan

terraform-apply: ## Apply Terraform configuration
	@echo "$(GREEN)[INFO]$(NC) Applying Terraform configuration..."
	@cd $(TERRAFORM_DIR) && terraform apply -auto-approve
	@$(MAKE) -s get-terraform-config

terraform-destroy: ## Destroy Terraform resources
	@echo "$(YELLOW)[WARN]$(NC) This will destroy all Terraform-managed resources!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd $(TERRAFORM_DIR) && terraform destroy; \
	fi

terraform-output: ## Show Terraform outputs
	@cd $(TERRAFORM_DIR) && terraform output

# Quick deploy with Terraform config
deploy-auto: terraform-apply ## Deploy infrastructure and application automatically
	@$(MAKE) -s get-terraform-config
	@if [ -f ".terraform-config" ]; then \
		source .terraform-config && $(MAKE) deploy S3_BUCKET=$$S3_BUCKET CLOUDFRONT_DISTRIBUTION_ID=$$CLOUDFRONT_DISTRIBUTION_ID; \
	else \
		$(MAKE) deploy; \
	fi
