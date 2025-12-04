terraform {
  backend "s3" {
    bucket  = "patch-notes-tfstate-575108940418"
    key     = "patch-notes/infra/terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}
