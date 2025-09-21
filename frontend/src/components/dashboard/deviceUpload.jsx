import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { deviceAPI } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  CloudUpload,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  Info,
  MapPin,
  Building,
  Settings,
  Zap,
  File,
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  FileSignature,
  Download,
  Send,
  PenTool,
} from "lucide-react";

// Import Owen's signature image (you'll need to add this to your assets)
import owensig from "../../assets/owensig.png";

// Move Input component outside the main component
const Input = ({
  label,
  name,
  type = "text",
  required = false,
  error,
  helperText,
  multiline,
  rows,
  placeholder,
  disabled,
  ...props
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {multiline ? (
      <textarea
        name={name}
        rows={rows || 3}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? "border-red-300" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    ) : (
      <input
        name={name}
        type={type}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? "border-red-300" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    )}
    {(error || helperText) && (
      <p className={`text-xs ${error ? "text-red-600" : "text-gray-500"}`}>
        {error || helperText}
      </p>
    )}
  </div>
);

// Move Select component outside the main component
const Select = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between ${
            error ? "border-red-300" : "border-gray-300"
          } ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }`}
          disabled={disabled}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value
              ? options.find((opt) => opt[0] === value)?.[1] || value
              : `Select ${label.toLowerCase()}`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {options.map(([optValue, optLabel]) => (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onChange(name, optValue);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                >
                  {optLabel}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

const DeviceUploadStepper = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [technologyOptions, setTechnologyOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState(null); // 'sign-now' or 'sign-later'
  const user = useSelector((state) => state.auth.user);
  const signaturePadRef = useRef(null);
  const termsRef = useRef(null);

  // Terms and Conditions state
  const [termsData, setTermsData] = useState({
    effectiveDate: new Date().toISOString().split("T")[0],
    executionDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    partyA: {
      name: "Owen Mutero",
      position: "Managing Director",
      signature: owensig, // This will be the imported PNG
    },
    partyB: {
      companyName: "",
      name: "",
      position: "",
      signature: null,
    },
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsSection, setShowTermsSection] = useState(false);

  const [errors, setErrors] = useState({
    device_name: "",
    issuer_organisation: "",
    fuel_type: "",
    technology_type: "",
    capacity: "",
    commissioning_date: "",
    effective_date: "",
    address: "",
    country: "",
    latitude: "",
    longitude: "",
    postcode: "",
    documents: "",
    number_of_generating_units: "",
    meter_ids: "",
    carbon_offset_registration: "",
    onsite_consumer_details: "",
    auxiliary_energy_details: "",
    funding_end_date: "",
    termsCompanyName: "",
    termsName: "",
    termsPosition: "",
    termsSignature: "",
  });

  const initialFormState = {
    device_name: "",
    issuer_organisation: "",
    default_account_code: user?.id || "",
    fuel_type: "",
    technology_type: "",
    capacity: "",
    commissioning_date: "",
    effective_date: "",
    address: "",
    country: "",
    latitude: "",
    longitude: "",
    postcode: "",
    additional_notes: "",
    number_of_generating_units: 1,
    meter_ids: "",
    network_owner: "",
    connection_voltage: "",
    grid_connection_details: "",
    volume_evidence_type: "Metering",
    volume_evidence_other: "",
    carbon_offset_registration: "",
    labelling_scheme: "",
    onsite_consumer: "No",
    onsite_consumer_details: "",
    auxiliary_energy: "No",
    auxiliary_energy_details: "",
    electricity_import_details: "",
    documents: {
      sf02: null,
      sf02c: null,
      metering: null,
      diagram: null,
      photos: null,
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  const steps = [
    {
      id: 0,
      title: "General",
      shortTitle: "General",
      icon: Info,
    },
    {
      id: 1,
      title: "Technical",
      shortTitle: "Technical",
      icon: Settings,
    },
    {
      id: 2,
      title: "Location",
      shortTitle: "Location",
      icon: MapPin,
    },
    {
      id: 3,
      title: "Grid",
      shortTitle: "Grid",
      icon: Zap,
    },
    {
      id: 4,
      title: "Business",
      shortTitle: "Business",
      icon: Building,
    },
    {
      id: 5,
      title: "Documents & Terms",
      shortTitle: "Docs & Terms",
      icon: File,
    },
  ];

  const DOCUMENT_TYPES = [
    {
      id: "sf02c",
      label: "SF-02C Owner's Declaration",
      shortLabel: "SF-02C Form",
      required: true,
      accept: ".pdf,.doc,.docx",
      description: "Declaration of ownership",
    },
    {
      id: "metering",
      label: "Metering Evidence",
      shortLabel: "Metering",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      description: "Electricity metering confirmation",
    },
    {
      id: "diagram",
      label: "Single Line Diagram",
      shortLabel: "Diagram",
      required: true,
      accept: ".pdf,.dwg,.dxf",
      description: "Electrical system diagram",
    },
    {
      id: "photos",
      label: "Project Photos",
      shortLabel: "Photos",
      required: true,
      accept: "image/*",
      description: "Photos of installation",
    },
  ];

  const VOLUME_EVIDENCE_CHOICES = [
    ["Metering", "Metering data"],
    ["Invoice", "Contract sales invoice"],
    ["Other", "Other"],
  ];

  const ONSITE_CONSUMER_CHOICES = [
    ["Yes", "Yes"],
    ["No", "No"],
  ];

  const AUXILIARY_ENERGY_CHOICES = [
    ["Yes", "Yes"],
    ["No", "No"],
  ];

  const fuelTechnologyMap = {
    Solar: ["TC110", "TC120", "TC130", "TC140"],
    Wind: ["TC210", "TC220"],
    Hydro: ["TC310", "TC320", "TC330"],
    Biomas: ["TC410", "TC411", "TC421", "TC422", "TC423", "TC424"],
    Geothermal: ["TC510", "TC520", "TC530"],
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const handleNext = () => {
    if (activeStep === 5 && showTermsSection) {
      // Don't auto-advance from terms section
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

const handleDownloadDocument = (apiEndpoint, filePath, customFileName = null) => {
  // Create download link
  const link = document.createElement('a');
  link.href = filePath;
  link.download = customFileName || filePath.split('/').pop() || 'document';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const updates = { [name]: value };

        // Handle dependent field updates in a single state update
        if (name === "public_funding" && value === "None") {
          updates.funding_end_date = "";
        } else if (name === "onsite_consumer" && value === "No") {
          updates.onsite_consumer_details = "";
        } else if (name === "auxiliary_energy" && value === "No") {
          updates.auxiliary_energy_details = "";
        } else if (name === "volume_evidence_type" && value !== "Other") {
          updates.volume_evidence_other = "";
        }

        return {
          ...prev,
          ...updates,
        };
      });

      // Clear errors for the changed field
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (docType, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file,
      },
    }));

    if (errors.documents) {
      setErrors((prev) => ({
        ...prev,
        documents: "",
      }));
    }
  };

  const handleFileRemove = (docType) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null,
      },
    }));
  };

  const validateDecimal = (value, before, after) => {
    if (value === "") return true;
    const regex = new RegExp(`^-?\\d{0,${before}}(\\.\\d{0,${after}})?$`);
    return regex.test(value);
  };

  const handleDecimalChange = (name, value, before, after) => {
    const isValid = validateDecimal(value, before, after);

    setErrors((prev) => ({
      ...prev,
      [name]: isValid
        ? ""
        : `Maximum ${before} digits before and ${after} after decimal point`,
    }));

    if (isValid || value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setTermsData((prev) => ({
      ...prev,
      partyB: { ...prev.partyB, signature: null },
    }));
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const signatureData = signaturePadRef.current.toDataURL();
      setTermsData((prev) => ({
        ...prev,
        partyB: { ...prev.partyB, signature: signatureData },
      }));
      toast.success("Signature saved");
    } else {
      toast.error("Please provide a signature");
    }
  };

  const generateTermsPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 5;
    let yPosition = margin;

    // Helper function to add text with automatic page breaks
    const addText = (text, fontSize = 10, isBold = false, indent = 0) => {
      pdf.setFontSize(fontSize);
      pdf.setFont(undefined, isBold ? "bold" : "normal");

      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - indent);
      lines.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + indent, yPosition);
        yPosition += lineHeight;
      });
    };

    // Title
    addText(
      "Terms and Conditions for Renewable Energy Device Registration",
      14,
      true
    );
    yPosition += 5;

    // Effective Date
    addText(`Effective Date: ${termsData.effectiveDate}`, 11);
    yPosition += 5;

    // Introduction
    const introText = `These Terms and Conditions (the "T&Cs") govern your access to and use of the RED Registration and REC Issuance Platform (the "Platform") and the contractual relationship between the following parties:

• Party A: Silver Carbon P/L, the party responsible for registering Renewable Energy Devices/facilities (REDs) and facilitating verification and issuance of Renewable Energy Certificates (RECs) on the REC Registry, under Party A's account.

• Party B: ${
      termsData.partyB.companyName || "[Registered Entity Name]"
    }, the party providing REDs, supplying documentation, maintaining operational REDs, and cooperating with Party A in the issuance and transfer of RECs.

Collectively, Party A and Party B shall be referred to as the "Parties" and individually as a "Party".

By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these T&Cs.`;

    addText(introText);
    yPosition += 5;

    // Section 1: Definitions
    addText("1. Definitions", 11, true);
    yPosition += 2;

    const definitions = [
      '"RED" means a Renewable Energy Device or facility that generates renewable electricity and qualifies for RECs.',
      '"REC" means Renewable Energy Certificate representing the environmental attributes of electricity generated by a RED.',
      '"Registry" means the REC registries or issuance bodies to which REDs are registered and RECs are issued.',
      '"Issuance" means the process by which RECs are created and recorded on the Registry.',
      '"Deal Notes / Sales Agreement" means the agreement documenting the sale of RECs between a buyer and seller.',
      '"Platform" means the online system operated by the Platform Operator for registration, issuance, trading, and transfers of RECs.',
      '"Platform Operator" means the operator/administrator of the Platform.',
      '"Fees" means the charges payable in connection with registration, issuance, verification, transfer, and platform use.',
      '"Party A Account" means the account under Party A used to interact with the Registry and Platform.',
      '"Parties\' Confidential Information" means non-public information exchanged under these T&Cs.',
    ];

    definitions.forEach((def) => {
      addText(`• ${def}`, 9, false, 5);
    });
    yPosition += 3;

    // Section 2: Scope of Agreement
    addText("2. Scope of Agreement", 11, true);
    yPosition += 2;
    addText(
      "These T&Cs govern: (a) the registration of REDs by Party A, (b) the issuance/verification of RECs on the Registry, (c) the transfer of RECs to buyers' accounts in accordance with Deal Notes or Sales Agreements, and (d) the execution of REC trading and related platform activities."
    );
    addText(
      "These T&Cs operate in conjunction with Platform policies. In case of inconsistency, the order of precedence is: applicable law, these T&Cs, Platform policies, and any applicable Deal Notes/Sales Agreements."
    );
    yPosition += 3;

    // Section 3: Roles and Duties
    addText("3. Roles and Duties", 11, true);
    yPosition += 2;

    addText("3.1 Party A – Registration and Issuance Facilitator", 10, true);
    yPosition += 2;
    const partyADuties = [
      "Verification Facilitation: Undertake tasks necessary to facilitate the issuance and trading of RECs.",
      "REC Issuance and Registry Connectivity: Ensure timely issuance of RECs and maintain connectivity to the Registry.",
      "Transfer of RECs: Transfer RECs to buyers in accordance with applicable Deal Notes or Sales Agreements.",
      "Payment of Fees: Make payments for registration, verification, and issuance fees.",
      "Platform Execution: Execute platform-related activities to support REC issuance, transfer, and trading.",
    ];
    partyADuties.forEach((duty) => {
      addText(`• ${duty}`, 9, false, 5);
    });
    yPosition += 3;

    addText("3.2 Party B – RED Provider", 10, true);
    yPosition += 2;
    const partyBDuties = [
      "Provision of Documentation: Provide all relevant documents to Party A.",
      "Operational RED Availability: Ensure REDs are available and operational.",
      "Notification of RED Non-Performance: Immediately notify Party A of any RED non-performance.",
      "Cooperation and Data Provision: Provide timely cooperation and data for verification and issuance.",
      "Warranty of Ownership and Authority: Ensure right and authority to bring REDs into the REC program.",
    ];
    partyBDuties.forEach((duty) => {
      addText(`• ${duty}`, 9, false, 5);
    });
    yPosition += 3;

    // Sections 4-13
    const sections = [
      {
        title: "4. Registration, Issuance, and Transfer Mechanics",
        content:
          "Registration, issuance, and transfer shall be conducted in accordance with Registry rules and the I-REC framework. Party A shall undertake reasonable efforts to verify documentation; however, Party A shall not be liable for inaccuracies in information provided by Party B, except for gross negligence or wilful misconduct.",
      },
      {
        title: "5. Fees and Payments",
        content:
          "Fees for registration, verification, and issuance shall be borne by the platform operator.",
      },
      {
        title: "6. Compliance and Legal",
        content:
          "Both Parties shall comply with applicable laws and regulatory requirements related to REDs, RECs, registration, issuance, transfer, and trading, including anti-fraud, anti-money laundering, counter-terrorist financing, sanctions, data protection, and reporting requirements.",
      },
      {
        title: "7. Representations and Warranties",
        content:
          "Each Party represents it has the authority to enter into and perform under these T&Cs, and that performance will comply with all applicable laws and contractual obligations.",
      },
      {
        title: "8. Intellectual Property",
        content:
          "Each Party retains its own intellectual property rights. Any licenses granted are non-exclusive, non-transferable, and limited to RED registration, REC issuance, and REC trading purposes.",
      },
      {
        title: "9. Data Protection and Privacy",
        content:
          "Each Party shall comply with applicable data protection laws. Personal data shall be handled in accordance with the Platform's privacy policy and data processing agreements.",
      },
      {
        title: "10. Limitation of Liability",
        content:
          "Neither Party shall be liable for indirect or consequential damages. Direct damages limited to amounts paid in preceding twelve months, except for gross negligence, willful misconduct, or breach of data protection obligations.",
      },
      {
        title: "11. Force Majeure",
        content:
          "Neither Party liable for failure or delay due to events beyond reasonable control, provided notice is given and mitigation steps are taken.",
      },
      {
        title: "12. Term and Termination",
        content:
          "These T&Cs remain in effect for five years subject to renewal. Either Party may terminate on three months written notice for cause. Termination does not affect accrued rights or ongoing regulatory obligations.",
      },
      {
        title: "13. Data Retention and Recordkeeping",
        content:
          "Parties shall maintain records required by applicable law and regulatory authorities.",
      },
    ];

    sections.forEach((section) => {
      addText(section.title, 11, true);
      yPosition += 2;
      addText(section.content);
      yPosition += 3;
    });

    // Section 14: Exclusivity, Sale of RECs, and Commission
    addText("14. Exclusivity, Sale of RECs, and Commission", 11, true);
    yPosition += 2;

    addText("a) Exclusivity", 10, true);
    addText(
      "Party B grants Party A exclusive right as sole intermediary for sale, marketing, and facilitation of RECs generated from REDs registered under this Agreement."
    );
    yPosition += 2;

    addText("b) Commission and Payment Mechanics", 10, true);
    addText(
      "Party B entitled to commission equal to 30% of net revenue from REC sales. Payment within 5 calendar days following receipt of funds from purchaser."
    );
    yPosition += 2;

    addText("c) Confidentiality and Data", 10, true);
    addText(
      "Each Party shall treat all information exchanged as confidential."
    );
    yPosition += 2;

    addText("d) Termination and Survival", 10, true);
    addText(
      "Exclusivity and commission provisions survive termination to extent necessary for outstanding transactions."
    );
    yPosition += 3;

    // Sections 15-21
    const finalSections = [
      {
        title: "15. Dispute Resolution",
        content:
          "Disputes resolved by commercial arbitration in Harare, Zimbabwe, under CAC rules. Arbitration award final and binding.",
      },
      {
        title: "16. Governing Law and Jurisdiction",
        content:
          "These T&Cs governed by laws of Zimbabwe. Courts of Zimbabwe have jurisdiction for non-arbitrable matters.",
      },
      {
        title: "17. Insurance",
        content:
          "Parties may maintain appropriate insurance coverage for potential losses.",
      },
      {
        title: "18. Amendments and Updates",
        content:
          "Platform Operator may amend T&Cs from time to time. Material amendments communicated in advance.",
      },
      {
        title: "19. Miscellaneous",
        content:
          "Parties are independent contractors. Assignment requires prior written consent. Severability and waiver provisions apply.",
      },
      {
        title: "20. Notices",
        content:
          "Notices shall be in writing and delivered to addresses specified by each Party.",
      },
      {
        title: "21. Counterparts and Electronic Signatures",
        content:
          "T&Cs may be executed in counterparts and by electronic signature.",
      },
    ];

    finalSections.forEach((section) => {
      addText(section.title, 11, true);
      yPosition += 2;
      addText(section.content);
      yPosition += 3;
    });

    // Start new page for signatures
    pdf.addPage();
    yPosition = margin + 20;

    // Execution statement
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    const executionText = `THUS DONE AND EXECUTED ON THIS ${termsData.executionDate}`;
    pdf.text(executionText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Party A Signature Section
    pdf.setFont(undefined, "bold");
    pdf.text('SILVER CARBON PRIVATE LIMITED ("Party A")', margin, yPosition);
    yPosition += 15;

    if (termsData.partyA.signature) {
      pdf.addImage(
        termsData.partyA.signature,
        "PNG",
        margin,
        yPosition,
        50,
        25
      );
      yPosition += 30;
    } else {
      pdf.setFont(undefined, "normal");
      pdf.text("SIGNED: _______________________________", margin, yPosition);
      yPosition += 15;
    }

    pdf.setFont(undefined, "normal");
    pdf.text(`NAME: ${termsData.partyA.name}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`POSITION: ${termsData.partyA.position}`, margin, yPosition);

    // Party B Signature Section
    yPosition += 30;
    pdf.setFont(undefined, "bold");
    pdf.text(
      `${termsData.partyB.companyName || "[COMPANY NAME]"} ("Party B")`,
      margin,
      yPosition
    );
    yPosition += 15;

    if (termsData.partyB.signature) {
      pdf.addImage(
        termsData.partyB.signature,
        "PNG",
        margin,
        yPosition,
        50,
        25
      );
      yPosition += 30;
    } else {
      pdf.setFont(undefined, "normal");
      pdf.text("SIGNED: _______________________________", margin, yPosition);
      yPosition += 15;
    }

    pdf.setFont(undefined, "normal");
    pdf.text(`NAME: ${termsData.partyB.name || "[Name]"}`, margin, yPosition);
    yPosition += 8;
    pdf.text(
      `POSITION: ${termsData.partyB.position || "[Position]"}`,
      margin,
      yPosition
    );

    return pdf;
  };

  const handleSubmitWithTerms = async () => {
    // Validate terms data
    let termsErrors = {};
    if (!termsData.partyB.companyName) {
      termsErrors.termsCompanyName = "Company name is required";
    }
    if (!termsData.partyB.name) {
      termsErrors.termsName = "Full name is required";
    }
    if (!termsData.partyB.position) {
      termsErrors.termsPosition = "Position is required";
    }
    if (!termsData.partyB.signature) {
      termsErrors.termsSignature = "Signature is required";
    }

    if (Object.keys(termsErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...termsErrors }));
      toast.error("Please complete all terms fields and provide signature");
      return;
    }

    setIsSubmitting(true);
    setSubmitType("sign-now");

    try {
      // Generate PDF
      const pdf = await generateTermsPDF();
      const pdfBlob = pdf.output("blob");

      // Submit device
      await submitDevice();

      // Download PDF
      pdf.save(
        `Terms_${termsData.partyB.companyName}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Send email with PDF (you'll need to implement the backend endpoint)
      const formDataEmail = new FormData();
      formDataEmail.append("pdf", pdfBlob, "terms.pdf");
      formDataEmail.append("userEmail", user.email);
      formDataEmail.append("adminEmail", "admin@silvercarbon.com");

      // await deviceAPI.sendTermsEmail(formDataEmail);

      toast.success("Device uploaded and terms document sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitType(null);
    }
  };

  const handleSubmitLater = async () => {
    setIsSubmitting(true);
    setSubmitType("sign-later");

    try {
      // Submit device
      await submitDevice();

      // Generate unsigned PDF
      const pdf = await generateTermsPDF();

      // Send unsigned PDF to user email
      const pdfBlob = pdf.output("blob");
      const formDataEmail = new FormData();
      formDataEmail.append("pdf", pdfBlob, "terms_unsigned.pdf");
      formDataEmail.append("userEmail", user.email);
      formDataEmail.append("unsigned", true);

      // await deviceAPI.sendTermsEmail(formDataEmail);

      toast.success(
        "Device uploaded! Unsigned terms document sent to your email."
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitType(null);
    }
  };

  const submitDevice = async () => {
    const formDataToSend = new FormData();

    // Append form fields
    const fields = [
      "device_name",
      "issuer_organisation",
      "default_account_code",
      "fuel_type",
      "technology_type",
      "capacity",
      "commissioning_date",
      "effective_date",
      "address",
      "country",
      "postcode",
      "additional_notes",
      "number_of_generating_units",
      "meter_ids",
      "network_owner",
      "connection_voltage",
      "grid_connection_details",
      "volume_evidence_type",
      "volume_evidence_other",
      "carbon_offset_registration",
      "labelling_scheme",
      "onsite_consumer",
      "onsite_consumer_details",
      "auxiliary_energy",
      "auxiliary_energy_details",
      "electricity_import_details",
    ];

    fields.forEach((field) => {
      formDataToSend.append(field, formData[field]);
    });

    formDataToSend.append("latitude", parseFloat(formData.latitude).toFixed(6));
    formDataToSend.append(
      "longitude",
      parseFloat(formData.longitude).toFixed(6)
    );

    // Append files
    const fileFields = {
      sf02: "production_facility_registration",
      sf02c: "declaration_of_ownership",
      metering: "metering_evidence",
      diagram: "single_line_diagram",
      photos: "project_photos",
    };

    Object.entries(fileFields).forEach(([frontendKey, backendKey]) => {
      if (formData.documents[frontendKey]) {
        formDataToSend.append(backendKey, formData.documents[frontendKey]);
      }
    });

    const response = await deviceAPI.create(formDataToSend);
    await deviceAPI.submit(response.data.id);
  };

  const handleSubmit = async () => {
    // Original validation logic
    let newErrors = {};
    let hasErrors = false;

    const requiredFields = [
      "device_name",
      "issuer_organisation",
      "fuel_type",
      "technology_type",
      "capacity",
      "commissioning_date",
      "effective_date",
      "address",
      "country",
      "latitude",
      "longitude",
      "postcode",
      "meter_ids",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        hasErrors = true;
      }
    });

    // Document validation
    const requiredDocuments = DOCUMENT_TYPES.filter((doc) => doc.required).map(
      (doc) => doc.id
    );
    const missingDocuments = requiredDocuments.filter(
      (doc) => !formData.documents[doc]
    );

    if (missingDocuments.length > 0) {
      const missingLabels = missingDocuments.map(
        (doc) => DOCUMENT_TYPES.find((d) => d.id === doc).shortLabel
      );
      newErrors.documents = `Missing: ${missingLabels.join(", ")}`;
      hasErrors = true;
      toast.error(`Missing required documents: ${missingLabels.join(", ")}`);
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    if (hasErrors) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      toast.error("Please correct the errors before submitting");
      return;
    }

    // Show terms section after validation passes
    setShowTermsSection(true);
    toast.info("Please review and sign the Terms and Conditions");
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return formData.device_name && formData.issuer_organisation;
      case 1:
        return (
          formData.fuel_type &&
          formData.technology_type &&
          formData.capacity &&
          formData.commissioning_date &&
          formData.effective_date
        );
      case 2:
        return (
          formData.address &&
          formData.country &&
          formData.latitude &&
          formData.longitude &&
          formData.postcode
        );
      case 3:
        return [
          formData.meter_ids,
          formData.volume_evidence_type,
          formData.volume_evidence_type !== "Other" ||
            formData.volume_evidence_other,
        ].every(Boolean);
      case 4:
        return [
          formData.onsite_consumer,
          formData.auxiliary_energy,
          formData.onsite_consumer === "Yes"
            ? formData.onsite_consumer_details
            : true,
          formData.auxiliary_energy === "Yes"
            ? formData.auxiliary_energy_details
            : true,
        ].every(Boolean);
      case 5:
        return DOCUMENT_TYPES.filter((doc) => doc.required).every(
          (doc) => formData.documents[doc.id]
        );
      default:
        return false;
    }
  };

  useEffect(() => {
    if (formData.fuel_type) {
      deviceAPI
        .getTechnologyOptions(formData.fuel_type)
        .then((response) => {
          setTechnologyOptions(response.data.options);
        })
        .catch((error) => {
          console.error("Error fetching technology options:", error);
          toast.error("Failed to fetch technology options");
        });
    }
  }, [formData.fuel_type]);

  // Step content components
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-1"
          >
            <div className="bg-white rounded-sm border border-gray-200 p-6">
              <div className="flex items-center text-blue-600 mb-4">
                <Info className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Device Information</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Device Name"
                  name="device_name"
                  value={formData.device_name}
                  onChange={handleInputChange}
                  required
                  error={errors.device_name}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organisation"
                    name="issuer_organisation"
                    value={formData.issuer_organisation}
                    onChange={handleInputChange}
                    required
                    error={errors.issuer_organisation}
                  />

                  <Input
                    label="Account ID"
                    name="default_account_code"
                    value={formData.default_account_code}
                    disabled
                    helperText="Automatically assigned to your account"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-1"
          >
            <div className="bg-white rounded-sm border border-gray-200 p-6">
              <div className="flex items-center text-blue-600 mb-4">
                <Zap className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">
                  Technical Specifications
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Fuel Type"
                    name="fuel_type"
                    options={Object.keys(fuelTechnologyMap).map((fuel) => [
                      fuel,
                      fuel,
                    ])}
                    value={formData.fuel_type}
                    onChange={handleSelectChange}
                    required
                    error={errors.fuel_type}
                  />

                  <Select
                    label="Technology Type"
                    name="technology_type"
                    options={technologyOptions.map((tech) => [
                      tech.value,
                      tech.label,
                    ])}
                    value={formData.technology_type}
                    onChange={handleSelectChange}
                    required
                    disabled={!formData.fuel_type}
                    error={errors.technology_type}
                  />
                </div>

                <hr className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={(e) =>
                          handleDecimalChange("capacity", e.target.value, 4, 6)
                        }
                        className={`w-full px-3 py-2 pr-12 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.capacity ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 text-sm">MW</span>
                      </div>
                    </div>
                    {errors.capacity && (
                      <p className="text-xs text-red-600">{errors.capacity}</p>
                    )}
                  </div>

                  <Input
                    label="Commissioning Date"
                    name="commissioning_date"
                    type="date"
                    value={formData.commissioning_date}
                    onChange={handleInputChange}
                    required
                    error={errors.commissioning_date}
                  />

                  <Input
                    label="Effective Date"
                    name="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={handleInputChange}
                    required
                    error={errors.effective_date}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center text-blue-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Location Information</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  error={errors.address}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    error={errors.country}
                  />

                  <Input
                    label="Postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    error={errors.postcode}
                  />
                </div>

                <hr className="my-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Geographical Coordinates
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={(e) => {
                      handleDecimalChange("latitude", e.target.value, 2, 6);
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && (value < -90 || value > 90)) {
                        setErrors((prev) => ({
                          ...prev,
                          latitude: "Must be between -90 and 90",
                        }));
                      }
                    }}
                    required
                    error={errors.latitude}
                    helperText="Range: -90.000000 to 90.000000"
                  />

                  <Input
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={(e) => {
                      handleDecimalChange("longitude", e.target.value, 3, 6);
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && (value < -180 || value > 180)) {
                        setErrors((prev) => ({
                          ...prev,
                          longitude: "Must be between -180 and 180",
                        }));
                      }
                    }}
                    required
                    error={errors.longitude}
                    helperText="Range: -180.000000 to 180.000000"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center text-blue-600 mb-4">
                <Zap className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">
                  Grid Connection & Metering
                </h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Meter Serial Number or Facility Name"
                  name="meter_ids"
                  value={formData.meter_ids}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                  error={errors.meter_ids}
                  helperText="Comma-separated list of meter IDs or facility name"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Network Owner"
                    name="network_owner"
                    value={formData.network_owner}
                    onChange={handleInputChange}
                    error={errors.network_owner}
                  />

                  <Input
                    label="Number of generating units"
                    name="connection_voltage"
                    value={formData.connection_voltage}
                    onChange={handleInputChange}
                    error={errors.connection_voltage}
                  />
                </div>

                <Input
                  label="Grid Connection Details"
                  name="grid_connection_details"
                  value={formData.grid_connection_details}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  error={errors.grid_connection_details}
                  helperText="Describe connection details if not directly connected to grid"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Volume Evidence Type"
                    name="volume_evidence_type"
                    options={VOLUME_EVIDENCE_CHOICES}
                    value={formData.volume_evidence_type}
                    onChange={handleSelectChange}
                    required
                    error={errors.volume_evidence_type}
                  />

                  {formData.volume_evidence_type === "Other" && (
                    <Input
                      label="Specify Evidence Type"
                      name="volume_evidence_other"
                      value={formData.volume_evidence_other}
                      onChange={handleInputChange}
                      required
                      error={errors.volume_evidence_other}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center text-blue-600 mb-4">
                <Building className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Business Operations</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="On-site Consumer"
                    name="onsite_consumer"
                    options={ONSITE_CONSUMER_CHOICES}
                    value={formData.onsite_consumer}
                    onChange={handleSelectChange}
                    required
                    error={errors.onsite_consumer}
                  />

                  {formData.onsite_consumer === "Yes" && (
                    <Input
                      label="Consumer Details"
                      name="onsite_consumer_details"
                      value={formData.onsite_consumer_details}
                      onChange={handleInputChange}
                      required
                      error={errors.onsite_consumer_details}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Auxiliary Energy"
                    name="auxiliary_energy"
                    options={AUXILIARY_ENERGY_CHOICES}
                    value={formData.auxiliary_energy}
                    onChange={handleSelectChange}
                    required
                    error={errors.auxiliary_energy}
                  />

                  {formData.auxiliary_energy === "Yes" && (
                    <Input
                      label="Auxiliary Energy Details"
                      name="auxiliary_energy_details"
                      value={formData.auxiliary_energy_details}
                      onChange={handleInputChange}
                      required
                      error={errors.auxiliary_energy_details}
                    />
                  )}
                </div>

                <Input
                  label="Electricity Import Details"
                  name="electricity_import_details"
                  value={formData.electricity_import_details}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  helperText="Describe alternative electricity import methods"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Carbon Offset Registration ID"
                    name="carbon_offset_registration"
                    value={formData.carbon_offset_registration}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Labelling Scheme"
                    name="labelling_scheme"
                    value={formData.labelling_scheme}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step-5"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {!showTermsSection ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center text-blue-600 mb-4">
                  <File className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium">
                    Required Documentation
                  </h3>
                </div>

                {errors.documents && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.documents}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadDocument(
                        null,
                        "/Owner's Declaration Form-2025.docx"
                      )
                    }
                    className="text-blue-600 underline"
                  >
                    Download SF-02 Document for Signing and Upload
                  </button>
                  <hr className="border-gray-200" />
                  {DOCUMENT_TYPES.map((doc) => (
                    <motion.div
                      key={doc.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        formData.documents[doc.id]
                          ? "border-green-300 bg-green-50"
                          : errors.documents &&
                            errors.documents.includes(doc.shortLabel)
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">
                              {window.innerWidth < 640
                                ? doc.shortLabel
                                : doc.label}
                            </h4>
                            {doc.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {doc.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {formData.documents[doc.id] && (
                            <div className="flex items-center text-green-600 flex-1 sm:flex-none min-w-0">
                              <FileText className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm ml-1 truncate">
                                {formData.documents[doc.id].name}
                              </span>
                              <button
                                onClick={() => handleFileRemove(doc.id)}
                                className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                              >
                                <X className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          )}

                          <input
                            accept={doc.accept}
                            style={{ display: "none" }}
                            id={doc.id}
                            type="file"
                            onChange={(e) =>
                              handleFileUpload(doc.id, e.target.files[0])
                            }
                          />
                          <label htmlFor={doc.id}>
                            <motion.button
                              type="button"
                              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                formData.documents[doc.id]
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                document.getElementById(doc.id).click()
                              }
                            >
                              <CloudUpload className="w-4 h-4 mr-1" />
                              {formData.documents[doc.id]
                                ? "Replace"
                                : "Upload"}
                            </motion.button>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <Input
                    label="Additional Notes"
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Add any relevant information about the device or documentation"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center text-blue-600 mb-4">
                    <FileSignature className="w-5 h-5 mr-2" />
                    <h3 className="text-lg font-medium">
                      Terms and Conditions Agreement
                    </h3>
                  </div>

                  {/* Full Terms Content */}
                  <div
                    className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto"
                    ref={termsRef}
                  >
                    <h4 className="font-bold text-lg text-gray-900 mb-4 text-center">
                      Terms and Conditions for Renewable Energy Device
                      Registration
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Effective Date: {termsData.effectiveDate}
                    </p>

                    <div className="text-sm text-gray-700 space-y-4">
                      {/* Introduction */}
                      <div>
                        <p className="mb-3">
                          These Terms and Conditions (the "T&Cs") govern your
                          access to and use of the RED Registration and REC
                          Issuance Platform (the "Platform") and the contractual
                          relationship between the following parties:
                        </p>
                        <ul className="list-disc ml-5 space-y-2">
                          <li>
                            <strong>Party A:</strong> Silver Carbon P/L, the
                            party responsible for registering Renewable Energy
                            Devices/facilities (REDs) and facilitating
                            verification and issuance of Renewable Energy
                            Certificates (RECs) on the REC Registry, under Party
                            A's account.
                          </li>
                          <li>
                            <strong>Party B:</strong>{" "}
                            {termsData.partyB.companyName || "[Your Company]"},
                            the party providing REDs, supplying documentation,
                            maintaining operational REDs, and cooperating with
                            Party A in the issuance and transfer of RECs.
                          </li>
                        </ul>
                        <p className="mt-3">
                          Collectively, Party A and Party B shall be referred to
                          as the "Parties" and individually as a "Party".
                        </p>
                        <p className="mt-2 font-semibold">
                          By accessing or using the Platform, you confirm that
                          you have read, understood, and agree to be bound by
                          these T&Cs.
                        </p>
                      </div>

                      {/* Section 1: Definitions */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          1. Definitions
                        </h5>
                        <ul className="list-disc ml-5 space-y-1 text-xs">
                          <li>
                            <strong>"RED"</strong> means a Renewable Energy
                            Device or facility that generates renewable
                            electricity and qualifies for RECs.
                          </li>
                          <li>
                            <strong>"REC"</strong> means Renewable Energy
                            Certificate representing the environmental
                            attributes of electricity generated by a RED.
                          </li>
                          <li>
                            <strong>"Registry"</strong> means the REC registries
                            or issuance bodies to which REDs are registered and
                            RECs are issued.
                          </li>
                          <li>
                            <strong>"Issuance"</strong> means the process by
                            which RECs are created and recorded on the Registry.
                          </li>
                          <li>
                            <strong>"Deal Notes / Sales Agreement"</strong>{" "}
                            means the agreement documenting the sale of RECs
                            between a buyer and seller.
                          </li>
                          <li>
                            <strong>"Platform"</strong> means the online system
                            operated by the Platform Operator for registration,
                            issuance, trading, and transfers of RECs.
                          </li>
                          <li>
                            <strong>"Platform Operator"</strong> means the
                            operator/administrator of the Platform.
                          </li>
                          <li>
                            <strong>"Fees"</strong> means the charges payable in
                            connection with registration, issuance,
                            verification, transfer, and platform use.
                          </li>
                          <li>
                            <strong>"Party A Account"</strong> means the account
                            under Party A used to interact with the Registry and
                            Platform.
                          </li>
                          <li>
                            <strong>"Parties' Confidential Information"</strong>{" "}
                            means non-public information exchanged under these
                            T&Cs.
                          </li>
                        </ul>
                      </div>

                      {/* Section 2: Scope of Agreement */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          2. Scope of Agreement
                        </h5>
                        <p className="text-xs">
                          These T&Cs govern: (a) the registration of REDs by
                          Party A, (b) the issuance/verification of RECs on the
                          Registry, (c) the transfer of RECs to buyers' accounts
                          in accordance with Deal Notes or Sales Agreements, and
                          (d) the execution of REC trading and related platform
                          activities.
                        </p>
                        <p className="text-xs mt-2">
                          These T&Cs operate in conjunction with Platform
                          policies. In case of inconsistency, the order of
                          precedence is: applicable law, these T&Cs, Platform
                          policies, and any applicable Deal Notes/Sales
                          Agreements.
                        </p>
                      </div>

                      {/* Section 3: Roles and Duties */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          3. Roles and Duties
                        </h5>

                        <h6 className="font-semibold text-sm mt-2 mb-1">
                          3.1 Party A – Registration and Issuance Facilitator
                        </h6>
                        <ul className="list-disc ml-5 space-y-1 text-xs">
                          <li>
                            <strong>Verification Facilitation:</strong>{" "}
                            Undertake tasks necessary to facilitate the issuance
                            and trading of RECs.
                          </li>
                          <li>
                            <strong>
                              REC Issuance and Registry Connectivity:
                            </strong>{" "}
                            Ensure timely issuance of RECs and maintain
                            connectivity to the Registry.
                          </li>
                          <li>
                            <strong>Transfer of RECs:</strong> Transfer RECs to
                            buyers in accordance with applicable Deal Notes or
                            Sales Agreements.
                          </li>
                          <li>
                            <strong>Payment of Fees:</strong> Make payments for
                            registration, verification, and issuance fees.
                          </li>
                          <li>
                            <strong>Platform Execution:</strong> Execute
                            platform-related activities to support REC issuance,
                            transfer, and trading.
                          </li>
                        </ul>

                        <h6 className="font-semibold text-sm mt-3 mb-1">
                          3.2 Party B – RED Provider
                        </h6>
                        <ul className="list-disc ml-5 space-y-1 text-xs">
                          <li>
                            <strong>Provision of Documentation:</strong> Provide
                            all relevant documents to Party A.
                          </li>
                          <li>
                            <strong>Operational RED Availability:</strong>{" "}
                            Ensure REDs are available and operational.
                          </li>
                          <li>
                            <strong>
                              Notification of RED Non-Performance:
                            </strong>{" "}
                            Immediately notify Party A of any RED
                            non-performance.
                          </li>
                          <li>
                            <strong>Cooperation and Data Provision:</strong>{" "}
                            Provide timely cooperation and data for verification
                            and issuance.
                          </li>
                          <li>
                            <strong>
                              Warranty of Ownership and Authority:
                            </strong>{" "}
                            Ensure right and authority to bring REDs into the
                            REC program.
                          </li>
                        </ul>
                      </div>

                      {/* Sections 4-13 */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          4. Registration, Issuance, and Transfer Mechanics
                        </h5>
                        <p className="text-xs">
                          Registration, issuance, and transfer shall be
                          conducted in accordance with Registry rules and the
                          I-REC framework. Party A shall undertake reasonable
                          efforts to verify documentation; however, Party A
                          shall not be liable for inaccuracies in information
                          provided by Party B, except for gross negligence or
                          wilful misconduct.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          5. Fees and Payments
                        </h5>
                        <p className="text-xs">
                          Fees for registration, verification, and issuance
                          shall be borne by the platform operator.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          6. Compliance and Legal
                        </h5>
                        <p className="text-xs">
                          Both Parties shall comply with applicable laws and
                          regulatory requirements related to REDs, RECs,
                          registration, issuance, transfer, and trading,
                          including anti-fraud, anti-money laundering,
                          counter-terrorist financing, sanctions, data
                          protection, and reporting requirements.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          7. Representations and Warranties
                        </h5>
                        <p className="text-xs">
                          Each Party represents it has the authority to enter
                          into and perform under these T&Cs, and that
                          performance will comply with all applicable laws and
                          contractual obligations.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          8. Intellectual Property
                        </h5>
                        <p className="text-xs">
                          Each Party retains its own intellectual property
                          rights. Any licenses granted are non-exclusive,
                          non-transferable, and limited to RED registration, REC
                          issuance, and REC trading purposes.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          9. Data Protection and Privacy
                        </h5>
                        <p className="text-xs">
                          Each Party shall comply with applicable data
                          protection laws. Personal data shall be handled in
                          accordance with the Platform's privacy policy and data
                          processing agreements.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          10. Limitation of Liability
                        </h5>
                        <p className="text-xs">
                          Neither Party shall be liable for indirect or
                          consequential damages. Direct damages limited to
                          amounts paid in preceding twelve months, except for
                          gross negligence, willful misconduct, or breach of
                          data protection obligations.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          11. Force Majeure
                        </h5>
                        <p className="text-xs">
                          Neither Party liable for failure or delay due to
                          events beyond reasonable control, provided notice is
                          given and mitigation steps are taken.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          12. Term and Termination
                        </h5>
                        <p className="text-xs">
                          These T&Cs remain in effect for five years subject to
                          renewal. Either Party may terminate on three months
                          written notice for cause. Termination does not affect
                          accrued rights or ongoing regulatory obligations.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          13. Data Retention and Recordkeeping
                        </h5>
                        <p className="text-xs">
                          Parties shall maintain records required by applicable
                          law and regulatory authorities.
                        </p>
                      </div>

                      {/* Section 14: Exclusivity, Sale of RECs, and Commission */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          14. Exclusivity, Sale of RECs, and Commission
                        </h5>

                        <h6 className="font-semibold text-sm mt-2 mb-1">
                          a) Exclusivity
                        </h6>
                        <p className="text-xs">
                          Party B grants Party A exclusive right as sole
                          intermediary for sale, marketing, and facilitation of
                          RECs generated from REDs registered under this
                          Agreement. Party B shall not sell or market RECs
                          outside the Platform without Party A's written
                          consent.
                        </p>

                        <h6 className="font-semibold text-sm mt-2 mb-1">
                          b) Commission and Payment Mechanics
                        </h6>
                        <p className="text-xs">
                          Party B entitled to commission equal to 30% of net
                          revenue from REC sales. Payment within 5 calendar days
                          following receipt of funds from purchaser.
                        </p>

                        <h6 className="font-semibold text-sm mt-2 mb-1">
                          c) Confidentiality and Data
                        </h6>
                        <p className="text-xs">
                          Each Party shall treat all information exchanged as
                          confidential.
                        </p>

                        <h6 className="font-semibold text-sm mt-2 mb-1">
                          d) Termination and Survival
                        </h6>
                        <p className="text-xs">
                          Exclusivity and commission provisions survive
                          termination to extent necessary for outstanding
                          transactions.
                        </p>
                      </div>

                      {/* Sections 15-21 */}
                      <div>
                        <h5 className="font-bold text-base mb-2">
                          15. Dispute Resolution
                        </h5>
                        <p className="text-xs">
                          Disputes resolved by commercial arbitration in Harare,
                          Zimbabwe, under CAC rules. Arbitration award final and
                          binding.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          16. Governing Law and Jurisdiction
                        </h5>
                        <p className="text-xs">
                          These T&Cs governed by laws of Zimbabwe. Courts of
                          Zimbabwe have jurisdiction for non-arbitrable matters.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          17. Insurance
                        </h5>
                        <p className="text-xs">
                          Parties may maintain appropriate insurance coverage
                          for potential losses.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          18. Amendments and Updates
                        </h5>
                        <p className="text-xs">
                          Platform Operator may amend T&Cs from time to time.
                          Material amendments communicated in advance.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          19. Miscellaneous
                        </h5>
                        <p className="text-xs">
                          Parties are independent contractors. Assignment
                          requires prior written consent. Severability and
                          waiver provisions apply.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          20. Notices
                        </h5>
                        <p className="text-xs">
                          Notices shall be in writing and delivered to addresses
                          specified by each Party.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-base mb-2">
                          21. Counterparts and Electronic Signatures
                        </h5>
                        <p className="text-xs">
                          T&Cs may be executed in counterparts and by electronic
                          signature.
                        </p>
                      </div>

                      {/* Execution Statement */}
                      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                        <p className="text-center font-semibold text-sm">
                          THUS DONE AND EXECUTED ON THIS{" "}
                          {termsData.executionDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Party B Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Party B Information
                    </h4>

                    <Input
                      label="Company Name"
                      value={termsData.partyB.companyName}
                      onChange={(e) =>
                        setTermsData((prev) => ({
                          ...prev,
                          partyB: {
                            ...prev.partyB,
                            companyName: e.target.value,
                          },
                        }))
                      }
                      required
                      error={errors.termsCompanyName}
                      placeholder="Enter your company name"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={termsData.partyB.name}
                        onChange={(e) =>
                          setTermsData((prev) => ({
                            ...prev,
                            partyB: { ...prev.partyB, name: e.target.value },
                          }))
                        }
                        required
                        error={errors.termsName}
                        placeholder="Enter signatory's full name"
                      />

                      <Input
                        label="Position/Title"
                        value={termsData.partyB.position}
                        onChange={(e) =>
                          setTermsData((prev) => ({
                            ...prev,
                            partyB: {
                              ...prev.partyB,
                              position: e.target.value,
                            },
                          }))
                        }
                        required
                        error={errors.termsPosition}
                        placeholder="Enter position/title"
                      />
                    </div>

                    {/* Signature Pad */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Digital Signature{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`border-2 rounded-lg p-2 bg-white ${
                          errors.termsSignature
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <SignatureCanvas
                          ref={signaturePadRef}
                          canvasProps={{
                            className:
                              "signature-canvas w-full h-32 border border-gray-200 rounded",
                          }}
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={saveSignature}
                            className="text-sm text-green-600 hover:text-green-700 flex items-center"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save Signature
                          </button>
                        </div>
                      </div>
                      {errors.termsSignature && (
                        <p className="text-xs text-red-600">
                          {errors.termsSignature}
                        </p>
                      )}
                      {termsData.partyB.signature && (
                        <p className="text-xs text-green-600 flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Signature saved
                        </p>
                      )}
                    </div>

                    {/* Execution Date */}
                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                      <p className="text-sm text-gray-700">
                        <strong>Execution Date:</strong> THUS DONE AND EXECUTED
                        ON THIS {termsData.executionDate}
                      </p>
                    </div>

                    {/* Terms Acceptance Checkbox */}
                    <div className="flex items-start mt-4">
                      <input
                        type="checkbox"
                        id="termsAccept"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="termsAccept"
                        className="ml-2 text-sm text-gray-700"
                      >
                        I have read, understood, and agree to be bound by the
                        Terms and Conditions for Renewable Energy Device
                        Registration
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Stepper header for mobile
  const renderMobileHeader = () => (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center mb-3">
        {React.createElement(steps[activeStep].icon, {
          className: "w-5 h-5 mr-2 text-blue-600",
        })}
        <h2 className="text-lg font-semibold text-gray-900">
          {steps[activeStep].title}
        </h2>
      </div>
      <p className="text-sm text-gray-500">
        Step {activeStep + 1} of {steps.length}
      </p>
      <div className="mt-3">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= activeStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop stepper
  const renderDesktopStepper = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors ${
                  index <= activeStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {index < activeStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  React.createElement(step.icon, { className: "w-5 h-5" })
                )}
              </motion.div>
              <div className="ml-3 hidden lg:block">
                <p
                  className={`text-sm font-medium ${
                    index <= activeStep ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-1 lg:w-2 h-0.5 mx-4 transition-colors ${
                  index < activeStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!open) return null;

  return (
    <>
      <style jsx>{`
        .signature-canvas {
          touch-action: none;
        }
      `}</style>

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm bg-opacity-50 z-40"
        onClick={isSubmitting ? undefined : onClose}
      />

      {/* Modal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="block sm:hidden">{renderMobileHeader()}</div>

          <div className="hidden sm:block p-6 border-b border-gray-200">
            {renderDesktopStepper()}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-white">
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={activeStep === 0 ? onClose : handleBack}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {activeStep === 0 ? "Cancel" : "Back"}
              </motion.button>

              {activeStep === steps.length - 1 && showTermsSection ? (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitLater}
                    disabled={
                      !isStepComplete(activeStep) ||
                      isSubmitting ||
                      submitType === "sign-now"
                    }
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitType === "sign-later" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Submit & Sign Later
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitWithTerms}
                    disabled={
                      !isStepComplete(activeStep) ||
                      !termsAccepted ||
                      !termsData.partyB.companyName ||
                      !termsData.partyB.name ||
                      !termsData.partyB.position ||
                      !termsData.partyB.signature ||
                      isSubmitting ||
                      submitType === "sign-later"
                    }
                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitType === "sign-now" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Save Terms & Submit
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={
                    activeStep === steps.length - 1 && !showTermsSection
                      ? handleSubmit
                      : handleNext
                  }
                  disabled={!isStepComplete(activeStep) || isSubmitting}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting &&
                  activeStep === steps.length - 1 &&
                  !showTermsSection ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : activeStep === steps.length - 1 && !showTermsSection ? (
                    <>Proceed to Terms</>
                  ) : (
                    <>Next</>
                  )}
                  {activeStep !== steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DeviceUploadStepper;
