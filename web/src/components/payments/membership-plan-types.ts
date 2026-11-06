export type BasicMembershipPlanId = 'basico' | 'premium' | 'vip';
export type VipMembershipPlanId = 'esencial' | 'pro' | 'elite' | 'allinclusive';
export type DigitalProductId =
  | 'libro-vip'
  | 'libro-basico'
  | 'curso-vip'
  | 'curso-basico';

export type MembershipPlanId = BasicMembershipPlanId | VipMembershipPlanId | DigitalProductId | 'cart';

// Compatibility aliases
export type TouristVisaPlanId = BasicMembershipPlanId;
export type StudentVisaPlanId = VipMembershipPlanId;
export type VisaPlanId = MembershipPlanId;

export function normalizeVipPlanParam(planParam: string): VipMembershipPlanId | null {
  const normalized = planParam.toLowerCase().replace(/-/g, '') as VipMembershipPlanId;
  const valid: VipMembershipPlanId[] = ['esencial', 'pro', 'elite', 'allinclusive'];
  return valid.includes(normalized) ? normalized : null;
}

export function normalizeBasicPlanParam(planParam: string): BasicMembershipPlanId | null {
  const normalized = planParam.toLowerCase().replace(/-/g, '') as BasicMembershipPlanId;
  const valid: BasicMembershipPlanId[] = ['basico', 'premium', 'vip'];
  return valid.includes(normalized) ? normalized : null;
}

// Compatibility functions
export const normalizeStudentPlanParam = normalizeVipPlanParam;
export const normalizeTouristPlanParam = normalizeBasicPlanParam;
