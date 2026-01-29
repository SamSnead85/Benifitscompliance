/**
 * Synapse Canonical Data Model
 * The single source of truth for all employee and benefits data
 */

// ============================================
// CORE EMPLOYEE MODEL
// ============================================

export interface Employee {
  id: string;
  organizationId: string;
  clientId: string;
  
  // Demographics
  ssn: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: string; // ISO 8601
  
  // Contact
  address: Address;
  email?: string;
  phone?: string;
  
  // Employment
  employeeId: string;
  hireDate: string; // ISO 8601
  terminationDate?: string; // ISO 8601
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  jobTitle?: string;
  department?: string;
  
  // Compensation
  annualSalary?: number;
  hourlyRate?: number;
  payFrequency: PayFrequency;
  
  // Hours Tracking (for ACA)
  hoursWorked: MonthlyHours[];
  
  // Metadata
  sourceSystem: string;
  rawData?: Record<string, unknown>;
  dataQualityScore: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  lastSyncedAt: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string; // 2-letter code
  zipCode: string;
  country: string;
}

export type EmploymentStatus = 
  | 'active'
  | 'terminated'
  | 'on_leave'
  | 'retired';

export type EmploymentType = 
  | 'full_time'
  | 'part_time'
  | 'variable_hour'
  | 'seasonal';

export type PayFrequency = 
  | 'weekly'
  | 'bi_weekly'
  | 'semi_monthly'
  | 'monthly';

export interface MonthlyHours {
  year: number;
  month: number; // 1-12
  hoursWorked: number;
  hoursOfService: number;
  isPaidLeave: boolean;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

// ============================================
// COVERAGE OFFER MODEL
// ============================================

export interface CoverageOffer {
  id: string;
  employeeId: string;
  clientId: string;
  
  // Coverage Period
  year: number;
  month: number; // 1-12
  
  // Offer Details
  wasOffered: boolean;
  offerCode: OfferCode;
  coverageType: CoverageType;
  
  // Affordability
  employeeShareOfCost: number; // Monthly premium
  lowestCostPlanPremium: number;
  affordabilityPercentage: number;
  
  // Enrollment
  wasEnrolled: boolean;
  enrollmentDate?: string;
  
  // Safe Harbor
  safeHarborCode?: SafeHarborCode;
  
  createdAt: string;
  updatedAt: string;
}

export type OfferCode = 
  | '1A' // Minimum essential coverage to employee only
  | '1B' // MEC to employee and spouse
  | '1C' // MEC to employee and dependents
  | '1D' // MEC to spouse (not to employee)
  | '1E' // MEC to employee, spouse, and dependents
  | '1F' // MEC to employee only and spouse and dependents
  | '1G' // Not a full-time employee
  | '1H' // No offer of coverage
  | '1I' // Reserved
  | '1J' // MEC with minimum value to employee and conditionally to spouse/deps
  | '1K'; // MEC with minimum value that changes during year

export type CoverageType = 
  | 'minimum_essential'
  | 'minimum_value'
  | 'affordable_minimum_value';

export type SafeHarborCode =
  | '2A' // Not employed during month
  | '2B' // Not full-time during month
  | '2C' // Enrolled in coverage
  | '2D' // In limited non-assessment period
  | '2E' // Multi-employer interim rule relief
  | '2F' // W-2 safe harbor
  | '2G' // FPL safe harbor
  | '2H' // Rate of pay safe harbor
  | '2I'; // Non-calendar year transition relief

// ============================================
// ENROLLMENT MODEL
// ============================================

export interface Enrollment {
  id: string;
  employeeId: string;
  coverageOfferId: string;
  
  // Plan Details
  planId: string;
  planName: string;
  carrierName: string;
  planType: PlanType;
  
  // Coverage
  coverageTier: CoverageTier;
  effectiveDate: string;
  terminationDate?: string;
  
  // Dependents
  coveredDependents: Dependent[];
  
  // Premiums
  totalPremium: number;
  employeeContribution: number;
  employerContribution: number;
  
  createdAt: string;
  updatedAt: string;
}

export type PlanType = 
  | 'hmo'
  | 'ppo'
  | 'epo'
  | 'pos'
  | 'hdhp';

export type CoverageTier = 
  | 'employee_only'
  | 'employee_spouse'
  | 'employee_children'
  | 'family';

export interface Dependent {
  id: string;
  relationship: DependentRelationship;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn?: string;
}

export type DependentRelationship = 
  | 'spouse'
  | 'child'
  | 'domestic_partner';

// ============================================
// COMPLIANCE STATUS MODEL
// ============================================

export interface ComplianceStatus {
  id: string;
  employeeId: string;
  clientId: string;
  
  // Period
  year: number;
  month: number;
  
  // ACA Determination
  acaStatus: ACAStatus;
  isFullTime: boolean;
  fteCalculation: FTECalculation;
  
  // Affordability
  isAffordable: boolean;
  affordabilityMethod: AffordabilityMethod;
  affordabilityCalculation: AffordabilityCalculation;
  
  // Penalty Risk
  penaltyRisk: PenaltyRisk[];
  
  // Form Codes
  line14Code: OfferCode;
  line15Premium?: number;
  line16Code?: SafeHarborCode;
  
  // AI Metadata
  determinationConfidence: number; // 0-100
  aiReasoningNotes: string[];
  irsCodeCitations: string[];
  requiresHumanReview: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export type ACAStatus = 
  | 'compliant'
  | 'at_risk'
  | 'non_compliant'
  | 'pending_review';

export interface FTECalculation {
  averageHoursPerWeek: number;
  measurementMethod: 'monthly' | 'look_back';
  measurementPeriodMonths: number;
  stabilityPeriodMonths: number;
  isLimitedNonAssessment: boolean;
}

export type AffordabilityMethod = 
  | 'w2_wages'
  | 'rate_of_pay'
  | 'federal_poverty_line';

export interface AffordabilityCalculation {
  method: AffordabilityMethod;
  employeeIncome: number;
  requiredContributionLimit: number; // 9.12% of income for 2024
  actualContribution: number;
  percentageOfIncome: number;
  isAffordable: boolean;
}

export interface PenaltyRisk {
  code: PenaltyCode;
  severity: 'low' | 'medium' | 'high';
  description: string;
  potentialPenalty: number;
  irsReference: string;
  remediation: string;
}

export type PenaltyCode = 
  | '4980H_A' // Employer shared responsibility - no offer
  | '4980H_B'; // Employer shared responsibility - unaffordable

// ============================================
// ORGANIZATION MODELS
// ============================================

export interface Organization {
  id: string;
  name: string;
  type: 'broker' | 'tpa' | 'employer';
  
  // Contact
  address: Address;
  phone: string;
  email: string;
  website?: string;
  
  // Billing
  subscriptionTier: SubscriptionTier;
  employeesManaged: number;
  monthlyFee: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 
  | 'starter'    // Up to 500 employees
  | 'growth'     // Up to 2,500 employees
  | 'enterprise' // Unlimited
  | 'custom';

export interface Client {
  id: string;
  organizationId: string;
  
  // Business Info
  name: string;
  ein: string; // Employer Identification Number
  businessType: BusinessType;
  
  // Contact
  address: Address;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // ACA Profile
  aleStatus: boolean; // Applicable Large Employer
  employeeCount: number;
  fteCount: number;
  controlGroupId?: string;
  
  // Data Source
  dataSource: DataSource;
  lastSyncAt?: string;
  syncStatus: SyncStatus;
  dataQualityScore: number;
  
  // Compliance
  overallComplianceScore: number;
  openRisks: number;
  
  createdAt: string;
  updatedAt: string;
}

export type BusinessType = 
  | 'corporation'
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship'
  | 'non_profit';

export interface DataSource {
  type: DataSourceType;
  provider?: string;
  connectionId?: string;
  credentials?: DataSourceCredentials;
  lastFileUpload?: string;
}

export type DataSourceType = 
  | 'api_gusto'
  | 'api_rippling'
  | 'api_adp'
  | 'api_paychex'
  | 'sftp'
  | 'manual_upload';

export interface DataSourceCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  sftpHost?: string;
  sftpUsername?: string;
  sftpPath?: string;
}

export type SyncStatus = 
  | 'connected'
  | 'syncing'
  | 'error'
  | 'disconnected'
  | 'pending_setup';

// ============================================
// DATA PIPELINE MODELS
// ============================================

export interface DataPipelineRun {
  id: string;
  clientId: string;
  
  // Pipeline Status
  status: PipelineStatus;
  startedAt: string;
  completedAt?: string;
  
  // Stage Progress
  stages: PipelineStage[];
  
  // Results
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  recordsFlagged: number;
  
  // Errors
  errors: PipelineError[];
  
  createdAt: string;
}

export type PipelineStatus = 
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'partial';

export interface PipelineStage {
  name: 'connector' | 'normalizer' | 'compliance' | 'reporter';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  recordsIn: number;
  recordsOut: number;
  transformations: DataTransformation[];
}

export interface DataTransformation {
  field: string;
  sourceValue: string;
  normalizedValue: string;
  transformationType: 'mapping' | 'validation' | 'enrichment' | 'inference';
  confidence: number;
}

export interface PipelineError {
  recordId?: string;
  stage: string;
  errorCode: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: string;
}

// ============================================
// FORM GENERATION MODELS
// ============================================

export interface Form1094C {
  id: string;
  clientId: string;
  taxYear: number;
  
  // Part I - ALE Member Information
  employerName: string;
  ein: string;
  address: Address;
  contactName: string;
  contactPhone: string;
  
  // Part II - ALE Member Information
  totalEmployeeCount: number;
  fullTimeEmployeeCount: number;
  totalForm1095CCount: number;
  
  // Part III - Monthly Information
  monthlyData: Form1094CMonthly[];
  
  // Authoritative Transmittal
  isAuthoritativeTransmittal: boolean;
  
  // Form Status
  status: FormStatus;
  generatedAt: string;
  submittedAt?: string;
}

export interface Form1094CMonthly {
  month: number;
  minimumEssentialCoverageOffered: boolean;
  fullTimeEmployeeCount: number;
  totalEmployeeCount: number;
  aggregatedGroupIndicator: boolean;
  section4980HTransitionReliefIndicator?: string;
}

export interface Form1095C {
  id: string;
  clientId: string;
  employeeId: string;
  taxYear: number;
  
  // Part I - Employee Information
  employeeName: string;
  employeeSSN: string;
  employeeAddress: Address;
  
  // Part II - Employer Information
  employerName: string;
  employerEIN: string;
  employerAddress: Address;
  employerContactPhone: string;
  
  // Part III - Employee Offer and Coverage
  monthlyData: Form1095CMonthly[];
  
  // Self-Insured Coverage (Part III if applicable)
  coveredIndividuals?: CoveredIndividual[];
  
  // Form Status
  status: FormStatus;
  generatedAt: string;
  mailedAt?: string;
}

export interface Form1095CMonthly {
  month: number;
  line14Code: OfferCode;
  line15EmployeeShare?: number; // Monthly premium
  line16Code?: SafeHarborCode;
}

export interface CoveredIndividual {
  name: string;
  ssn: string;
  dateOfBirth: string;
  coveredMonths: number[]; // Array of months 1-12
}

export type FormStatus = 
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'submitted'
  | 'accepted'
  | 'rejected';
