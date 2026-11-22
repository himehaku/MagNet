locals {
  service_names = {
    frontend       = "${var.project_name}-frontend"
    backend        = "${var.project_name}-backend"
    python_service = "${var.project_name}-python-service"
    database       = "${var.project_name}-postgres"
  }

  ports = {
    frontend       = var.frontend_port
    backend        = var.backend_port
    python_service = var.python_service_port
    database       = var.postgres_port
  }
}

resource "terraform_data" "staging_environment" {
  input = {
    project     = var.project_name
    environment = var.environment
    services    = local.service_names
    ports       = local.ports
  }

  lifecycle {
    precondition {
      condition     = var.environment == "staging"
      error_message = "This Terraform configuration is currently intended for the staging environment."
    }
  }
}