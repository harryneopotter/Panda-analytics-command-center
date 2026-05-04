"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Tab = {
  id: string;
  label: string;
};

type HospitalScope = "Marengo" | "Manipal" | "Both";

type AuditLogEntry = {
  id: string;
  version: string;
  approver: string;
  timestamp: string;
  notes: string;
};

type ScriptInboxStatus =
  | "Draft Received"
  | "Needs Trim"
  | "Ready for Shoot"
  | "Recorded"
  | "Captioned"
  | "Compliance Reviewed"
  | "Doctor Approved"
  | "Scheduled"
  | "Published";

type ScriptInboxItem = {
  id: string;
  title: string;
  hospital: HospitalScope;
  status: ScriptInboxStatus;
  receivedOn: string;
  nextActions: string[];
};

const tabs: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "capture", label: "Weekly Capture" },
  { id: "pipeline", label: "Content Pipeline" },
  { id: "repurposing", label: "Reel Repurposing" },
  { id: "compliance", label: "Compliance Review" },
  { id: "map", label: "Visibility Map" },
  { id: "keywords", label: "Keyword Tracker" },
  { id: "competitors", label: "Competitor Snapshot" },
  { id: "report", label: "Monthly Report" },
];

type ContentStage =
  | "Idea"
  | "Doctor Draft"
  | "Ready for Shoot"
  | "Compliance Reviewed";

type ComplianceStatus = "Clear" | "Low Risk" | "Needs wording review";
type Priority = "Low" | "Medium" | "High";

type ContentItem = {
  id: string;
  topic: string;
  category: string;
  source: string;
  stage: ContentStage;
  outputs: string[];
  doctorApproval: string;
  complianceStatus: ComplianceStatus;
  priority: Priority;
  nextActions: string[];
  auditSummary: string;
};

type ShootTopic = {
  id: string;
  title: string;
  status: "Planned" | "Script Ready";
  platforms: string[];
  riskLevel: "Low" | "Medium" | "High";
};

type Shoot = {
  id: string;
  date: string;
  location: string;
  theme: string;
  targetOutput: number;
  status: string;
  doctorInputNeeded: string[];
  topics: ShootTopic[];
};

type ComplianceItem = {
  id: string;
  contentTitle: string;
  status: "Clear" | "Needs Edit";
  riskLevel: "Low" | "Medium" | "High";
  flags: string[];
  suggestedFix: string;
};

type MapStatus = "Green" | "Yellow" | "Red" | "Blue";

type MapNode = {
  id?: string;
  city: string;
  state: string;
  status: MapStatus;
  searchIntent: string[];
  currentGap: string;
  suggestedContent: string;
  recommendedPlatforms: string[];
  priority: Priority;
};

type KeywordVisibility = "Partial" | "Weak";
type KeywordItem = {
  keyword: string;
  category: string;
  region: string;
  intentType: string;
  currentVisibility: KeywordVisibility;
  competitorStrength: "Strong" | "Moderate" | "Weak";
  contentStatus: string;
  recommendedAction: string;
  priority: Priority;
};

type Competitor = {
  name: string;
  website: "Strong" | "Moderate" | "Weak";
  youtube: "Strong" | "Moderate" | "Weak";
  instagram: "Active" | "Low" | "Weak";
  directory: "Strong" | "Moderate" | "Weak";
  contentGap: string;
  opportunity: string;
  notes: string;
};

type DemoData = {
  overview: {
    visibilityStatus: string;
    contentSystem: string;
    complianceMode: string;
    primaryRegion: string;
    weeklyShootTarget: string;
    outputTarget: string;
    currentFocus: string;
    focusAreas: string[];
    monthlyGoal: string;
  };
  shoots: Shoot[];
  scriptInbox: ScriptInboxItem[];
  auditLog: AuditLogEntry[];
  pipeline: ContentItem[];
  repurposing: Array<{
    id: string;
    originalTopic: string;
    originalPlatform: string;
    repurposedAs: string[];
    youtubeTitle: string;
    description: string;
    hashtags: string[];
    complianceNotes: string[];
    status: string;
  }>;
  compliance: ComplianceItem[];
  mapNodes: MapNode[];
  keywords: KeywordItem[];
  competitors: Competitor[];
  monthlyReport: {
    month: string;
    reelsRecorded: number;
    reelsPublished: number;
    youtubeShortsPrepared: number;
    websiteFaqsSuggested: number;
    gbpPostsSuggested: number;
    contentReviewed: number;
    pendingApprovals: number;
    visibilitySignals: string;
    topRegions: string[];
    weakRegions: string[];
    bestContent: string;
    nextThemes: string[];
    shootDates: string[];
    requiredInput: string;
  };
};

const demoData: DemoData = {
  overview: {
    visibilityStatus: "Foundation Building",
    contentSystem: "Doctor-Led",
    complianceMode: "Review Before Publishing",
    primaryRegion: "Gurugram / Delhi NCR",
    weeklyShootTarget: "1–2 sessions",
    outputTarget: "6–7 reels per session",
    currentFocus: "Educational Authority",
    focusAreas: [
      "Kidney Stones",
      "Prostate Health",
      "Urinary Symptoms",
      "Uro-oncology",
      "Robotic Urology",
      "Renal Transplant",
      "Men's Health",
      "Preventive Urology",
    ],
    monthlyGoal: "4 themes • 24–28 videos • YouTube + Website + GBP expansion",
  },
  shoots: [
    {
      id: "s1",
      date: "Monday, 28 Apr 2026",
      location: "Closeby Hospital / Clinic",
      theme: "Kidney Stone Awareness",
      targetOutput: 7,
      status: "Ready for discussion",
      doctorInputNeeded: [
        "Talking points approval",
        "Script review",
        "45–75 min slot",
      ],
      topics: [
        {
          id: "t1",
          title: "Kidney stone pain: when to worry?",
          status: "Planned",
          platforms: ["IG Reel", "YT Short"],
          riskLevel: "Low",
        },
        {
          id: "t2",
          title: "Can small kidney stones pass naturally?",
          status: "Planned",
          platforms: ["IG Reel", "YT Short", "Website FAQ"],
          riskLevel: "Low",
        },
        {
          id: "t3",
          title: "When is laser treatment needed?",
          status: "Script Ready",
          platforms: ["IG Reel", "YT Short"],
          riskLevel: "Medium",
        },
        {
          id: "t4",
          title: "Is kidney stone surgery painful?",
          status: "Planned",
          platforms: ["IG Reel", "GBP Post"],
          riskLevel: "Low",
        },
        {
          id: "t5",
          title: "Why do kidney stones come back?",
          status: "Planned",
          platforms: ["IG Reel", "YT Short"],
          riskLevel: "Low",
        },
        {
          id: "t6",
          title: "How much water helps prevent stones?",
          status: "Planned",
          platforms: ["IG Reel", "Website FAQ"],
          riskLevel: "Low",
        },
        {
          id: "t7",
          title: "When is kidney stone an emergency?",
          status: "Planned",
          platforms: ["IG Reel", "YT Short"],
          riskLevel: "Medium",
        },
      ],
    },
  ],
  scriptInbox: [
    {
      id: "si1",
      title: "Frequent urination at night (male): clinical causes and safe next steps",
      hospital: "Both",
      status: "Needs Trim",
      receivedOn: "24 Apr 2026",
      nextActions: ["Needs Trim", "Generate caption variants", "Send for doctor approval"],
    },
    {
      id: "si2",
      title: "Kidney stones: when to seek urgent care",
      hospital: "Marengo",
      status: "Ready for Shoot",
      receivedOn: "26 Apr 2026",
      nextActions: ["Add to next shoot", "Request hospital co-branding"],
    },
    {
      id: "si3",
      title: "Robotic partial nephrectomy: what patients should expect",
      hospital: "Manipal",
      status: "Compliance Reviewed",
      receivedOn: "20 Apr 2026",
      nextActions: ["Send for doctor approval", "Schedule post"],
    },
  ],
  auditLog: [
    {
      id: "al1",
      version: "v3",
      approver: "Dr. UserA",
      timestamp: "28 Apr 2026, 11:10",
      notes: "Approved educational framing; removed outcome language; no solicitation CTA.",
    },
    {
      id: "al2",
      version: "v2",
      approver: "Compliance Review",
      timestamp: "27 Apr 2026, 18:40",
      notes: "Flagged superlatives and softened treatment framing; added privacy reminder.",
    },
  ],
  pipeline: [
    {
      id: "c1",
      topic: "When does a kidney stone need surgery?",
      category: "Kidney Stone",
      source: "Weekly Shoot",
      stage: "Ready for Shoot",
      outputs: ["IG Reel", "YT Short", "Website FAQ", "GBP Post"],
      doctorApproval: "Pending",
      complianceStatus: "Low Risk",
      priority: "High",
      nextActions: ["Add to next shoot", "Send for doctor approval"],
      auditSummary: "Draft v1 saved • Doctor approval pending",
    },
    {
      id: "c2",
      topic: "Frequent urination at night",
      category: "Prostate Health",
      source: "Doctor Script",
      stage: "Doctor Draft",
      outputs: ["IG Reel", "YT Short", "Blog FAQ"],
      doctorApproval: "In Progress",
      complianceStatus: "Needs wording review",
      priority: "High",
      nextActions: ["Needs Trim", "Generate caption variants", "Send for doctor approval"],
      auditSummary: "Compliance notes added • Awaiting revised script",
    },
    {
      id: "c3",
      topic: "Robotic partial nephrectomy explained",
      category: "Robotic Urology",
      source: "Existing Reel",
      stage: "Compliance Reviewed",
      outputs: ["YT Short", "Website FAQ"],
      doctorApproval: "Approved",
      complianceStatus: "Clear",
      priority: "Medium",
      nextActions: ["Schedule post", "Request hospital co-branding"],
      auditSummary: "Approved v3 on 28 Apr 2026 (sample)",
    },
    {
      id: "c4",
      topic: "PSA test: what the numbers mean",
      category: "Prostate Health",
      source: "SEO Gap",
      stage: "Idea",
      outputs: ["IG Reel", "Website FAQ"],
      doctorApproval: "Not Required Yet",
      complianceStatus: "Clear",
      priority: "Medium",
      nextActions: ["Add to next shoot"],
      auditSummary: "Idea logged • Awaiting script",
    },
  ],
  repurposing: [
    {
      id: "r1",
      originalTopic: "Kidney stone treatment explainer",
      originalPlatform: "Instagram",
      repurposedAs: ["YouTube Short", "Website FAQ", "GBP Post"],
      youtubeTitle: "Kidney Stone Surgery Kab Zaroori Hoti Hai? | Urologist Explains",
      description:
        "Dr. UserA explains when kidney stones may need surgery and when they may be managed without surgery. Treatment depends on stone size, location, pain, infection, blockage, and test reports.",
      hashtags: ["#KidneyStone", "#Urology", "#DrUserA"],
      complianceNotes: [
        "No guarantee claim",
        "Educational tone",
        "Safe CTA added",
      ],
      status: "Sample Preview Only",
    },
    {
      id: "r2",
      originalTopic: "Prostate health awareness",
      originalPlatform: "Instagram",
      repurposedAs: ["YouTube Short", "FB Reel"],
      youtubeTitle: "Raat Mein Baar Baar Peshab Aana? | Prostate Health",
      description:
        "Common causes of frequent night urination in men and when to see a urologist.",
      hashtags: ["#ProstateHealth", "#MensHealth"],
      complianceNotes: ["Educational only"],
      status: "Sample Preview Only",
    },
  ],
  compliance: [
    {
      id: "co1",
      contentTitle: "Kidney Stone Surgery Kab Zaroori Hoti Hai?",
      status: "Needs Edit",
      riskLevel: "Medium",
      flags: [
        "Phrase implies an outcome promise",
        "CTA should be softened",
      ],
      suggestedFix:
        "Replace strong treatment promise with educational guidance and consultation-safe wording.",
    },
    {
      id: "co2",
      contentTitle: "Frequent urination at night — causes & next steps",
      status: "Clear",
      riskLevel: "Low",
      flags: [],
      suggestedFix: "",
    },
  ],
  mapNodes: [
    {
      "id": "m1",
      "city": "Gurugram",
      "state": "Haryana",
      "status": "Yellow",
      "searchIntent": [
        "robotic prostate surgery gurugram",
        "uro-oncologist near me",
        "RIRS kidney stone cost gurugram"
      ],
      "currentGap": "Lack of patient-facing content explaining the specific recovery benefits of robotic vs laparoscopic surgery.",
      "suggestedContent": "Robotic Prostatectomy Recovery: What to expect in the first 48 hours",
      "recommendedPlatforms": ["YouTube Short", "Website FAQ", "GBP Post"],
      "priority": "High"
    },
    {
      "id": "m2",
      "city": "Delhi",
      "state": "Delhi NCR",
      "status": "Green",
      "searchIntent": [
        "urologist in delhi",
        "kidney transplant cost in delhi",
        "prostate laser surgery delhi"
      ],
      "currentGap": "Oversaturation of generic directory lists; missing niche content on donor evaluation and HLA matching for transplants.",
      "suggestedContent": "Who can be a kidney donor? Understanding blood group and HLA compatibility",
      "recommendedPlatforms": ["Website FAQ", "GBP Post"],
      "priority": "Medium"
    },
    {
      "id": "m3",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "status": "Yellow",
      "searchIntent": [
        "urologist in noida sector 62",
        "laser stone removal noida",
        "prostate biopsy cost noida"
      ],
      "currentGap": "Low awareness content regarding painless biopsy techniques and MRI-TRUS fusion biopsy.",
      "suggestedContent": "Is prostate biopsy painful? How MRI-Fusion technology improves accuracy",
      "recommendedPlatforms": ["IG Reel", "YouTube Short"],
      "priority": "High"
    },
    {
      "id": "m4",
      "city": "Faridabad",
      "state": "Haryana",
      "status": "Red",
      "searchIntent": [
        "kidney stone doctor faridabad",
        "urine infection specialist faridabad",
        "pcnl surgery faridabad"
      ],
      "currentGap": "Significant gap in post-operative care instructions for stone surgery and stent management.",
      "suggestedContent": "DJ Stent removal: Why you shouldn't miss your follow-up appointment",
      "recommendedPlatforms": ["GBP Post", "Website FAQ"],
      "priority": "High"
    },
    {
      "id": "m5",
      "city": "Ghaziabad",
      "state": "Uttar Pradesh",
      "status": "Yellow",
      "searchIntent": [
        "urology hospital ghaziabad",
        "hydrocele surgery cost ghaziabad",
        "urologist near indirapuram"
      ],
      "currentGap": "Lack of distinction between daycare and inpatient urological procedures.",
      "suggestedContent": "Daycare Urology: Procedures where you go home the same day",
      "recommendedPlatforms": ["IG Reel", "Website FAQ"],
      "priority": "Medium"
    },
    {
      "id": "m6",
      "city": "Sonipat",
      "state": "Haryana",
      "status": "Red",
      "searchIntent": [
        "pathri ka doctor sonipat",
        "urologist in sonipat haryana",
        "urinary tract infection treatment"
      ],
      "currentGap": "Almost no digital presence explaining advanced laser treatments like HoLEP for prostate.",
      "suggestedContent": "Ghabraiye mat: HoLEP laser se prostate surgery ke fayde",
      "recommendedPlatforms": ["YouTube Short", "GBP Post"],
      "priority": "High"
    },
    {
      "id": "m7",
      "city": "Panipat",
      "state": "Haryana",
      "status": "Blue",
      "searchIntent": [
        "kidney stone laser surgery panipat",
        "urologist panipat",
        "dialysis hospital panipat"
      ],
      "currentGap": "High search volume for stone recurrence prevention but zero specialist video content.",
      "suggestedContent": "Pathri dobara kyu hoti hai? 5 tips to prevent recurrent kidney stones",
      "recommendedPlatforms": ["IG Reel", "YouTube Short", "GBP Post"],
      "priority": "High"
    },
    {
      "id": "m8",
      "city": "Rohtak",
      "state": "Haryana",
      "status": "Yellow",
      "searchIntent": [
        "urologist rohtak haryana",
        "kidney failure doctor rohtak",
        "laparoscopic urosurgery rohtak"
      ],
      "currentGap": "Patients confused between general surgery and specialized urological surgery for stones.",
      "suggestedContent": "General Surgeon vs Urologist: Who should operate on your kidney stone?",
      "recommendedPlatforms": ["Website FAQ", "GBP Post"],
      "priority": "Medium"
    },
    {
      "id": "m9",
      "city": "Meerut",
      "state": "Uttar Pradesh",
      "status": "Red",
      "searchIntent": [
        "urologist in meerut",
        "kidney stone operation meerut",
        "erectile dysfunction treatment meerut"
      ],
      "currentGap": "High stigma-related searches (ED/Infertility) with very little clinical/scientific advice available.",
      "suggestedContent": "Male Infertility: When to consult a Urologist/Andrologist",
      "recommendedPlatforms": ["IG Reel", "YouTube Short"],
      "priority": "High"
    },
    {
      "id": "m10",
      "city": "Karnal",
      "state": "Haryana",
      "status": "Blue",
      "searchIntent": [
        "urologist in karnal city",
        "renal stone laser treatment karnal",
        "prostate cancer treatment"
      ],
      "currentGap": "Demand for advanced robotic surgery info but local results only show basic laparoscopy.",
      "suggestedContent": "Karnal se Gurugram: Why travel for Robotic Uro-surgery?",
      "recommendedPlatforms": ["GBP Post", "Website FAQ"],
      "priority": "High"
    },
    {
      "id": "m11",
      "city": "Hisar",
      "state": "Haryana",
      "status": "Red",
      "searchIntent": [
        "hisar me pathri ka ilaj",
        "urologist in hisar",
        "urinary leakage treatment hisar"
      ],
      "currentGap": "Missing content on female urology and urinary incontinence issues.",
      "suggestedContent": "Urinary Leakage in Women: It's treatable and not just a sign of aging",
      "recommendedPlatforms": ["YouTube Short", "IG Reel"],
      "priority": "Medium"
    },
    {
      "id": "m12",
      "city": "Jaipur",
      "state": "Rajasthan",
      "status": "Green",
      "searchIntent": [
        "urologist in jaipur",
        "robotic surgery jaipur",
        "kidney transplant jaipur hospital"
      ],
      "currentGap": "Strong general presence, but lacks detailed content on post-transplant immunosuppression lifestyle.",
      "suggestedContent": "Life after Kidney Transplant: Diet and precautions you must follow",
      "recommendedPlatforms": ["Website FAQ", "GBP Post"],
      "priority": "Medium"
    },
    {
      "id": "m13",
      "city": "Jodhpur",
      "state": "Rajasthan",
      "status": "Yellow",
      "searchIntent": [
        "urologist in jodhpur rajasthan",
        "jodhpur kidney stone specialist",
        "prostate enlargement treatment"
      ],
      "currentGap": "Gap in content related to the impact of hard water on kidney stones in Rajasthan.",
      "suggestedContent": "Kya Rajasthan ka paani pathri banata hai? The truth about hard water",
      "recommendedPlatforms": ["IG Reel", "YouTube Short"],
      "priority": "High"
    },
    {
      "id": "m14",
      "city": "Lucknow",
      "state": "Uttar Pradesh",
      "status": "Green",
      "searchIntent": [
        "urologist in lucknow",
        "kidney transplant cost lucknow",
        "uro-oncologist lucknow"
      ],
      "currentGap": "Well-covered basic topics; need more content on bladder cancer and BCG therapy.",
      "suggestedContent": "Blood in Urine (Hematuria): Don't ignore it, it could be bladder cancer",
      "recommendedPlatforms": ["YouTube Short", "Website FAQ"],
      "priority": "Medium"
    },
    {
      "id": "m15",
      "city": "Kanpur",
      "state": "Uttar Pradesh",
      "status": "Yellow",
      "searchIntent": [
        "urologist in kanpur",
        "kidney stone treatment without surgery",
        "prostate surgeon kanpur"
      ],
      "currentGap": "High volume of 'without surgery' searches; need educational content on when surgery is unavoidable.",
      "suggestedContent": "Dawa ya Surgery? When kidney stones cannot be passed naturally",
      "recommendedPlatforms": ["GBP Post", "IG Reel"],
      "priority": "High"
    },
    {
      "id": "m16",
      "city": "Patna",
      "state": "Bihar",
      "status": "Blue",
      "searchIntent": [
        "urologist in patna",
        "kidney transplant center bihar",
        "laser prostate surgery patna"
      ],
      "currentGap": "Significant trust gap; patients travel out of state due to low availability of clear, clinician-led educational explainers.",
      "suggestedContent": "Advanced Urology in Patna: What services are available and when to seek specialist care",
      "recommendedPlatforms": ["YouTube Short", "GBP Post", "Website FAQ"],
      "priority": "High"
    }
  ],
  keywords: [
    {
      keyword: "urologist in gurugram",
      category: "Urology",
      region: "Gurugram",
      intentType: "Local search",
      currentVisibility: "Partial",
      competitorStrength: "Moderate",
      contentStatus: "In progress",
      recommendedAction: "Add 3 more educational reels",
      priority: "High",
    },
    {
      keyword: "kidney stone treatment gurugram",
      category: "Kidney Stone",
      region: "Gurugram",
      intentType: "Treatment",
      currentVisibility: "Weak",
      competitorStrength: "Strong",
      contentStatus: "Planned",
      recommendedAction: "Prioritize in next 2 shoots",
      priority: "High",
    },
    {
      keyword: "frequent urination at night male",
      category: "Prostate",
      region: "Delhi NCR",
      intentType: "Symptom",
      currentVisibility: "Partial",
      competitorStrength: "Moderate",
      contentStatus: "Doctor Draft",
      recommendedAction: "Finalize script this week",
      priority: "Medium",
    },
  ],
  competitors: [
    {
      name: "Dr. Sharma Urology",
      website: "Strong",
      youtube: "Moderate",
      instagram: "Active",
      directory: "Strong",
      contentGap: "Heavy promotional tone",
      opportunity: "Doctor-led education gap",
      notes: "Some before/after style posts",
    },
    {
      name: "City Hospital Urology",
      website: "Strong",
      youtube: "Weak",
      instagram: "Low",
      directory: "Strong",
      contentGap: "Low video education",
      opportunity: "Consistent short-form content",
      notes: "Mostly hospital ads",
    },
  ],
  monthlyReport: {
    month: "Demo Month",
    reelsRecorded: 24,
    reelsPublished: 18,
    youtubeShortsPrepared: 18,
    websiteFaqsSuggested: 8,
    gbpPostsSuggested: 4,
    contentReviewed: 22,
    pendingApprovals: 6,
    visibilitySignals: "Visibility signals improved (sample)",
    topRegions: ["Gurugram", "Delhi"],
    weakRegions: ["Faridabad"],
    bestContent: "Kidney stone explainer series",
    nextThemes: [
      "Prostate Health",
      "Robotic Urology",
      "Men’s Health Awareness",
    ],
    shootDates: ["28 Apr", "5 May"],
    requiredInput: "Script approval for prostate topics",
  },
};

export default function DoctorVisibilityDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMapNode, setSelectedMapNode] = useState<MapNode | null>(null);
  const [showDemoBanner] = useState(true);
  const [captureHospital, setCaptureHospital] = useState<HospitalScope>("Both");
  const [pipelineHospital, setPipelineHospital] = useState<HospitalScope>("Both");

  const modalPanelRef = useRef<HTMLDivElement>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  const closeMapModal = useCallback(() => {
    setSelectedMapNode(null);
    window.setTimeout(() => {
      modalTriggerRef.current?.focus();
    }, 0);
  }, []);

  useEffect(() => {
    if (!selectedMapNode) return;

    if (!modalTriggerRef.current) {
      const active = document.activeElement;
      modalTriggerRef.current = active instanceof HTMLElement ? active : null;
    }

    const panel = modalPanelRef.current;
    if (!panel) return;

    const getFocusable = (container: HTMLElement): HTMLElement[] => {
      const nodes = container.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])",
      );
      return Array.from(nodes).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
    };

    const focusables = getFocusable(panel);
    (focusables[0] ?? modalCloseButtonRef.current ?? panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMapModal();
        return;
      }

      if (e.key !== "Tab") return;

      const currentFocusables = getFocusable(panel);
      if (currentFocusables.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
        return;
      }

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMapModal, selectedMapNode]);

  const renderStatusBadge = (
    status: string,
    type: "clear" | "warning" | "danger" | "info" | "pending" = "pending",
  ) => {
    const colors = {
      clear: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      danger: "bg-red-500/20 text-red-400 border-red-500/30",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      pending: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[type]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200">
      {/* Global Demo Banner */}
      {showDemoBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 text-center text-sm">
          <span className="font-medium text-amber-400">Prototype dashboard (demo data) — proposed workflow, not a live product</span>
          <span className="mx-2 text-amber-500/60">|</span>
          <span className="text-amber-400/80">Compliance review + doctor approval are enforced gates before any publishing</span>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-[#0a0f1a]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-semibold text-xl">B</span>
              </div>
              <div>
                <div className="font-semibold tracking-tight">BluePanda Visibility</div>
                <div className="text-[10px] text-zinc-500 -mt-1">Doctor-led educational content workflow (prototype)</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Demo mode</div>
            <div className="text-zinc-500">Dr. UserA • Gurugram</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800 max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 py-3 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-black font-medium"
                      : "hover:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-semibold tracking-tighter">Visibility Workflow Dashboard (Prototype)</h1>
              <p className="mt-3 text-xl text-zinc-400 max-w-3xl">
                A proposed operating workflow for doctor-authored educational content.
                Demo-only views for planning, packaging, compliance review, and visibility signals.
              </p>
              <div className="mt-4 text-sm text-zinc-500 max-w-3xl">
                Demo disclaimer: metrics and signals shown here are samples. Verified measurement requires connected accounts and baseline tracking after onboarding.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-6">
                <div className="text-sm text-zinc-500 mb-1">VISIBILITY STATUS</div>
                <div className="text-3xl font-semibold tracking-tight text-white">Foundation Building</div>
                <div className="mt-4 text-sm text-emerald-400">Visibility signals trending upward (sample)</div>
                <div className="mt-1 text-xs text-zinc-500">Observed signals are not guaranteed outcomes.</div>
              </div>
              <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-6">
                <div className="text-sm text-zinc-500 mb-1">CONTENT SYSTEM</div>
                <div className="text-3xl font-semibold tracking-tight text-white">Doctor-Led</div>
                <div className="mt-4 text-sm">24 reels recorded (sample) • 18 published (sample)</div>
                <div className="mt-1 text-xs text-zinc-500">Counts shown are demo placeholders.</div>
              </div>
              <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-6">
                <div className="text-sm text-zinc-500 mb-1">COMPLIANCE MODE</div>
                <div className="text-3xl font-semibold tracking-tight text-white">Review Before Publishing</div>
                <div className="mt-4 text-sm text-amber-400">Doctor approval is required before publishing</div>
                <div className="mt-1 text-xs text-zinc-500">Compliance review and audit logging are part of the operating workflow.</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">CURRENT FOCUS AREAS</div>
                <div className="flex flex-wrap gap-2">
                  {demoData.overview.focusAreas.map((area) => (
                    <div key={area} className="px-4 py-1.5 bg-zinc-800 text-sm rounded-2xl border border-zinc-700">
                      {area}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="uppercase tracking-[2px] text-xs text-zinc-500 mb-4">THIS MONTH SYSTEM GOAL</div>
                <div className="text-[15px] leading-relaxed text-zinc-300">
                  Proposed operating plan (demo):<br />
                  • 4 weekly education themes<br />
                  • 24–28 short educational videos (sample target)<br />
                  • YouTube Shorts + website FAQ expansion<br />
                  • Google Business Profile education updates<br />
                  • Monthly review of visibility signals (sample)
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 text-center pt-4 border-t border-zinc-800">
              Prototype only • Demo data • Publishing is blocked until compliance review and doctor approval are complete
            </div>
          </div>
        )}

        {/* WEEKLY VIDEO CAPTURE */}
        {activeTab === "capture" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Weekly Video Capture</h2>
              <p className="text-zinc-400 mt-2">Routine capture sessions produce doctor-authored educational assets for multiple platforms. Packaging and scheduling remain gated by compliance review and doctor approval.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-zinc-500">Prototype helper: select a hospital scope to view the proposed operating workflow.</div>
                <label className="text-xs text-zinc-500 flex items-center gap-2">
                  Hospital scope
                  <select
                    value={captureHospital}
                    onChange={(e) => setCaptureHospital(e.target.value as HospitalScope)}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200"
                    aria-label="Hospital scope selector (demo)"
                  >
                    <option value="Marengo">Marengo Asia Hospitals, Gurugram</option>
                    <option value="Manipal">Manipal Hospital, Palam Vihar</option>
                    <option value="Both">Both hospitals</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Upcoming Shoot */}
              <div className="lg:col-span-5 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-emerald-400 font-medium">NEXT SHOOT</div>
                    <div className="text-2xl font-semibold tracking-tight mt-1">Monday, 28 Apr 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500">STATUS</div>
                    <div className="text-emerald-400 font-medium">Ready for discussion</div>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Location</span>
                    <span className="font-medium">Closeby Hospital / Clinic</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Theme</span>
                    <span className="font-medium">Kidney Stone Awareness</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Target Output</span>
                    <span className="font-medium">7 short educational clips (sample)</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-zinc-500">Doctor Input Needed</span>
                    <span className="font-medium text-right">Talking points / script approval<br />45–75 min slot</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 bg-white text-black rounded-2xl font-medium text-sm hover:bg-zinc-200 transition-colors"
                >
                  Place a tentative hold (demo)
                </button>
                <div className="mt-2 text-xs text-zinc-500">
                  No booking actions are performed in this prototype.
                </div>
              </div>

              {/* Topics */}
              <div className="lg:col-span-7 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-sm text-zinc-500">SHOOT TOPICS — KIDNEY STONE AWARENESS</div>
                    <div className="text-xl font-semibold tracking-tight">7 educational topics planned (sample)</div>
                  </div>
                  <div className="text-xs px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full">Doctor approval pending on 3</div>
                </div>

                <div className="space-y-3 text-sm">
                  {demoData.shoots[0].topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <div className="flex-1 pr-4">
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-xs text-zinc-500 mt-1">{topic.platforms.join(" • ")}</div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {renderStatusBadge(
                          topic.status,
                          topic.status === "Script Ready" ? "warning" : "pending",
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            topic.riskLevel === "Low"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {topic.riskLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-8">
              <div className="text-sm text-zinc-500 mb-4">WEEKLY CAPTURE FLOW</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {[
                  "Theme Selected",
                  "Doctor Script / Talking Points",
                  "Shoot",
                  "Edit",
                  "Caption",
                  "Compliance Review",
                  "Doctor Approval",
                  "Schedule",
                  "Publish",
                  "Track",
                ].map((step) => (
                  <div key={step} className="px-4 py-2 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">●</span> {step}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-zinc-500">Prototype scope: shoot planning • edit coordination • subtitles • packaging • compliance checklist • audit log labels • visibility-signal review (sample)</div>
            </div>
          </div>
        )}

        {/* CONTENT PIPELINE */}
        {activeTab === "pipeline" && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Content Pipeline</h2>
                <p className="text-zinc-400 mt-1">Proposed workflow view of content from idea to publishing gates. Publishing remains blocked until compliance review and doctor approval are complete.</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-zinc-500">Demo disclaimer: items, statuses, and next actions are samples.</div>
                  <label className="text-xs text-zinc-500 flex items-center gap-2">
                    Hospital scope
                    <select
                      value={pipelineHospital}
                      onChange={(e) => setPipelineHospital(e.target.value as HospitalScope)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200"
                      aria-label="Hospital scope selector for content pipeline (demo)"
                    >
                      <option value="Marengo">Marengo Asia Hospitals, Gurugram</option>
                      <option value="Manipal">Manipal Hospital, Palam Vihar</option>
                      <option value="Both">Both hospitals</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="text-xs text-emerald-400">22 items • 6 pending doctor approval</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-7 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Doctor Script Inbox (Scaffolding)</div>
                    <div className="text-lg font-semibold tracking-tight">Intake status rail (demo)</div>
                    <div className="text-xs text-zinc-500 mt-2">Purpose: keep doctor-authored scripts moving through enforced gates.</div>
                  </div>
                  <div className="text-[10px] text-amber-400">Sample view only</div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  {(
                    [
                      "Draft Received",
                      "Needs Trim",
                      "Ready for Shoot",
                      "Recorded",
                      "Captioned",
                      "Compliance Reviewed",
                      "Doctor Approved",
                      "Scheduled",
                      "Published",
                    ] as const
                  ).map((s) => (
                    <span key={s} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {demoData.scriptInbox.map((si) => (
                    <div key={si.id} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate">{si.title}</div>
                          <div className="mt-1 text-xs text-zinc-500">Received: {si.receivedOn} • Hospital: {si.hospital}</div>
                        </div>
                        <div className="flex-shrink-0">{renderStatusBadge(si.status, "info")}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {si.nextActions.map((a) => (
                          <button
                            key={`${si.id}-${a}`}
                            type="button"
                            className="text-[11px] px-3 py-1 rounded-full border border-zinc-700 bg-zinc-950/40 hover:bg-zinc-800 transition-colors"
                            aria-label={`Next action (demo): ${a}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Approval / Audit Log (Scaffolding)</div>
                <div className="text-sm text-zinc-400">This prototype shows the labels used for accountability. In production, this log is per content item.</div>
                <div className="mt-5 space-y-3">
                  {demoData.auditLog.map((e) => (
                    <div key={e.id} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-medium text-white">Approved {e.version} (sample)</div>
                        <div className="text-xs text-zinc-500">{e.timestamp}</div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">Approver: {e.approver}</div>
                      <div className="mt-2 text-xs text-zinc-300">Notes: {e.notes}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-zinc-500">Label format example: “Approved v3 on DD MMM YYYY”.</div>
              </div>
            </div>

            <div className="bg-[#111827] border border-zinc-800 rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-6 py-4 font-normal">Topic</th>
                    <th className="px-6 py-4 font-normal">Category</th>
                    <th className="px-6 py-4 font-normal">Stage</th>
                    <th className="px-6 py-4 font-normal">Planned Outputs</th>
                    <th className="px-6 py-4 font-normal">Doctor</th>
                    <th className="px-6 py-4 font-normal">Compliance</th>
                    <th className="px-6 py-4 font-normal">Next Actions (Demo)</th>
                    <th className="px-6 py-4 font-normal">Approval / Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {demoData.pipeline.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/50">
                      <td className="px-6 py-4 font-medium max-w-[280px]">{item.topic}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{item.category}</td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(
                          item.stage,
                          item.stage.includes("Ready") ||
                            item.stage.includes("Approved")
                            ? "clear"
                            : "warning",
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.outputs.map((o) => (
                            <span key={`${item.id}-${o}`} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded">{o}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">{item.doctorApproval}</td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(
                          item.complianceStatus,
                          item.complianceStatus === "Clear" ? "clear" : "warning",
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.nextActions.map((a) => (
                            <button
                              key={`${item.id}-${a}`}
                              type="button"
                              className="text-[10px] px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 transition-colors"
                              aria-label={`Next action (demo): ${a}`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{item.auditSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-zinc-500 flex gap-4">
              <div>Filters: Category • Stage • Priority • Compliance Status</div>
              <div className="text-emerald-500">Demo data — all items fictional</div>
            </div>
          </div>
        )}

        {/* REEL REPURPOSING */}
        {activeTab === "repurposing" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Existing Reel Repurposing</h2>
              <p className="text-zinc-400 mt-2">Repurpose existing doctor-authored clips into platform-safe educational assets (titles, descriptions, captions). All outputs remain drafts until compliance review and doctor approval are complete.</p>
              <div className="mt-3 text-xs text-zinc-500">Demo disclaimer: previews shown here are samples and not connected to live accounts.</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {demoData.repurposing.map((item) => (
                <div key={item.id} className="bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                  <div className="uppercase text-xs tracking-[1px] text-amber-400 mb-3">SAMPLE PREVIEW ONLY</div>
                  
                  <div className="font-semibold text-xl tracking-tight mb-4">{item.originalTopic}</div>
                  
                  <div className="text-xs text-zinc-500 mb-2">Original: Instagram Reel</div>
                  <div className="text-xs mb-6">Repurposed as: {item.repurposedAs.join(" • ")}</div>

                  <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">YOUTUBE TITLE</div>
                      <div className="font-medium text-white">{item.youtubeTitle}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">DESCRIPTION</div>
                      <div className="text-zinc-300 leading-relaxed">{item.description}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">COMPLIANCE NOTES</div>
                      <div className="text-emerald-400 text-xs">{item.complianceNotes.join(" • ")}</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 text-[10px] text-amber-400">Prototype preview only. Do not publish without compliance review and doctor approval.</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLIANCE REVIEW */}
        {activeTab === "compliance" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">Ethics & Content Safety Review</h2>
              <p className="text-zinc-400 mt-2">Every draft is reviewed for avoidable advertising risk, privacy risk, and claim safety before publishing. Final medical approval remains with the doctor and is required.</p>
              <div className="mt-3 text-xs text-zinc-500">Prototype note: this checklist is an expanded scaffolding view; it does not replace medical/legal review.</div>
            </div>

            <div className="space-y-4">
              {demoData.compliance.map((item) => (
                <div key={item.id} className="bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                  <div className="flex justify-between">
                    <div className="font-semibold text-lg tracking-tight pr-8">{item.contentTitle}</div>
                    <div>
                      {renderStatusBadge(
                        item.status,
                        item.status === "Clear" ? "clear" : "warning",
                      )}
                    </div>
                  </div>

                  {item.flags.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <div className="text-xs text-amber-400 mb-3">RISK FLAGS</div>
                      <ul className="text-sm space-y-2 text-zinc-300">
                        {item.flags.map((flag) => (
                          <li key={flag} className="flex gap-2">
                            • {flag}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-4 bg-zinc-900 rounded-2xl text-xs text-emerald-400">
                        Suggested fix: {item.suggestedFix}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 text-xs text-zinc-500 flex gap-6">
                    <div>✓ No superlative claims</div>
                    <div>✓ No guaranteed outcomes</div>
                    <div>✓ Educational tone</div>
                    <div>✓ No testimonials / endorsements</div>
                    <div>✓ No patient-identifiable details</div>
                    <div>✓ No solicitation CTAs</div>
                    <div>✓ Doctor approval required</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xs text-center text-zinc-500">All reviews are demo samples. Publishing is blocked until doctor sign-off is recorded in the audit log.</div>
          </div>
        )}

        {/* VISIBILITY MAP */}
        {activeTab === "map" && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold tracking-tight">Regional Visibility Map</h2>
              <p className="text-zinc-400 mt-2">Sample regional visibility model. This view uses demo signals and does not represent live rankings.</p>
              <div className="mt-3 text-xs text-zinc-500">Prototype disclaimer: verified measurement requires connected profiles and baseline tracking after onboarding.</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">NCR • HARYANA • RAJASTHAN • UP • BIHAR</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {demoData.mapNodes.map((node, idx) => (
                    <button
                      key={node.id ?? idx}
                      onClick={(e) => {
                        modalTriggerRef.current = e.currentTarget;
                        setSelectedMapNode(node);
                      }}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-3xl p-6 text-left transition-all active:scale-[0.985]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-lg tracking-tight">
                            {node.city}
                            <span className="text-zinc-400 font-normal">, {node.state}</span>
                          </div>
                          <div className="mt-1 text-[11px] text-zinc-500 flex items-center gap-2">
                            <span className="uppercase tracking-widest">Status</span>
                            <span className="text-zinc-300">{node.status}</span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          node.status === "Green" ? "bg-emerald-500" :
                          node.status === "Yellow" ? "bg-amber-500" :
                          node.status === "Red" ? "bg-red-500" : "bg-blue-500"
                        }`} />
                      </div>
                      <div className="mt-4 text-xs text-zinc-400 line-clamp-2">{node.currentGap}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">HOW TO READ</div>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>Stronger signals (sample) — education content coverage appears healthier</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-amber-500 mt-0.5 flex-shrink-0" />
                    <div>Mixed signals (sample) — opportunity to strengthen with more educational assets</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-red-500 mt-0.5 flex-shrink-0" />
                    <div>Weaker signals (sample) — prioritize new educational assets and FAQs</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-blue-500 mt-0.5 flex-shrink-0" />
                    <div>Content opportunity (sample) — new topic with clear education demand</div>
                  </div>
                </div>
              </div>
            </div>

            {selectedMapNode && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
                onClick={closeMapModal}
              >
                <div
                  ref={modalPanelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="map-node-title"
                  className="bg-[#111827] border border-zinc-700 rounded-3xl p-10 max-w-md w-full mx-4 outline-none"
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div id="map-node-title" className="text-2xl font-semibold tracking-tight mb-1">
                    {selectedMapNode.city}, {selectedMapNode.state}
                  </div>
                  <div className="text-sm text-zinc-400 mb-6">{selectedMapNode.searchIntent[0]}</div>

                  <div className="space-y-5 text-sm">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">CURRENT GAP</div>
                      <div>{selectedMapNode.currentGap}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">SUGGESTED CONTENT</div>
                      <div className="text-white">{selectedMapNode.suggestedContent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">RECOMMENDED PLATFORMS</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMapNode.recommendedPlatforms.map((p) => (
                          <span key={p} className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    ref={modalCloseButtonRef}
                    onClick={closeMapModal}
                    className="mt-8 w-full py-3 text-sm border border-zinc-700 rounded-2xl hover:bg-zinc-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KEYWORD TRACKER */}
        {activeTab === "keywords" && (
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Keyword & Topic Tracker (Signals)</h2>
            <div className="text-xs text-zinc-500 mb-6">Demo disclaimer: this table shows sample visibility signals, not guaranteed outcomes or live rankings.</div>
            
            <div className="bg-[#111827] border border-zinc-800 rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-6 py-4">Keyword / Search Question</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Signals (Sample)</th>
                    <th className="px-6 py-4">Competitor</th>
                    <th className="px-6 py-4">Recommended Action</th>
                    <th className="px-6 py-4">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm">
                  {demoData.keywords.map((k) => (
                    <tr key={`${k.keyword}-${k.region}`}>
                      <td className="px-6 py-4 font-medium">{k.keyword}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{k.category}</td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(
                          k.currentVisibility,
                          k.currentVisibility === "Partial" ? "warning" : "danger",
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">{k.competitorStrength}</td>
                      <td className="px-6 py-4 text-emerald-400 text-xs">{k.recommendedAction}</td>
                      <td className="px-6 py-4">{renderStatusBadge(k.priority, "info")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPETITOR SNAPSHOT */}
        {activeTab === "competitors" && (
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Competitor Snapshot</h2>
            <p className="text-sm text-zinc-400 mb-2">Comparative review (demo). No accusations; this view helps avoid tone, privacy, and compliance risks.</p>
            <div className="text-xs text-zinc-500 mb-6">Prototype disclaimer: competitor signals are illustrative and not a claim of performance.</div>

            <div className="bg-[#111827] border border-zinc-800 rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                    <th className="px-6 py-4 text-left">Competitor</th>
                    <th className="px-6 py-4">Website</th>
                    <th className="px-6 py-4">YouTube</th>
                    <th className="px-6 py-4">Instagram</th>
                    <th className="px-6 py-4">Opportunity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {demoData.competitors.map((c) => (
                    <tr key={c.name}>
                      <td className="px-6 py-5 font-medium">{c.name}</td>
                      <td className="px-6 py-5 text-xs">{c.website}</td>
                      <td className="px-6 py-5 text-xs">{c.youtube}</td>
                      <td className="px-6 py-5 text-xs">{c.instagram}</td>
                      <td className="px-6 py-5 text-emerald-400 text-xs">{c.opportunity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MONTHLY REPORT */}
        {activeTab === "report" && (
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Monthly Review (Prototype) — Demo Month</h2>
            <div className="text-xs text-zinc-500 mb-6">This is a proposed reporting format. Actual reporting requires connected accounts and baseline tracking after onboarding.</div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="text-xs text-zinc-500">REELS RECORDED</div>
                <div className="text-6xl font-semibold tracking-tighter mt-3 text-white">24</div>
              </div>
              <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-8">
                <div className="text-xs text-zinc-500">REELS PUBLISHED</div>
                <div className="text-6xl font-semibold tracking-tighter mt-3 text-white">18</div>
              </div>
            </div>

            <div className="bg-[#111827] border border-zinc-800 rounded-3xl p-8 space-y-8 text-sm">
              <div>
                <div className="text-xs text-zinc-500 mb-3">OUTPUT SUMMARY</div>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>YouTube Shorts prepared: <span className="font-medium text-white">18</span></div>
                  <div>Website FAQs suggested: <span className="font-medium text-white">8</span></div>
                  <div>GBP posts suggested: <span className="font-medium text-white">4</span></div>
                  <div>Content reviewed: <span className="font-medium text-white">22</span></div>
                  <div>Pending doctor approvals: <span className="font-medium text-amber-400">6</span></div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <div className="text-xs text-zinc-500 mb-3">VISIBILITY MOVEMENT</div>
                <div className="text-emerald-400">{demoData.monthlyReport.visibilitySignals} • Top regions (sample): Gurugram, Delhi • Weaker signals (sample): Faridabad</div>
                <div className="mt-2 text-xs text-zinc-500">Signals shown are sample placeholders and do not imply guaranteed rankings.</div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <div className="text-xs text-zinc-500 mb-3">NEXT MONTH PLAN</div>
                <div className="text-white">Themes: Prostate Health, Robotic Urology, Men’s Health Awareness<br />Shoot dates: 28 Apr, 5 May • Required input: Script approval for prostate topics</div>
              </div>
            </div>

            <div className="text-xs text-center text-zinc-500 mt-8">This report is a demo sample. Real monthly reports will include verified search console data, platform analytics, and doctor-approved content metrics.</div>
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 py-6 text-xs text-center text-zinc-500">
        BluePanda Visibility Prototype • Demo data and sample signals only • No ranking guarantees • Publishing is gated by compliance review + doctor approval
      </footer>
    </div>
  );
}
