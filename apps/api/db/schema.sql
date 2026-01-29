-- Synapse Database Schema
-- PostgreSQL with pgvector extension for future semantic search

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- ORGANIZATIONS & CLIENTS
-- ============================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('broker', 'tpa', 'employer')),
    
    -- Contact
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state CHAR(2),
    zip_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Billing
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    employees_managed INTEGER DEFAULT 0,
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Business Info
    name VARCHAR(255) NOT NULL,
    ein VARCHAR(20) NOT NULL,
    business_type VARCHAR(50),
    
    -- Contact
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state CHAR(2),
    zip_code VARCHAR(10),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- ACA Profile
    ale_status BOOLEAN DEFAULT false,
    employee_count INTEGER DEFAULT 0,
    fte_count INTEGER DEFAULT 0,
    control_group_id UUID,
    
    -- Data Source
    data_source_type VARCHAR(50),
    data_source_provider VARCHAR(100),
    data_source_connection_id VARCHAR(255),
    data_source_credentials JSONB,
    last_sync_at TIMESTAMPTZ,
    sync_status VARCHAR(50) DEFAULT 'pending_setup',
    data_quality_score INTEGER DEFAULT 0,
    
    -- Compliance
    overall_compliance_score INTEGER DEFAULT 0,
    open_risks INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_organization ON clients(organization_id);
CREATE INDEX idx_clients_ein ON clients(ein);

-- ============================================
-- EMPLOYEES
-- ============================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Demographics (encrypted sensitive fields)
    ssn_encrypted BYTEA, -- Encrypted SSN
    ssn_last_four VARCHAR(4),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(20),
    date_of_birth DATE,
    
    -- Contact
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state CHAR(2),
    zip_code VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Employment
    employee_id VARCHAR(100),
    hire_date DATE NOT NULL,
    termination_date DATE,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'active',
    employment_type VARCHAR(50) NOT NULL DEFAULT 'full_time',
    job_title VARCHAR(255),
    department VARCHAR(255),
    
    -- Compensation
    annual_salary DECIMAL(12,2),
    hourly_rate DECIMAL(8,2),
    pay_frequency VARCHAR(50),
    
    -- Metadata
    source_system VARCHAR(100),
    raw_data JSONB,
    data_quality_score INTEGER DEFAULT 0,
    confidence_level VARCHAR(20) DEFAULT 'medium',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Future: Vector embedding for semantic search
    embedding vector(1536)
);

CREATE INDEX idx_employees_client ON employees(client_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_employees_type ON employees(employment_type);
CREATE INDEX idx_employees_ssn_last_four ON employees(ssn_last_four);

-- ============================================
-- HOURS TRACKING (for ACA FTE calculations)
-- ============================================

CREATE TABLE monthly_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    hours_worked DECIMAL(6,2) DEFAULT 0,
    hours_of_service DECIMAL(6,2) DEFAULT 0,
    is_paid_leave BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(employee_id, year, month)
);

CREATE INDEX idx_monthly_hours_employee ON monthly_hours(employee_id);
CREATE INDEX idx_monthly_hours_period ON monthly_hours(year, month);

-- ============================================
-- COVERAGE OFFERS
-- ============================================

CREATE TABLE coverage_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    
    was_offered BOOLEAN DEFAULT false,
    offer_code VARCHAR(10),
    coverage_type VARCHAR(50),
    
    employee_share_of_cost DECIMAL(8,2),
    lowest_cost_plan_premium DECIMAL(8,2),
    affordability_percentage DECIMAL(5,2),
    
    was_enrolled BOOLEAN DEFAULT false,
    enrollment_date DATE,
    
    safe_harbor_code VARCHAR(10),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(employee_id, year, month)
);

CREATE INDEX idx_coverage_offers_employee ON coverage_offers(employee_id);
CREATE INDEX idx_coverage_offers_period ON coverage_offers(year, month);

-- ============================================
-- ENROLLMENTS
-- ============================================

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    coverage_offer_id UUID REFERENCES coverage_offers(id),
    
    plan_id VARCHAR(100),
    plan_name VARCHAR(255),
    carrier_name VARCHAR(255),
    plan_type VARCHAR(50),
    
    coverage_tier VARCHAR(50),
    effective_date DATE NOT NULL,
    termination_date DATE,
    
    covered_dependents JSONB DEFAULT '[]',
    
    total_premium DECIMAL(8,2),
    employee_contribution DECIMAL(8,2),
    employer_contribution DECIMAL(8,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_employee ON enrollments(employee_id);
CREATE INDEX idx_enrollments_dates ON enrollments(effective_date, termination_date);

-- ============================================
-- COMPLIANCE STATUS
-- ============================================

CREATE TABLE compliance_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    
    aca_status VARCHAR(50) NOT NULL DEFAULT 'pending_review',
    is_full_time BOOLEAN DEFAULT false,
    fte_calculation JSONB,
    
    is_affordable BOOLEAN,
    affordability_method VARCHAR(50),
    affordability_calculation JSONB,
    
    penalty_risks JSONB DEFAULT '[]',
    
    line_14_code VARCHAR(10),
    line_15_premium DECIMAL(8,2),
    line_16_code VARCHAR(10),
    
    determination_confidence INTEGER DEFAULT 0,
    ai_reasoning_notes TEXT[],
    irs_code_citations TEXT[],
    requires_human_review BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(employee_id, year, month)
);

CREATE INDEX idx_compliance_status_employee ON compliance_status(employee_id);
CREATE INDEX idx_compliance_status_client ON compliance_status(client_id);
CREATE INDEX idx_compliance_status_period ON compliance_status(year, month);
CREATE INDEX idx_compliance_status_aca ON compliance_status(aca_status);
CREATE INDEX idx_compliance_status_review ON compliance_status(requires_human_review);

-- ============================================
-- DATA PIPELINE RUNS
-- ============================================

CREATE TABLE pipeline_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    stages JSONB DEFAULT '[]',
    
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    records_flagged INTEGER DEFAULT 0,
    
    errors JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pipeline_runs_client ON pipeline_runs(client_id);
CREATE INDEX idx_pipeline_runs_status ON pipeline_runs(status);

-- ============================================
-- IRS FORMS
-- ============================================

CREATE TABLE forms_1094c (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL,
    
    employer_name VARCHAR(255),
    ein VARCHAR(20),
    address JSONB,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    
    total_employee_count INTEGER,
    full_time_employee_count INTEGER,
    total_form_1095c_count INTEGER,
    
    monthly_data JSONB DEFAULT '[]',
    is_authoritative_transmittal BOOLEAN DEFAULT true,
    
    status VARCHAR(50) DEFAULT 'draft',
    generated_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(client_id, tax_year)
);

CREATE TABLE forms_1095c (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL,
    
    employee_name VARCHAR(255),
    employee_ssn_encrypted BYTEA,
    employee_address JSONB,
    
    employer_name VARCHAR(255),
    employer_ein VARCHAR(20),
    employer_address JSONB,
    employer_contact_phone VARCHAR(20),
    
    monthly_data JSONB DEFAULT '[]',
    covered_individuals JSONB DEFAULT '[]',
    
    status VARCHAR(50) DEFAULT 'draft',
    generated_at TIMESTAMPTZ,
    mailed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(employee_id, tax_year)
);

CREATE INDEX idx_forms_1094c_client ON forms_1094c(client_id);
CREATE INDEX idx_forms_1095c_client ON forms_1095c(client_id);
CREATE INDEX idx_forms_1095c_employee ON forms_1095c(employee_id);

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    
    details JSONB,
    ip_address INET,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coverage_offers_updated_at BEFORE UPDATE ON coverage_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_status_updated_at BEFORE UPDATE ON compliance_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_1094c_updated_at BEFORE UPDATE ON forms_1094c FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_1095c_updated_at BEFORE UPDATE ON forms_1095c FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
