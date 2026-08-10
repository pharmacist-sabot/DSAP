import type { AssessmentState, Dimension, HospitalInfo, Standard } from '@/types/models';

export const dimensionMeta: Record<
  Dimension,
  {
    label: string;
    shortLabel: string;
    description: string;
  }
> = {
  // biome-ignore lint/style/useNamingConvention: property name must match the Dimension type value
  Management: {
    label: 'ด้านการบริหาร',
    shortLabel: 'Management',
    description: 'นโยบาย โครงสร้างพื้นฐาน ข้อมูล และการพัฒนาศักยภาพบุคลากร',
  },
  // biome-ignore lint/style/useNamingConvention: property name must match the Dimension type value
  Service: {
    label: 'ด้านการบริการและบริบาล',
    shortLabel: 'Service',
    description: 'กระบวนการดูแลผู้ป่วย การสั่งใช้ จ่าย และติดตามความปลอดภัยด้านยา',
  },
  // biome-ignore lint/style/useNamingConvention: property name must match the Dimension type value
  System: {
    label: 'ด้านการจัดการระบบยา',
    shortLabel: 'System',
    description: 'ระบบสนับสนุนที่ทำให้การประเมินเกิดขึ้นต่อเนื่องและตรวจสอบได้',
  },
  // biome-ignore lint/style/useNamingConvention: property name must match the Dimension type value
  SupplyChain: {
    label: 'ด้านการบริหารยาและเวชภัณฑ์',
    shortLabel: 'Supply Chain',
    description: 'การคัดเลือก จัดหา เก็บรักษา และกระจายยาอย่างปลอดภัย',
  },
};

export const regionOptions = [
  'ส่วนกลาง',
  'ภาคเหนือ',
  'ภาคตะวันออกเฉียงเหนือ',
  'ภาคกลาง',
  'ภาคตะวันออก',
  'ภาคตะวันตก',
  'ภาคใต้',
] as const;

export const hospitalSizeOptions = ['A', 'S', 'M1', 'M2', 'F1', 'F2', 'F3'] as const;

export function createInitialHospitalInfo(): HospitalInfo {
  return {
    name: '',
    region: '',
    province: '',
    district: '',
    bedCount: 0,
    hospitalSize: '',
    staff: {
      pharmacists: 0,
      assistants: 0,
      others: 0,
    },
    stats: {
      opdVisits: 0,
      opdPrescriptions: 0,
      ipdAdmissions: 0,
      ipdPatientDays: 0,
    },
  };
}

export function cloneHospitalInfo(info: HospitalInfo): HospitalInfo {
  return {
    ...info,
    staff: { ...info.staff },
    stats: { ...info.stats },
  };
}

export function createInitialAssessmentState(): AssessmentState {
  return {
    id: crypto.randomUUID(),
    lastUpdated: new Date().toISOString(),
    isComplete: false,
    hospitalInfo: createInitialHospitalInfo(),
    progress: {},
  };
}

export function getTotalCriteria(standard: Standard): number {
  return standard.levels.reduce((total, level) => total + level.criteria.length, 0);
}

export function formatThaiDate(date: string): string {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function countFilledHospitalFields(info: HospitalInfo): number {
  const textFields = [info.name, info.region, info.province, info.district, info.hospitalSize];
  const numberFields = [
    info.bedCount,
    info.staff.pharmacists,
    info.staff.assistants,
    info.staff.others,
    info.stats.opdVisits,
    info.stats.opdPrescriptions,
    info.stats.ipdAdmissions,
    info.stats.ipdPatientDays,
  ];

  return (
    textFields.filter((value) => value.trim().length > 0).length +
    numberFields.filter((value) => value > 0).length
  );
}
