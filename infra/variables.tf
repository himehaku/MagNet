variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["development", "testing", "staging", "production"], var.environment)
    error_message = "environment must be development, testing, staging or production."
  }
}

variable "project_name" {
  description = "Application name."
  type        = string
  default     = "magnet"
}

variable "frontend_port" {
  description = "Frontend public port."
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "NestJS backend port."
  type        = number
  default     = 3000
}

variable "python_service_port" {
  description = "FastAPI service port."
  type        = number
  default     = 8000
}

variable "postgres_port" {
  description = "PostgreSQL port."
  type        = number
  default     = 5432
}