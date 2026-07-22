import { SampleQueryPreset } from "../types";

export const SAMPLE_QUERIES: SampleQueryPreset[] = [
  {
    id: "preset-oncology-renal",
    title: "Oncology - Immunotherapy in Renal Impairment",
    therapeuticArea: "Oncology",
    hcpName: "Dr. Elizabeth Vance",
    specialty: "Medical Oncology",
    country: "United States",
    urgency: "Urgent Patient Case",
    expectedCategory: "Renal Impairment, Dosage, Combination Therapy",
    queryText:
      "A 62-year-old male with metastatic non-small cell lung cancer (NSCLC) and stage 3b chronic kidney disease (eGFR 38 mL/min). We are considering starting pembrolizumab 200mg IV q3w in combination with pemetrexed 500 mg/m². Is renal dose adjustment or pre-treatment creatinine clearance monitoring required for pemetrexed in this eGFR range, and what is the recommended protocol?",
  },
  {
    id: "preset-cardio-washout",
    title: "Cardiology - ARNI Switch & Washout Protocol",
    therapeuticArea: "Cardiology",
    hcpName: "Dr. Marcus Thorne",
    specialty: "Heart Failure Cardiology",
    country: "United Kingdom",
    urgency: "Normal",
    expectedCategory: "Administration, Drug Interaction, Contraindication",
    queryText:
      "Can sacubitril/valsartan be safely initiated in a 74-year-old female patient with HFrEF (LVEF 28%) who is currently taking spironolactone 25mg daily and enalapril 10mg BID? What is the mandatory washout period before switching from enalapril to prevent angioedema, and are serum potassium checks required?",
  },
  {
    id: "preset-peds-epilepsy",
    title: "Pediatrics - Off-label Refractory Status Epilepticus",
    therapeuticArea: "Pediatrics",
    hcpName: "Dr. Aris Thorne",
    specialty: "Pediatric Neurology",
    country: "Canada",
    urgency: "Urgent Patient Case",
    expectedCategory: "Off-label Use, Pediatrics, Dosage, Safety",
    queryText:
      "Requesting off-label dosing data and pediatric safety evidence for intravenous levetiracetam bolus in a 4-year-old female presenting with refractory status epilepticus. Patient weighs 16 kg with no prior seizure history. What is the maximum initial IV loading dose used in emergency pediatric protocols?",
  },
  {
    id: "preset-rheum-stability",
    title: "Rheumatology - Biologic Temperature Excursion & Travel",
    therapeuticArea: "Rheumatology",
    hcpName: "Dr. Priya Patel",
    specialty: "Rheumatology",
    country: "Germany",
    urgency: "Normal",
    expectedCategory: "Storage, Stability",
    queryText:
      "What is the physical and chemical stability of opened adalimumab 40mg pre-filled syringes when left at ambient room temperature (up to 25°C / 77°F) during international travel? If unused within 10 days, can the syringe be re-refrigerated at 2-8°C or must it be discarded?",
  },
  {
    id: "preset-obgyn-pregnancy",
    title: "Obstetrics & Neurology - MS Biologic in Pregnancy",
    therapeuticArea: "Neurology / OB-GYN",
    hcpName: "Dr. Javier Gomez",
    specialty: "Maternal-Fetal Medicine",
    country: "United States",
    urgency: "Normal",
    expectedCategory: "Pregnancy, Lactation, Safety, Pharmacokinetics",
    queryText:
      "31-year-old pregnant patient (2nd trimester, 22 weeks gestations) with highly active relapsing-remitting multiple sclerosis. Inquiry regarding transplacental transfer kinetics, third-trimester neonatal hematologic risks, and breastfeeding compatibility of natalizumab 300mg IV monthly infusions.",
  },
  {
    id: "preset-endocrinology-interaction",
    title: "Endocrinology - GLP-1 RA Oral Absorption Interaction",
    therapeuticArea: "Endocrinology",
    hcpName: "Dr. Hiroshi Tanaka",
    specialty: "Endocrinology & Diabetes",
    country: "Japan",
    urgency: "Normal",
    expectedCategory: "Drug Interaction, Pharmacokinetics, Administration",
    queryText:
      "A 58-year-old female with Type 2 Diabetes and hypothyroidism taking levothyroxine 100 mcg daily upon waking. We plan to initiate oral semaglutide 3mg daily. Does delayed gastric emptying from oral semaglutide impair levothyroxine bioabsorption, and how should dosing schedules be staggered?",
  },
];
