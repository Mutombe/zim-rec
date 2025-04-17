import React, { useState, useEffect } from "react";
import { deviceAPI } from "../../utils/api";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Typography,
  Select,
  useMediaQuery,
  MobileStepper,
  Paper,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  Divider,
  Fade,
  alpha,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  Info,
  MapPin,
  Building,
  Calendar,
  Settings,
  Zap,
  File,
  AlertCircle,
} from "lucide-react";

const DeviceUploadStepper = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);
  const [technologyOptions, setTechnologyOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log("user", user?.id);
  const { enqueueSnackbar } = useSnackbar();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
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
    public_funding: "None",
    funding_end_date: "",
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
      title: "General Information",
      icon: <Info size={isTablet ? 18 : 22} />,
    },
    {
      id: 1,
      title: "Technical Details",
      icon: <Settings size={isTablet ? 18 : 22} />,
    },
    {
      id: 2,
      title: "Location Details",
      icon: <MapPin size={isTablet ? 18 : 22} />,
    },
    {
      id: 3,
      title: "Grid & Metering",
      icon: <Zap size={isTablet ? 18 : 22} />,
    },
    {
      id: 4,
      title: "Business Details",
      icon: <Building size={isTablet ? 18 : 22} />,
    },
    {
      id: 5,
      title: "Supporting Documents",
      icon: <File size={isTablet ? 18 : 22} />,
    },
  ];

  const DOCUMENT_TYPES = [
    {
      id: "sf02",
      label: "Form SF-02 - Registration",
      shortLabel: "SF-02 Form",
      required: true,
      accept: ".pdf",
      description: "Official registration form",
    },
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

  const FUNDING_CHOICES = [
    ["No", "No"],
    ["Investment", "Investment"],
    ["Production", "Production"],
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

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    // Scroll to top when changing steps
    if (document.querySelector(".MuiDialogContent-root")) {
      document.querySelector(".MuiDialogContent-root").scrollTop = 0;
    }
  };

  const handleDateChange = (date, field) => {
    // Always update form data even if invalid
    setFormData((prev) => ({ ...prev, [field]: date }));

    if (validateFundingDate(date)) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: date ? "Date must be in the future" : "Required field",
      }));
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // First update the main field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle dependent field updates
    if (name === "public_funding") {
      if (value === "None") {
        setFormData((prev) => ({
          ...prev,
          funding_end_date: "",
        }));
      }
    } else if (name === "onsite_consumer") {
      if (value === "No") {
        setFormData((prev) => ({
          ...prev,
          onsite_consumer_details: "",
        }));
      }
    } else if (name === "auxiliary_energy") {
      if (value === "No") {
        setFormData((prev) => ({
          ...prev,
          auxiliary_energy_details: "",
        }));
      }
    } else if (name === "volume_evidence_type") {
      if (value !== "Other") {
        setFormData((prev) => ({
          ...prev,
          volume_evidence_other: "",
        }));
      }
    }

    // Clear errors for the changed field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Special handling for numeric fields
    if (name === "electricity_import_details") {
      if (validateElectricityImport(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleFileUpload = (docType, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      // 10MB limit
      enqueueSnackbar(`File too large. Maximum size is 10MB.`, {
        variant: "error",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file,
      },
    }));

    // Clear document error when user uploads a file
    if (errors.documents) {
      setErrors((prev) => ({
        ...prev,
        documents: "",
      }));
    }
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
    // Allow empty value for intermediate states
    if (value === "") return true;

    // Check format with proper digit limits
    const regex = new RegExp(`^-?\\d{0,${before}}(\\.\\d{0,${after}})?$`);
    return regex.test(value);
  };

  const validateElectricityImport = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) return false;
    return parseFloat(value) >= 0;
  };

  if (name === "electricity_import_details") {
    if (validateElectricityImport(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const validateFundingDate = (dateString) => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates without time
    return selectedDate > today;
  };

  const validateLatitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  const validateLongitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const getStepFields = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return ["device_name", "issuer_organisation", "default_account_code"];
      case 1:
        return [
          "fuel_type",
          "technology_type",
          "capacity",
          "commissioning_date",
          "effective_date",
        ];
      case 2:
        return ["address", "country", "latitude", "longitude", "postcode"];
      case 3:
        return [
          "meter_ids",
          "network_owner",
          "connection_voltage",
          "grid_connection_details",
          "volume_evidence_type",
          "volume_evidence_other",

          ...(formData.volume_evidence_type === "Other"
            ? ["volume_evidence_other"]
            : []),
        ];
      case 4: // Business Details
        return [
          "onsite_consumer",
          "auxiliary_energy",
          ...(formData.onsite_consumer === "Yes"
            ? ["onsite_consumer_details"]
            : []),
          ...(formData.auxiliary_energy === "Yes"
            ? ["auxiliary_energy_details"]
            : []),
          "electricity_import_details",
          "carbon_offset_registration",
          "labelling_scheme",
          "public_funding",
          ...(formData.public_funding !== "No" ? ["funding_end_date"] : []),
        ];
      case 5:
        return ["documents", "additional_notes"];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    // Validate all fields first
    let newErrors = {};
    let hasErrors = false;

    if (activeStep === 3) {
      if (!formData.meter_ids) {
        newErrors.meter_ids = "Meter IDs are required";
        hasErrors = true;
      }
      if (!formData.volume_evidence_type) {
        newErrors.volume_evidence_type = "Evidence type is required";
        hasErrors = true;
      }
      if (
        formData.volume_evidence_type === "Other" &&
        !formData.volume_evidence_other
      ) {
        newErrors.volume_evidence_other = "Please specify evidence type";
        hasErrors = true;
      }
    }

    if (activeStep === 4) {
      if (!formData.onsite_consumer) {
        newErrors.onsite_consumer = "On-site consumer selection required";
        hasErrors = true;
      }
      if (
        formData.onsite_consumer === "Yes" &&
        !formData.onsite_consumer_details
      ) {
        newErrors.onsite_consumer_details = "Consumer details required";
        hasErrors = true;
      }
      if (!formData.auxiliary_energy) {
        newErrors.auxiliary_energy = "Auxiliary energy selection required";
        hasErrors = true;
      }
      if (
        formData.auxiliary_energy === "Yes" &&
        !formData.auxiliary_energy_details
      ) {
        newErrors.auxiliary_energy_details = "Auxiliary details required";
        hasErrors = true;
      }
    }

    if (activeStep === 5) {
      if (!formData.public_funding) {
        newErrors.public_funding = "Public funding selection required";
        hasErrors = true;
      }
      if (formData.public_funding !== "None" && !formData.funding_end_date) {
        newErrors.funding_end_date = "Funding end date required";
        hasErrors = true;
      }
    }

    // Basic required field validation
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
      "number_of_generating_units",
      "meter_ids",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        hasErrors = true;
      }
    });

    // Special validations
    if (formData.latitude && !validateLatitude(formData.latitude)) {
      newErrors.latitude = "Must be between -90 and 90";
      hasErrors = true;
    }

    if (formData.longitude && !validateLongitude(formData.longitude)) {
      newErrors.longitude = "Must be between -180 and 180";
      hasErrors = true;
    }

    // Conditional validations
    if (formData.public_funding !== "None" && !formData.funding_end_date) {
      newErrors.funding_end_date = "Required when public funding is specified";
      hasErrors = true;
    }

    if (
      formData.onsite_consumer === "Yes" &&
      !formData.onsite_consumer_details
    ) {
      newErrors.onsite_consumer_details =
        "Required when on-site consumer is present";
      hasErrors = true;
    }

    if (
      formData.auxiliary_energy === "Yes" &&
      !formData.auxiliary_energy_details
    ) {
      newErrors.auxiliary_energy_details =
        "Required when auxiliary energy is present";
      hasErrors = true;
    }

    if (
      formData.volume_evidence_type === "Other" &&
      !formData.volume_evidence_other
    ) {
      newErrors.volume_evidence_other = "Please specify other evidence type";
      hasErrors = true;
    }

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

      enqueueSnackbar(
        `Missing required documents: ${missingLabels.join(", ")}`,
        { variant: "error" }
      );

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      setActiveStep(3); // Jump to documents step
      return;
    }

    if (hasErrors) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      // Find the first step with errors
      for (let i = 0; i < steps.length; i++) {
        const stepFields = getStepFields(i);
        const hasStepError = stepFields.some((field) => newErrors[field]);
        if (hasStepError) {
          setActiveStep(i);
          enqueueSnackbar("Please correct the errors before submitting", {
            variant: "error",
          });
          return;
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append regular fields
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
        "public_funding",
        "onsite_consumer",
        "onsite_consumer_details",
        "auxiliary_energy",
        "auxiliary_energy_details",
        "electricity_import_details",
      ];

      fields.forEach((field) => {
        formDataToSend.append(field, formData[field]);
      });

      // Append numbers with proper formatting
      formDataToSend.append(
        "latitude",
        parseFloat(formData.latitude).toFixed(6)
      );
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

      // Create device
      const response = await deviceAPI.create(formDataToSend);

      // Submit device
      await deviceAPI.submit(response.data.id);

      // Handle success
      setSnackbar({
        open: true,
        message: "Device Upload Successful.",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);

      // Handle validation errors
      if (error.response?.data) {
        // Handle field-specific errors
        const apiErrors = error.response.data;
        const fieldErrors = {};

        // Map API errors to form fields
        Object.keys(apiErrors).forEach((key) => {
          fieldErrors[key] = apiErrors[key].join(", ");
        });

        // Update form errors state
        setErrors((prev) => ({
          ...prev,
          ...fieldErrors,
        }));

        // Show first error in snackbar
        const firstError = Object.values(apiErrors)[0]?.[0];
        if (firstError) {
          enqueueSnackbar(firstError, { variant: "error" });
        }

        // Jump to first error step
        const errorStep = steps.findIndex((step) =>
          Object.keys(apiErrors).some((field) =>
            getStepFields(step.id).includes(field)
          )
        );
        if (errorStep >= 0) setActiveStep(errorStep);
      } else {
        enqueueSnackbar("Submission failed. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
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
          enqueueSnackbar("Failed to fetch technology options", {
            variant: "error",
          });
        });
    }
  }, [formData.fuel_type, enqueueSnackbar]);

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
      case 3: // Grid & Metering
        return [
          formData.meter_ids,
          formData.volume_evidence_type,
          formData.volume_evidence_type !== "Other" ||
            formData.volume_evidence_other,
        ].every(Boolean);
      case 4: // Business Details
        console.log("Checking step 5 completion:", {
          publicFunding: formData.public_funding,
          fundingEndDate: formData.funding_end_date,
          isValid:
            formData.public_funding &&
            (formData.public_funding === "None" ||
              (formData.funding_end_date &&
                validateFundingDate(formData.funding_end_date))),
        });
        return [
          formData.public_funding &&
            (formData.public_funding === "None" ||
              (formData.funding_end_date &&
                validateFundingDate(formData.funding_end_date))),
          formData.onsite_consumer,
          formData.auxiliary_energy,
          formData.onsite_consumer === "Yes"
            ? formData.onsite_consumer_details
            : true,
          formData.auxiliary_energy === "Yes"
            ? formData.auxiliary_energy_details
            : true,
          formData.electricity_import_details,
        ].every(Boolean);

      case 5:
        return DOCUMENT_TYPES.filter((doc) => doc.required).every(
          (doc) => formData.documents[doc.id]
        );
      default:
        return false;
    }
  };

  const renderStepperHeader = () => {
    if (isMobile) {
      return (
        <Paper
          square
          elevation={0}
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {steps[activeStep].icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {steps[activeStep].title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Paper>
      );
    }

    return (
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation="horizontal"
        sx={{ mb: 4 }}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel
              StepIconProps={{
                icon: isTablet ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                    }}
                  >
                    {step.id + 1}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                    }}
                  >
                    {step.icon}
                  </Box>
                ),
              }}
            >
              {step.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Info size={18} style={{ marginRight: 8 }} />
                  Device Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Device Name"
                      name="device_name"
                      value={formData.device_name}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.device_name}
                      helperText={errors.device_name}
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Organisation"
                      name="issuer_organisation"
                      value={formData.issuer_organisation}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.issuer_organisation}
                      helperText={errors.issuer_organisation}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account ID"
                      name="default_account_code"
                      value={formData.default_account_code}
                      disabled // Make field non-editable
                      size={isMobile ? "small" : "medium"}
                      helperText="Automatically assigned to your account"
                      sx={{
                        "& .MuiInputBase-input": {
                          cursor: "not-allowed",
                          backgroundColor:
                            theme.palette.action.disabledBackground,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );

      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Zap size={18} style={{ marginRight: 8 }} />
                  Technical Specifications
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.fuel_type}
                    >
                      <InputLabel>Fuel Type</InputLabel>
                      <Select
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleInputChange}
                        required
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      >
                        {Object.keys(fuelTechnologyMap).map((fuel) => (
                          <MenuItem key={fuel} value={fuel}>
                            {fuel}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.fuel_type && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.fuel_type}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      disabled={!formData.fuel_type}
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.technology_type}
                    >
                      <InputLabel>Technology Type</InputLabel>
                      <Select
                        name="technology_type"
                        value={formData.technology_type}
                        onChange={handleInputChange}
                        required
                      >
                        {technologyOptions.map((tech) => (
                          <MenuItem key={tech.value} value={tech.value}>
                            {tech.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.technology_type && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.technology_type}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={
                        (e) =>
                          handleDecimalChange("capacity", e.target.value, 4, 6) // 4 digits before, 6 after
                      }
                      error={!!errors.capacity}
                      helperText={
                        errors.capacity || "Max 4 digits before decimal"
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">MW</InputAdornment>
                        ),
                      }}
                      required
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Commissioning Date"
                      name="commissioning_date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.commissioning_date}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.commissioning_date}
                      helperText={errors.commissioning_date}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Effective Date"
                      name="effective_date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.effective_date}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.effective_date}
                      helperText={errors.effective_date}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );

      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.primary.main,
                  }}
                >
                  <MapPin size={18} style={{ marginRight: 8 }} />
                  Location Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={isMobile ? 2 : 3}
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.address}
                      helperText={errors.address}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.country}
                      helperText={errors.country}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.postcode}
                      helperText={errors.postcode}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Geographical Coordinates
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={(e) => {
                        // First validate decimal format
                        handleDecimalChange("latitude", e.target.value, 2, 6); // 2 digits before decimal
                        // Then validate numeric range
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && (value < -90 || value > 90)) {
                          setErrors((prev) => ({
                            ...prev,
                            latitude: "Must be between -90 and 90",
                          }));
                        }
                      }}
                      error={!!errors.latitude}
                      helperText={
                        errors.latitude || "Range: -90.000000 to 90.000000"
                      }
                      size={isMobile ? "small" : "medium"}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={(e) => {
                        // First validate decimal format
                        handleDecimalChange("longitude", e.target.value, 3, 6); // 3 before, 6 after
                        // Then validate numeric range
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && (value < -180 || value > 180)) {
                          setErrors((prev) => ({
                            ...prev,
                            longitude: "Must be between -180 and 180",
                          }));
                        }
                      }}
                      error={!!errors.longitude}
                      helperText={
                        errors.longitude || "Range: -180.000000 to 180.000000"
                      }
                      size={isMobile ? "small" : "medium"}
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );

      case 3: // Grid & Metering Step
        return (
          <Fade in={activeStep === 3}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Zap size={18} style={{ marginRight: 8 }} />
                  Grid Connection & Metering
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meter/Measurement IDs"
                      name="meter_ids"
                      value={formData.meter_ids}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={2}
                      helperText="Comma-separated list of meter IDs"
                      error={!!errors.meter_ids}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Network Owner"
                      name="network_owner"
                      value={formData.network_owner}
                      onChange={handleInputChange}
                      error={!!errors.network_owner}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Connection Voltage"
                      name="connection_voltage"
                      value={formData.connection_voltage}
                      onChange={handleInputChange}
                      error={!!errors.connection_voltage}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Grid Connection Details"
                      name="grid_connection_details"
                      value={formData.grid_connection_details}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      helperText="Describe connection details if not directly connected to grid"
                      error={!!errors.grid_connection_details}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Volume Evidence Type</InputLabel>
                      <Select
                        name="volume_evidence_type"
                        value={formData.volume_evidence_type}
                        onChange={handleInputChange}
                        required
                      >
                        {VOLUME_EVIDENCE_CHOICES.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.volume_evidence_type === "Other" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specify Evidence Type"
                        name="volume_evidence_other"
                        value={formData.volume_evidence_other}
                        onChange={handleInputChange}
                        required
                        error={!!errors.volume_evidence_other}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );

      case 4: // Business Details Step
        return (
          <Fade in={activeStep === 4}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Building size={18} style={{ marginRight: 8 }} />
                  Business Operations
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>On-site Consumer</InputLabel>
                      <Select
                        name="onsite_consumer"
                        value={formData.onsite_consumer}
                        onChange={handleInputChange}
                        required
                      >
                        {ONSITE_CONSUMER_CHOICES.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.onsite_consumer === "Yes" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Consumer Details"
                        name="onsite_consumer_details"
                        value={formData.onsite_consumer_details}
                        onChange={handleInputChange}
                        required
                        error={!!errors.onsite_consumer_details}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Auxiliary Energy</InputLabel>
                      <Select
                        name="auxiliary_energy"
                        value={formData.auxiliary_energy}
                        onChange={handleInputChange}
                        required
                      >
                        {AUXILIARY_ENERGY_CHOICES.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.auxiliary_energy === "Yes" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Auxiliary Energy Details"
                        name="auxiliary_energy_details"
                        value={formData.auxiliary_energy_details}
                        onChange={handleInputChange}
                        required
                        error={!!errors.auxiliary_energy_details}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Electricity Import Details"
                      name="electricity_import_details"
                      value={formData.electricity_import_details}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      helperText="Describe alternative electricity import methods"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Carbon Offset Registration ID"
                      name="carbon_offset_registration"
                      value={formData.carbon_offset_registration}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Labelling Scheme"
                      name="labelling_scheme"
                      value={formData.labelling_scheme}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Public Funding</InputLabel>
                      <Select
                        name="public_funding"
                        value={formData.public_funding}
                        onChange={handleInputChange}
                        required
                      >
                        {FUNDING_CHOICES.map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  // In the Registration step JSX
                  {formData.public_funding !== "No" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Funding End Date"
                        name="funding_end_date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.funding_end_date || ""}
                        onChange={(e) => {
                          handleDateChange(e.target.value, "funding_end_date");
                          // Immediately validate when changed
                          if (!validateFundingDate(e.target.value)) {
                            setErrors((prev) => ({
                              ...prev,
                              funding_end_date: "Date must be in the future",
                            }));
                          }
                        }}
                        required
                        error={!!errors.funding_end_date}
                        helperText={errors.funding_end_date}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // Disable past dates
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );

      case 5:
        return (
          <Fade in={activeStep === 5}>
            <Box>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.primary.main,
                    }}
                  >
                    <File size={18} style={{ marginRight: 8 }} />
                    Required Documentation
                  </Typography>

                  {errors.documents && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                      {errors.documents}
                    </Typography>
                  )}

                  <Grid container spacing={2}>
                    {DOCUMENT_TYPES.map((doc) => (
                      <Grid item xs={12} key={doc.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            p: 0,
                            borderColor: formData.documents[doc.id]
                              ? theme.palette.success.light
                              : errors.documents &&
                                errors.documents.includes(doc.shortLabel)
                              ? theme.palette.error.light
                              : theme.palette.divider,
                            transition: "all 0.3s",
                            "&:hover": {
                              borderColor: theme.palette.primary.light,
                              boxShadow: `0 0 0 1px ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: isMobile ? "column" : "row",
                              alignItems: isMobile ? "stretch" : "center",
                              p: isMobile ? 1.5 : 2,
                            }}
                          >
                            <Box
                              sx={{
                                flex: 1,
                                mb: isMobile ? 1 : 0,
                              }}
                            >
                              <Typography
                                variant={isMobile ? "body2" : "body1"}
                                sx={{ fontWeight: 500 }}
                              >
                                {isMobile ? doc.shortLabel : doc.label}
                                {doc.required && (
                                  <Typography
                                    component="span"
                                    color="error"
                                    fontSize="small"
                                    sx={{ ml: 0.5 }}
                                  >
                                    *
                                  </Typography>
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 0.5 }}
                              >
                                {doc.description}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: isMobile
                                  ? "space-between"
                                  : "flex-end",
                                width: isMobile ? "100%" : "auto",
                              }}
                            >
                              {formData.documents[doc.id] && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mr: 2,
                                    maxWidth: isMobile ? "60%" : "200px",
                                  }}
                                >
                                  <FileText
                                    size={isMobile ? 16 : 20}
                                    color={theme.palette.success.main}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      ml: 0.5,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {formData.documents[doc.id].name}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleFileRemove(doc.id)}
                                    sx={{ ml: 0.5 }}
                                  >
                                    <X size={isMobile ? 16 : 20} />
                                  </IconButton>
                                </Box>
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
                                <Button
                                  variant={
                                    formData.documents[doc.id]
                                      ? "outlined"
                                      : "contained"
                                  }
                                  component="span"
                                  startIcon={
                                    <CloudUpload size={isMobile ? 18 : 20} />
                                  }
                                  size={isMobile ? "small" : "medium"}
                                  color={
                                    formData.documents[doc.id]
                                      ? "primary"
                                      : "primary"
                                  }
                                  sx={{
                                    minWidth: formData.documents[doc.id]
                                      ? "auto"
                                      : 110,
                                    ml: 1,
                                  }}
                                >
                                  {formData.documents[doc.id]
                                    ? "Replace"
                                    : "Upload"}
                                </Button>
                              </label>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Additional Notes"
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleInputChange}
                        multiline
                        rows={isMobile ? 3 : 4}
                        size={isMobile ? "small" : "medium"}
                        placeholder="Add any relevant information about the device or documentation"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        );

      default:
        return "Unknown step";
    }
  };

  const renderMobileStepper = () => (
    <MobileStepper
      variant="dots"
      steps={steps.length}
      position="static"
      activeStep={activeStep}
      sx={{
        flexGrow: 1,
        mt: 2,
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        "& .MuiMobileStepper-dot": {
          width: 8,
          height: 8,
          margin: "0 4px",
        },
        "& .MuiMobileStepper-dotActive": {
          backgroundColor: theme.palette.primary.main,
        },
      }}
      nextButton={
        <Button
          size="small"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={!isStepComplete(activeStep) || isSubmitting}
          variant={activeStep === steps.length - 1 ? "contained" : "text"}
          color="primary"
          startIcon={
            isSubmitting && activeStep === steps.length - 1 ? (
              <CircularProgress size={16} />
            ) : null
          }
          endIcon={!isSubmitting && <ArrowRight size={16} />}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      }
      backButton={
        <Button
          size="small"
          onClick={activeStep === 0 ? onClose : handleBack}
          disabled={isSubmitting}
          startIcon={<ArrowLeft size={16} />}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
      }
    />
  );

  const renderDesktopButtons = () => (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "space-between",
        position: "sticky",
        bottom: 0,
        backgroundColor: theme.palette.background.paper,
        pt: 2,
        pb: 2,
        zIndex: 1,
      }}
    >
      <Button
        onClick={activeStep === 0 ? onClose : handleBack}
        variant="outlined"
        disabled={isSubmitting}
        startIcon={<ArrowLeft size={20} />}
      >
        {activeStep === 0 ? "Cancel" : "Back"}
      </Button>

      <Button
        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        variant="contained"
        color="primary"
        disabled={!isStepComplete(activeStep) || isSubmitting}
        endIcon={
          activeStep === steps.length - 1 ? (
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          ) : (
            <ArrowRight size={20} />
          )
        }
      >
        {activeStep === steps.length - 1 ? "Submit Device" : "Next"}
      </Button>
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={isSubmitting ? undefined : onClose}
        fullWidth
        maxWidth={isMobile ? "sm" : "md"}
        fullScreen={isMobile}
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            height: isMobile ? "100%" : "auto",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: isMobile ? 0 : 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {renderStepperHeader()}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: isMobile ? 1 : 3,
            height: isMobile ? "calc(100% - 120px)" : "auto",
            overflowY: "auto",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box sx={{ p: isMobile ? 1 : 0 }}>
            {getStepContent(activeStep)}
            {isMobile ? renderMobileStepper() : renderDesktopButtons()}
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          className="!items-center"
          iconMapping={{
            error: <AlertCircle className="w-5 h-5" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeviceUploadStepper;
