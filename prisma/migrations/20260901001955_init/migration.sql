-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'COMPANY_ADMIN', 'LEADER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Methodology" AS ENUM ('M10', 'M20', 'M70');

-- CreateEnum
CREATE TYPE "DevelopmentType" AS ENUM ('CURRENT', 'FUTURE', 'BOTH');

-- CreateEnum
CREATE TYPE "ObjectiveType" AS ENUM ('CURRENT_ROLE', 'FUTURE_ROLE');

-- CreateEnum
CREATE TYPE "Horizon" AS ENUM ('LT_12M', 'M12_24', 'GT_24M');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'FINALIZED', 'DOWNLOADED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RatingLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Aspiration" AS ENUM ('GROW_LEADERSHIP', 'GROW_SPECIALIST', 'LATERAL_MOVE', 'CONSOLIDATE', 'UNDEFINED');

-- CreateEnum
CREATE TYPE "DiagnosticSource" AS ENUM ('EXISTING', 'MANUAL');

-- CreateEnum
CREATE TYPE "ResponsibleType" AS ENUM ('EMPLOYEE', 'LEADER', 'MENTOR', 'HR', 'OTHER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CompetencyCategory" AS ENUM ('LEADERSHIP', 'BUSINESS', 'INTERPERSONAL', 'STRATEGIC', 'EXECUTION');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#1F5F5B',
    "pdfCoverNote" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maxUsers" INTEGER NOT NULL DEFAULT 25,
    "commercialPlan" TEXT NOT NULL DEFAULT 'STARTER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySetting" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT,
    "employeeId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "resetTokenHash" TEXT,
    "resetTokenExp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT,
    "level" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "area" TEXT,
    "positionId" TEXT,
    "positionTitle" TEXT,
    "managerName" TEXT,
    "leaderUserId" TEXT,
    "location" TEXT,
    "hiredAt" TIMESTAMP(3),
    "hierarchyLevel" INTEGER,
    "businessUnit" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competency" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "expectedBehavior" TEXT NOT NULL,
    "category" "CompetencyCategory" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyLevel" (
    "id" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CompetencyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentTool" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "methodology" "Methodology" NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'sparkles',
    "isCore" BOOLEAN NOT NULL DEFAULT true,
    "developmentType" "DevelopmentType" NOT NULL DEFAULT 'BOTH',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "methodology" "Methodology" NOT NULL,
    "toolId" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "developmentType" "DevelopmentType" NOT NULL DEFAULT 'BOTH',
    "duration" TEXT NOT NULL,
    "suggestedIndicator" TEXT,
    "suggestedEvidence" TEXT,
    "suggestedResponsible" "ResponsibleType" NOT NULL DEFAULT 'EMPLOYEE',
    "minPerformance" "RatingLevel",
    "minPotential" "RatingLevel",
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityCompetency" (
    "activityId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "ActivityCompetency_pkey" PRIMARY KEY ("activityId","competencyId")
);

-- CreateTable
CREATE TABLE "PerformanceEvaluation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "rating" "RatingLevel" NOT NULL,
    "score" DOUBLE PRECISION,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialEvaluation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "rating" "RatingLevel" NOT NULL,
    "score" DOUBLE PRECISION,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PotentialEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "planId" TEXT,
    "source" "DiagnosticSource" NOT NULL DEFAULT 'MANUAL',
    "performance" "RatingLevel" NOT NULL,
    "potential" "RatingLevel" NOT NULL,
    "aspiration" "Aspiration" NOT NULL DEFAULT 'UNDEFINED',
    "aspirationNote" TEXT,
    "nineBox" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentPlan" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "objectiveType" "ObjectiveType",
    "objectiveStatement" TEXT,
    "targetPositionId" TEXT,
    "targetPositionTitle" TEXT,
    "targetPositionArea" TEXT,
    "horizon" "Horizon",
    "planDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wizardStep" INTEGER NOT NULL DEFAULT 1,
    "completion" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentPlanId" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanCompetency" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "currentLevel" INTEGER NOT NULL DEFAULT 2,
    "requiredLevel" INTEGER NOT NULL DEFAULT 4,
    "objective" TEXT,

    CONSTRAINT "PlanCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanActivity" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planCompetencyId" TEXT NOT NULL,
    "activityId" TEXT,
    "toolId" TEXT,
    "methodology" "Methodology" NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT,
    "responsibleType" "ResponsibleType" NOT NULL DEFAULT 'EMPLOYEE',
    "responsibleName" TEXT,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "frequency" TEXT,
    "successIndicator" TEXT,
    "expectedEvidence" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LEADER',
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfExport" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "pages" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_active_idx" ON "Company"("active");

-- CreateIndex
CREATE INDEX "CompanySetting_key_idx" ON "CompanySetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CompanySetting_companyId_key_key" ON "CompanySetting"("companyId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_companyId_role_idx" ON "User"("companyId", "role");

-- CreateIndex
CREATE INDEX "Position_companyId_idx" ON "Position"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_companyId_title_key" ON "Position"("companyId", "title");

-- CreateIndex
CREATE INDEX "Employee_companyId_active_idx" ON "Employee"("companyId", "active");

-- CreateIndex
CREATE INDEX "Employee_leaderUserId_idx" ON "Employee"("leaderUserId");

-- CreateIndex
CREATE INDEX "Competency_active_category_idx" ON "Competency"("active", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Competency_companyId_name_key" ON "Competency"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyLevel_competencyId_level_key" ON "CompetencyLevel"("competencyId", "level");

-- CreateIndex
CREATE INDEX "DevelopmentTool_active_methodology_idx" ON "DevelopmentTool"("active", "methodology");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentTool_companyId_slug_key" ON "DevelopmentTool"("companyId", "slug");

-- CreateIndex
CREATE INDEX "Activity_active_methodology_idx" ON "Activity"("active", "methodology");

-- CreateIndex
CREATE INDEX "Activity_companyId_idx" ON "Activity"("companyId");

-- CreateIndex
CREATE INDEX "ActivityCompetency_competencyId_idx" ON "ActivityCompetency"("competencyId");

-- CreateIndex
CREATE INDEX "PerformanceEvaluation_employeeId_period_idx" ON "PerformanceEvaluation"("employeeId", "period");

-- CreateIndex
CREATE INDEX "PotentialEvaluation_employeeId_period_idx" ON "PotentialEvaluation"("employeeId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnostic_planId_key" ON "Diagnostic"("planId");

-- CreateIndex
CREATE INDEX "Diagnostic_companyId_employeeId_idx" ON "Diagnostic"("companyId", "employeeId");

-- CreateIndex
CREATE INDEX "DevelopmentPlan_companyId_status_idx" ON "DevelopmentPlan"("companyId", "status");

-- CreateIndex
CREATE INDEX "DevelopmentPlan_employeeId_idx" ON "DevelopmentPlan"("employeeId");

-- CreateIndex
CREATE INDEX "DevelopmentPlan_authorUserId_idx" ON "DevelopmentPlan"("authorUserId");

-- CreateIndex
CREATE INDEX "PlanCompetency_planId_idx" ON "PlanCompetency"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCompetency_planId_competencyId_key" ON "PlanCompetency"("planId", "competencyId");

-- CreateIndex
CREATE INDEX "PlanActivity_planId_methodology_idx" ON "PlanActivity"("planId", "methodology");

-- CreateIndex
CREATE INDEX "PlanActivity_planCompetencyId_idx" ON "PlanActivity"("planCompetencyId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_code_key" ON "AccessCode"("code");

-- CreateIndex
CREATE INDEX "AccessCode_companyId_active_idx" ON "AccessCode"("companyId", "active");

-- CreateIndex
CREATE INDEX "PdfExport_planId_idx" ON "PdfExport"("planId");

-- CreateIndex
CREATE INDEX "PdfExport_companyId_createdAt_idx" ON "PdfExport"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_companyId_createdAt_idx" ON "AuditLog"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "CompanySetting" ADD CONSTRAINT "CompanySetting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyLevel" ADD CONSTRAINT "CompetencyLevel_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentTool" ADD CONSTRAINT "DevelopmentTool_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "DevelopmentTool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityCompetency" ADD CONSTRAINT "ActivityCompetency_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityCompetency" ADD CONSTRAINT "ActivityCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceEvaluation" ADD CONSTRAINT "PerformanceEvaluation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceEvaluation" ADD CONSTRAINT "PerformanceEvaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotentialEvaluation" ADD CONSTRAINT "PotentialEvaluation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotentialEvaluation" ADD CONSTRAINT "PotentialEvaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_planId_fkey" FOREIGN KEY ("planId") REFERENCES "DevelopmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_targetPositionId_fkey" FOREIGN KEY ("targetPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentPlan" ADD CONSTRAINT "DevelopmentPlan_parentPlanId_fkey" FOREIGN KEY ("parentPlanId") REFERENCES "DevelopmentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCompetency" ADD CONSTRAINT "PlanCompetency_planId_fkey" FOREIGN KEY ("planId") REFERENCES "DevelopmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCompetency" ADD CONSTRAINT "PlanCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanActivity" ADD CONSTRAINT "PlanActivity_planId_fkey" FOREIGN KEY ("planId") REFERENCES "DevelopmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanActivity" ADD CONSTRAINT "PlanActivity_planCompetencyId_fkey" FOREIGN KEY ("planCompetencyId") REFERENCES "PlanCompetency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanActivity" ADD CONSTRAINT "PlanActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanActivity" ADD CONSTRAINT "PlanActivity_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "DevelopmentTool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfExport" ADD CONSTRAINT "PdfExport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfExport" ADD CONSTRAINT "PdfExport_planId_fkey" FOREIGN KEY ("planId") REFERENCES "DevelopmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdfExport" ADD CONSTRAINT "PdfExport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
