import { ClinicalDocument } from "../types";

export const SAMPLE_CLINICAL_DOCUMENTS: ClinicalDocument[] = [
  {
    id: "doc-keynote-189",
    title: "KEYNOTE-189: Phase III Pembrolizumab + Chemotherapy in Metastatic Nonsquamous NSCLC",
    therapeuticArea: "Oncology",
    type: "Clinical Trial Monograph",
    source: "New England Journal of Medicine / Merck Clinical Study Report",
    date: "2020-04-15",
    tags: ["Pembrolizumab", "NSCLC", "Pemetrexed", "Renal Impairment", "Phase III"],
    isDefault: true,
    content: `KEYNOTE-189 CLINICAL STUDY REPORT (SUMMARY)
Study Title: Double-Blind Phase III Trial of Pembrolizumab plus Pemetrexed-Platinum vs Placebo plus Pemetrexed-Platinum in Untreated Metastatic Nonsquamous Non-Small-Cell Lung Cancer.
Phase: Phase 3 Randomized Double-Blind Placebo-Controlled Trial.
Population: Patients aged >= 18 years with previously untreated, EGFR/ALK-negative metastatic nonsquamous NSCLC regardless of PD-L1 expression. Baseline renal eligibility criterion required estimated glomerular filtration rate (eGFR) >= 45 mL/min/1.73m2 or creatinine clearance >= 45 mL/min.
Sample Size: N = 616 randomized (410 in Pembrolizumab combo group, 206 in Placebo combo group).

Primary Endpoints: Overall Survival (OS) and Progression-Free Survival (PFS) assessed by blinded independent central review.
Key Efficacy Results:
- Median Overall Survival was 22.0 months (95% CI: 19.5 - 25.2) in the Pembrolizumab combination arm versus 10.6 months (95% CI: 8.7 - 13.6) in the control arm (Hazard Ratio HR = 0.56; 95% CI: 0.45 - 0.70; p < 0.0001).
- 24-month OS rate was 45.7% vs 27.3%.
- Median PFS was 9.0 months vs 4.9 months (HR = 0.48; 95% CI: 0.40 - 0.58; p < 0.0001).

Safety Outcomes:
- Grade 3 to 5 adverse events occurred in 71.9% of patients in the Pembrolizumab combination group and 66.8% in the placebo combination group.
- Acute kidney injury (AKI) occurred in 5.2% of patients receiving pembrolizumab + pemetrexed versus 2.4% in placebo + pemetrexed.
- Discontinuation of all study drugs due to adverse events occurred in 27.2% vs 14.8%.

Subgroup Analysis (Renal Impairment & CKD):
- In patients with baseline mild renal impairment (eGFR 60 to 89 mL/min, n=248) and moderate renal impairment (eGFR 45 to 59 mL/min, n=82), the OS benefit was consistent (HR = 0.59 and 0.54 respectively).
- Patients with severe renal impairment or CKD Stage 3b/4 (eGFR < 45 mL/min) were EXCLUDED from initial randomization in KEYNOTE-189 due to pemetrexed nephrotoxicity labeling restrictions.
- In post-hoc safety registries, pemetrexed co-administration in patients with eGFR 30-44 mL/min required reduced dose intensity, hydration protocols, and weekly serum creatinine/eGFR checks.

Study Limitations:
- Exclusion of patients with baseline severe renal impairment (eGFR < 45 mL/min) at initial trial entry limits direct prospective Phase III efficacy extrapolation in Stage 3b/4 CKD.
- High rate of crossover to pembrolizumab monotherapy in the placebo arm (53.9%).`,
  },
  {
    id: "doc-paradigm-hf",
    title: "PARADIGM-HF: Phase III Trial of Sacubitril/Valsartan vs Enalapril in HFrEF",
    therapeuticArea: "Cardiology",
    type: "Clinical Trial Monograph",
    source: "New England Journal of Medicine / Novartis Clinical Report",
    date: "2014-09-11",
    tags: ["Sacubitril/Valsartan", "Enalapril", "HFrEF", "Angioedema", "Washout"],
    isDefault: true,
    content: `PARADIGM-HF CLINICAL STUDY REPORT
Study Title: Prospective Comparison of ARNI with ACEI to Determine Impact on Global Mortality and Morbidity in Heart Failure.
Phase: Phase 3 Double-Blind Active-Controlled Trial.
Population: Patients with Chronic Heart Failure, NYHA Class II-IV, LVEF <= 40% (later amended to <= 35%), elevated BNP/NT-proBNP, on background optimal medical therapy.
Sample Size: N = 8,442 patients randomized (4,212 Sacubitril/Valsartan 200mg BID vs 4,230 Enalapril 10mg BID).

Primary Endpoint: Composite of Cardiovascular Death or First Heart Failure Hospitalization.
Key Efficacy Results:
- Primary endpoint occurred in 21.8% of sacubitril/valsartan patients vs 26.5% of enalapril patients (Hazard Ratio HR = 0.80; 95% CI: 0.73 - 0.87; p < 0.001).
- All-cause mortality was reduced by 16% (HR = 0.84; p < 0.001).
- Heart failure hospitalizations reduced by 21% (HR = 0.79; p < 0.001).

Safety Outcomes:
- Symptomatic hypotension occurred in 14.0% of sacubitril/valsartan vs 9.2% of enalapril patients (p < 0.001).
- Hyperkalemia (serum K > 6.0 mmol/L) occurred in 4.3% vs 5.6% (p = 0.007).
- Serum creatinine elevation >= 2.5 mg/dL occurred in 3.3% vs 4.5% (p = 0.007).
- Angioedema confirmed by adjudication: 19 patients (0.5%) in sacubitril/valsartan group vs 10 patients (0.2%) in enalapril group (p = 0.13; no airway compromise requiring intubation).

Administration & Washout Protocol:
- MANDATORY 36-HOUR WASHOUT PERIOD required between last dose of ACE inhibitor (enalapril) and first dose of Sacubitril/Valsartan to prevent severe double-inhibition angioedema risk driven by dual neprilysin and ACE inhibition of bradykinin breakdown.
- Concomitant use with ACE inhibitors is strictly contra-indicated.

Study Limitations:
- Required successful completion of sequential enalapril and sacubitril/valsartan run-in phases prior to randomization, which excluded patients intolerant to either drug class early.
- Under-representation of Black patients (5%) and geographic variation in baseline ACE inhibitor dosing.`,
  },
  {
    id: "doc-peds-levetiracetam",
    title: "ADAPT-Epi: Randomized Trial of IV Levetiracetam in Pediatric Refractory Status Epilepticus",
    therapeuticArea: "Pediatrics / Neurology",
    type: "Clinical Trial Monograph",
    source: "Lancet Neurology / Pediatric Epilepsy Research Consortium",
    date: "2019-11-28",
    tags: ["Levetiracetam", "Pediatrics", "Status Epilepticus", "Off-label Dosing", "Safety"],
    isDefault: true,
    content: `ADAPT-Epi PEDIATRIC EPILEPSY CLINICAL STUDY REPORT
Study Title: Established Status Epilepticus Treatment Trial (ESETT) & ADAPT Pediatric Sub-analysis for IV Levetiracetam.
Phase: Phase 3 Adaptive Randomized Comparative Effectiveness Trial.
Population: Pediatric patients aged 2 to 17 years presenting with benzodiazepine-refractory status epilepticus lasting > 5 to 30 minutes.
Sample Size: N = 225 pediatric arm subjects randomized to IV Levetiracetam (60 mg/kg, max 4500 mg), IV Fosphenytoin (20 mg PE/kg), or IV Valproate (40 mg/kg).

Primary Endpoint: Cessation of status epilepticus and absence of recurrent seizures for 60 minutes after end of infusion without rescue medication.
Key Efficacy Results:
- Seizure cessation at 60 minutes achieved in 52.1% (95% CI: 41.2 - 62.8%) of pediatric patients receiving IV Levetiracetam 60 mg/kg loading dose.
- Efficacy was statistically non-inferior to IV Fosphenytoin (45.3%) and IV Valproate (52.0%).

Safety Outcomes:
- Hypotension requiring vasopressors or fluid bolus: 1.6% in Levetiracetam group vs 3.2% in Fosphenytoin group.
- Respiratory depression requiring mechanical ventilation: 8.3% in Levetiracetam vs 11.2% overall.
- Behavioral agitation / irritability post-infusion observed in 12.4% of pediatric patients.
- No cardiotoxicity or severe dysrhythmias reported with rapid 10-15 minute IV infusion.

Pediatric Subgroup Data:
- In children aged 2-5 years (weight range 12-20 kg), a single IV bolus of 60 mg/kg administered over 10 minutes demonstrated consistent kinetic clearance with zero acute systemic toxicity.

Study Limitations:
- Limited long-term 30-day cognitive/neurodevelopmental follow-up.
- Non-blinded paramedic emergency room administration prior to random assignment confirmation.`,
  },
  {
    id: "doc-adalimumab-stability",
    title: "ADAL-STAB: Physical & Chemical Stability of Adalimumab at Ambient Temperatures",
    therapeuticArea: "Rheumatology",
    type: "Stability Report",
    source: "Journal of Pharmaceutical Sciences / AbbVie Quality Assurance",
    date: "2021-06-10",
    tags: ["Adalimumab", "Stability", "Temperature Excursions", "Storage", "Biologics"],
    isDefault: true,
    content: `ADAL-STAB QUALITY & PHARMACEUTICAL STABILITY REPORT
Document Title: Forced Degradation and Ambient Temperature Excursion Profile for Pre-filled Adalimumab 40mg/0.8mL Syringes and Pen Injectors.
Study Type: In-Vitro Physicochemical and Bioactivity Stability Assessment.

Tested Conditions:
- Refrigerated storage: 2°C to 8°C (36°F to 46°F) - Standard Shelf Life 24 months.
- Ambient Temperature Excursion: 25°C ± 2°C (77°F) at 60% Relative Humidity for 14 consecutive days.
- Extreme Temperature Stress: 37°C and 40°C for 48 hours.

Key Stability Findings:
- Monomer Purity & Aggregation: High-Performance Size Exclusion Chromatography (HP-SEC) confirmed monomer purity remained > 98.2% after 14 days continuous exposure at 25°C.
- Neutralization Bioactivity: TNF-alpha binding affinity retained > 95% potency throughout the 14-day ambient exposure window.
- Light Exposure: Syringes kept in original package container were protected from photodegradation. Direct sunlight exposure caused high-molecular-weight aggregate formation within 72 hours.

Official Handling & Re-refrigeration Guidance:
- A single pre-filled syringe or pen may be stored at temperatures up to a maximum of 25°C (77°F) for a single period of up to 14 days.
- If stored at room temperature, it MUST be used within the 14-day period or discarded.
- CRITICAL RULE: Once removed from 2-8°C refrigeration and allowed to reach 25°C, the product CANNOT be returned to the refrigerator for prolonged storage. Re-refrigeration induces thermal hysteresis and micro-precipitation risks.

Limitations:
- Does not cover frozen storage (< 0°C); freezing causes irreversible protein denaturation and syringe container rupture.`,
  },
  {
    id: "doc-natalizumab-pregnancy",
    title: "NATAL-PREG: Observational Registry of Natalizumab in Pregnant Multiple Sclerosis Patients",
    therapeuticArea: "Neurology / OB-GYN",
    type: "Observational Study",
    source: "Neurology Clinical Practice / Global MS Pregnancy Registry",
    date: "2022-01-18",
    tags: ["Natalizumab", "Pregnancy", "Lactation", "Multiple Sclerosis", "Neonatal Hematology"],
    isDefault: true,
    content: `NATAL-PREG GLOBAL REGISTRY REPORT
Study Title: Outcomes of Gestational Exposure to Natalizumab in Women with Relapsing-Remitting Multiple Sclerosis: A Prospective Cohort Study.
Study Design: Prospective International Observational Registry.
Population: 368 pregnant women with RRMS exposed to natalizumab 300mg IV during 1st, 2nd, or 3rd trimesters.
Sample Size: N = 368 maternal-infant pairs.

Primary Outcomes: Major congenital malformations rate, spontaneous abortion rate, and neonatal hematologic abnormalities.
Key Findings:
- Major Congenital Malformation Rate: 4.8% (95% CI: 2.8 - 7.6%), consistent with general population baseline rates (2-5%).
- Spontaneous Abortion Rate: 8.2% for 1st trimester exposure vs 7.4% control.

Safety & Neonatal Hematologic Abnormalities (3rd Trimester Exposure):
- Exposure to natalizumab during the 3rd trimester was associated with mild to moderate neonatal anemia (reported in 14.2% of newborns) and neonatal thrombocytopenia (reported in 9.8% of newborns).
- Transplacental IgG1 transfer increases significantly after week 20 of gestation, resulting in umbilical cord natalizumab levels 2x higher than maternal serum levels at delivery.
- Hematologic monitoring (CBC with platelet count) is recommended for infants born to mothers exposed to natalizumab during the 2nd or 3rd trimester.

Lactation & Breastfeeding Data:
- Natalizumab is excreted into human milk in very small quantities (relative infant dose RID < 1%). Oral bioavailability in infant GI tract is extremely low due to proteolytic degradation.

Study Limitations:
- Observational design without randomized placebo arm due to ethical constraints in pregnancy.
- Potential under-reporting of mild transient infant cytopenias in community health settings.`,
  },
];
