// ─── Rights Holders ───

export interface RightsHolder {
  id: string;
  name: string;
  type: "publisher" | "label" | "independent" | "both";
  parent_company?: string;
  administrator?: string;
  administered_by_id?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  aliases?: string[];
  no_sample_policy: boolean;
  deceased: boolean;
  estate_contact?: string;
  contact_last_verified?: string;
  contact_verified_by?: string;
  avg_fee_master?: string;
  avg_fee_publishing?: string;
  avg_response_weeks?: string;
  notes?: string;
}

export interface Writer {
  name: string;
  pro?: string;
  pro_id?: string;
  deceased?: boolean;
  estate_contact?: string;
  approval_required?: boolean;
  approval_obtained?: boolean;
  approval_date?: string;
}

export interface SongOwnership {
  id: string;
  song_title: string;
  artist: string;
  publisher_id?: string;
  label_id?: string;
  writers?: Writer[];
  pro?: string;
  pro_id?: string;
  confidence_score: number;
  source?: string[];
  is_production_library: boolean;
  library_name?: string;
  flat_buyout_eligible: boolean;
}

// ─── Lookup Results ───

export interface OwnershipResult {
  holder: string;
  administrator?: string;
  type: "master" | "publishing";
  confidence: number;
  source: "internal" | "claude_inference";
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  writers?: Writer[];
  pro?: string;
  proId?: string;
  avgFee?: string;
  avgResponseWeeks?: string;
  noSamplePolicy?: boolean;
  deceased?: boolean;
  estateContact?: string;
  lastVerified?: string;
  isProductionLibrary?: boolean;
  libraryName?: string;
  writerApprovalRequired?: boolean;
}

export interface LookupResponse {
  master: OwnershipResult | null;
  publishing: OwnershipResult | null;
  interpolationRecommended: boolean;
  flatBuyoutEligible: boolean;
  relatedEntity?: {
    distributorName: string;
    holderName: string;
    sharedParent: string;
  };
  prominenceSignal?: {
    originalDuration: number;
    newDuration: number;
    prominence: number;
    signal: "high" | "moderate" | "low";
    description: string;
  };
}

// ─── Search Flow State ───

export interface SearchState {
  step: number;
  requestorName: string;
  requestorCompany: string;
  newSongTitle: string;
  sampledSongTitle: string;
  originalArtist: string;
  referenceUrl: string;
  originalTimingStart: string;
  originalTimingEnd: string;
  newTimingStart: string;
  newTimingEnd: string;
  sampleUseDescription: string;
  sampleUseTags: string[];
  intendedUse: string;
  releaseContext: string;
  distributorName: string;
  lookupResults: LookupResponse | null;
  lookupStatus: "idle" | "scanning" | "done" | "error";
  errorMessage?: string;
}

// ─── Pipeline ───

export const STEP_NAMES: Record<number, string> = {
  0: "Email Confirm",
  1: "Request Letter Sent",
  2: "Quote & Expiration Date",
  3: "Confirmation Letter Sent/Signed",
  4: "Check Request Sent",
  5: "Check Received",
  6: "Payment Letter Sent",
  7: "Credits Received",
  8: "Splits Confirmed",
  9: "Contract Sent",
};

export interface PipelineStep {
  stepNumber: number;
  stepName: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  writerApprovalRequired?: boolean;
  writerApprovalObtained?: boolean;
  writerApprovalDate?: string;
  notes?: string;
}

export interface PipelineSide {
  rightsType: "master" | "publishing";
  holder: string;
  administrator?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  steps: PipelineStep[];
  status:
    | "active"
    | "writer_unreachable"
    | "estate_required"
    | "reduction_requested"
    | "reduction_denied"
    | "interpolating"
    | "master_replayed"
    | "retracted"
    | "blocked"
    | "cleared";
}

export interface PipelineItem {
  id: string;
  projectId?: string;
  requestorName?: string;
  requestorCompany?: string;
  newSongTitle: string;
  sampledSongTitle: string;
  originalArtist: string;
  referenceUrl?: string;
  originalTimingStart?: string;
  originalTimingEnd?: string;
  newTimingStart?: string;
  newTimingEnd?: string;
  sampleUseDescription?: string;
  sampleUseTags?: string[];
  intendedUse: string;
  releaseContext?: string;
  distributorName?: string;
  quoteExpiration?: string;
  quoteAmount?: string;
  quoteTerms?: string;
  prominenceSignal?: string;
  master: PipelineSide;
  publishing: PipelineSide;
  letterDrafted: boolean;
  masterLetter?: string;
  publishingLetter?: string;
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  action: string;
  rightsType?: "master" | "publishing";
  stepNumber?: number;
  performedBy: string;
  performedAt: string;
  notes?: string;
}

export interface Project {
  id: string;
  artistName: string;
  projectTitle?: string;
  recordLabel?: string;
  distributor?: string;
  plannedReleaseDate?: string;
  status: "active" | "released" | "on_hold" | "cancelled";
  createdAt: string;
}

// ─── Combined Clearance Status ───

export type CombinedStatus =
  | "fully_cleared"
  | "master_cleared"
  | "publishing_cleared"
  | "in_progress"
  | "blocked"
  | "not_started";

export function getCombinedStatus(item: PipelineItem): CombinedStatus {
  const masterCleared = item.master.steps.every((s) => s.completed);
  const pubCleared = item.publishing.steps.every((s) => s.completed);
  const masterBlocked =
    item.master.status === "blocked" || item.master.status === "retracted";
  const pubBlocked =
    item.publishing.status === "blocked" ||
    item.publishing.status === "retracted";

  if (masterCleared && pubCleared) return "fully_cleared";
  if (masterBlocked || pubBlocked) return "blocked";
  if (masterCleared) return "master_cleared";
  if (pubCleared) return "publishing_cleared";

  const masterStarted = item.master.steps.some((s) => s.completed);
  const pubStarted = item.publishing.steps.some((s) => s.completed);
  if (masterStarted || pubStarted) return "in_progress";

  return "not_started";
}
