import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deviceAPI } from "../../utils/api";
import { useTheme } from "@mui/material/styles";
import { createDevice } from "../../redux/slices/deviceSlice";
import { CloudUpload, FileText, X, ArrowLeft, ArrowRight } from "lucide-react";

const DeviceUploadStepper = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [technologyOptions, setTechnologyOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({
    device_name: '',
    issuer_organisation: '',
    fuel_type: '',
    technology_type: '',
    capacity: '',
    commissioning_date: '',
    effective_date: '',
    address: '',
    country: '',
    latitude: '',
    longitude: '',
    postcode: '',
    documents: ''
  });

  const initialFormState = {
    device_name: "",
    issuer_organisation: "",
    default_account_code: "",
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
    "General Information",
    "Technical Details",
    "Location Details",
    "Supporting Documents",
  ];

  const DOCUMENT_TYPES = [
    {
      id: "sf02",
      label: "Form SF-02 - Registration",
      shortLabel: "SF-02 Form",
      required: true,
      accept: ".pdf",
    },
    {
      id: "sf02c",
      label: "SF-02C Owner's Declaration",
      shortLabel: "SF-02C Form",
      required: true,
      accept: ".pdf,.doc,.docx",
    },
    {
      id: "metering",
      label: "Metering Evidence",
      shortLabel: "Metering",
      required: true,
      accept: ".pdf,.xls,.xlsx",
    },
    {
      id: "diagram",
      label: "Single Line Diagram",
      shortLabel: "Diagram",
      required: true,
      accept: ".pdf,.dwg,.dxf",
    },
    {
      id: "photos",
      label: "Project Photos",
      shortLabel: "Photos",
      required: true,
      accept: "image/*",
    },
  ];

  const fuelTechnologyMap = {
    ES100: ["TC110", "TC120", "TC130", "TC140"],
    ES200: ["TC210", "TC220"],
    ES300: ["TC310", "TC320", "TC330"],
    ES400: ["TC410", "TC411", "TC421", "TC422", "TC423", "TC424"],
    ES500: ["TC510", "TC520", "TC530"],
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (docType, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file,
      },
    }));
  };

  const handleDecimalChange = (name, value, before, after) => {
    const isValid = validateDecimal(value, before, after);

    setErrors((prev) => ({
      ...prev,
      [name]: !isValid,
    }));

    if (isValid) {
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

    // Check total digit count
    const totalDigits = value.replace(/[.-]/g, "").length;
    if (totalDigits > before + after) return false;

    // Check format
    const regex = new RegExp(`^-?\\d{0,${before}}(\\.\\d{0,${after}})?$`);
    return regex.test(value);
  };

  const handleSubmit = async () => {
    const requiredDocuments = [
      "sf02",
      "sf02c",
      "metering",
      "diagram",
      "photos",
    ];
    const missingDocuments = requiredDocuments.filter(
      (doc) => !formData.documents[doc]
    );

    if (missingDocuments.length > 0) {
      const missingLabels = missingDocuments.map(
        (doc) => DOCUMENT_TYPES.find((d) => d.id === doc).shortLabel
      );

      enqueueSnackbar(
        `Missing required documents: ${missingLabels.join(", ")}`,
        { variant: "error" }
      );
      setActiveStep(3); // Jump to documents step
      return;
    }

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
      console.log("Submission successful");
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
          fieldErrors[key] = apiErrors[key].join(', ');
        });
  
        // Update form errors state
        setErrors(prev => ({
          ...prev,
          ...fieldErrors
        }));
  
        // Show first error in snackbar
        const firstError = Object.values(apiErrors)[0]?.[0];
        if (firstError) {
          enqueueSnackbar(firstError, { variant: 'error' });
        }
        
        // Jump to first error step
        const errorStep = steps.findIndex(step =>
          Object.keys(apiErrors).some(field =>
            getStepFields(step).includes(field)
          ));
        if (errorStep >= 0) setActiveStep(errorStep);
      } else {
        enqueueSnackbar('Submission failed. Please try again.', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (formData.fuel_type) {
      deviceAPI
        .getTechnologyOptions(formData.fuel_type)
        .then((response) => {
          setTechnologyOptions(response.data.options);
        })
        .catch(console.error);
    }
  }, [formData.fuel_type]);

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
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant="h6">{steps[activeStep]}</Typography>
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
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issuer Organisation"
                name="issuer_organisation"
                value={formData.issuer_organisation}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Account Code"
                name="default_account_code"
                value={formData.default_account_code}
                onChange={handleInputChange}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                disabled={!formData.fuel_type}
                size={isMobile ? "small" : "medium"}
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={
                  (e) => handleDecimalChange("capacity", e.target.value, 4, 6) // 4 digits before, 6 after
                }
                error={!!errors.capacity}
                helperText={errors.capacity}
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
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
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
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={(e) => {
                  // First validate decimal format
                  handleDecimalChange("latitude", e.target.value, 2, 6); // 2 digits before decimal
                  // Then validate numeric range
                  const value = parseFloat(e.target.value);
                  if (value < -90 || value > 90) {
                    setErrors((prev) => ({
                      ...prev,
                      latitude: "Must be between -90 and 90",
                    }));
                  }
                }}
                error={!!errors.latitude}
                helperText={errors.latitude || "Range: -90.000000 to 90.000000"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={
                  (e) => handleDecimalChange("longitude", e.target.value, 3, 6) // 3 before, 6 after
                }
                error={!!errors.longitude}
                helperText={
                  errors.longitude ? "Max 3 digits before decimal" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            {DOCUMENT_TYPES.map((doc) => (
              <Grid item xs={12} key={doc.id}>
                <Box
                  sx={{
                    mb: 1,
                    p: isMobile ? 1 : 2,
                    border: "1px dashed #ccc",
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ mb: isMobile ? 1 : 0 }}>
                    <Typography variant={isMobile ? "body2" : "body1"}>
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
                  </Box>

                  <Box>
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
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload size={isMobile ? 18 : 24} />}
                        size={isMobile ? "small" : "medium"}
                      >
                        {formData.documents[doc.id] ? "Replace" : "Upload"}
                      </Button>
                    </label>
                  </Box>

                  {formData.documents[doc.id] && (
                    <Box
                      sx={{
                        mt: isMobile ? 1 : 0,
                        display: "flex",
                        alignItems: "center",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      <FileText size={isMobile ? 16 : 20} />
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          maxWidth: isMobile ? "70%" : "auto",
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
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleInputChange}
                multiline
                rows={isMobile ? 3 : 4}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
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
      sx={{ flexGrow: 1, mt: 2 }}
      nextButton={
        <Button
          size="small"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={!isStepComplete(activeStep)}
          variant={activeStep === steps.length - 1 ? "contained" : "text"}
          color={activeStep === steps.length - 1 ? "primary" : "inherit"}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
          <ArrowRight />
        </Button>
      }
      backButton={
        <Button size="small" onClick={activeStep === 0 ? onClose : handleBack}>
          <ArrowLeft />
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
      }
    />
  );

  const renderDesktopButtons = () => (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
      <Button
        onClick={activeStep === 0 ? onClose : handleBack}
        variant="outlined"
      >
        {activeStep === 0 ? "Cancel" : "Back"}
      </Button>

      <Button
        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        variant="contained"
        color="primary"
        disabled={!isStepComplete(activeStep)}
      >
        {activeStep === steps.length - 1 ? "Submit Device" : "Next"}
      </Button>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "sm" : "lg"}
      fullScreen={isMobile}
      scroll="paper"
    >
      <DialogTitle sx={{ p: isMobile ? 1 : 2 }}>
        {renderStepperHeader()}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: isMobile ? 1 : 3,
          height: isMobile ? "100%" : "auto",
        }}
      >
        <Box sx={{ p: isMobile ? 1 : 2 }}>
          {getStepContent(activeStep)}

          {isMobile ? renderMobileStepper() : renderDesktopButtons()}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceUploadStepper;
