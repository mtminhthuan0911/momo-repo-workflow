import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

// Dùng service role key để bypass RLS — chỉ dùng phía server (API routes)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ─── Types mapping với Supabase schema ───────────────────────────────────────

export type DocType = 'PRD' | 'BUG' | 'CHANGE' | 'DESIGN' | 'RESEARCH' | 'AUDIT';
export type StatusType = 'pending' | 'in_progress' | 'done' | 'rejected';

export interface FeatureRequest {
  id: string;
  project: string;
  slack_ts: string;
  channel: string;
  doc_type: DocType;
  request_name: string;
  content: string;
  summary: string;
  status: StatusType;
  demo_url: string | null;
  created_at: string;
}

export interface FeatureFeedback {
  id: string;
  request_id: string;
  all_passed: boolean;
  checklist: ChecklistResult;
  recommendation: string;
  tag_target: string; // '@Bảo' hoặc '@Thuận Minh'
  created_at: string;
}

export interface FeatureStatus {
  id: string;
  request_id: string;
  status: StatusType;
  updated_by: string; // 'Claude Bot' | 'TechLead' | 'Bảo'
  demo_url: string | null;
  created_at: string;
}

// 7 tiêu chí checklist review
export interface ChecklistResult {
  has_goal: boolean;          // Có mục tiêu rõ ràng không?
  has_user_story: boolean;    // Có user story không?
  has_acceptance_criteria: boolean; // Có tiêu chí chấp nhận không?
  has_scope: boolean;         // Có scope/boundary rõ ràng không?
  has_timeline: boolean;      // Có timeline/deadline không?
  has_design: boolean;        // Có design/mockup không?
  has_technical_note: boolean; // Có ghi chú kỹ thuật không?
}
