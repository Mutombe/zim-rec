import React, { useState } from 'react';
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
  FormControl,
    InputLabel,
  Typography,
  Select
} from '@mui/material';
import { CloudUploadIcon } from 'lucide-react';

const DeviceUploadStepper = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // General Information
    device_name: '',
    issuer_organisation: '',
    default_account_code: '',
    
    // Technical Information
    fuel_type: '',
    technology_type: '',
    capacity: '',
    commissioning_date: '',
    effective_date: '',
    
    // Location Information
    address: '',
    country: '',
    latitude: '',
    longitude: '',
    postcode: '',
    
    // Supporting Information
    additional_notes: '',
      documents: {
        sf02: null,          // SF-02 Production Facility Registration
        sf02c: null,         // SF-02C Ownership Declaration
        metering: null,      // Metering Evidence
        diagram: null,       // Single Line Diagram
        photos: null         // Project Photos
      }
  });

  const steps = [
    'General Information',
    'Technical Details',
    'Location Details',
    'Supporting Documents'
    ];
    
    const DOCUMENT_TYPES = [
        {
          id: 'sf02',
          label: 'Form SF-02 - Production Facility Registration',
          required: true,
          accept: '.pdf'
        },
        {
          id: 'sf02c',
          label: 'SF-02C Owner\'s Declaration or Proof of Ownership',
          required: true,
          accept: '.pdf,.doc,.docx'
        },
        {
          id: 'metering',
          label: 'Metering Evidence',
          required: true,
          accept: '.pdf,.xls,.xlsx'
        },
        {
          id: 'diagram',
          label: 'Single Line Diagram',
          required: true,
          accept: '.pdf,.dwg,.dxf'
        },
        {
          id: 'photos',
          label: 'Project Photos',
          required: true,
          accept: 'image/*'
        }
      ];

  const fuelTechnologyMap = {
    ES100: ['TC110', 'TC120', 'TC130', 'TC140'],
    ES200: ['TC210', 'TC220'],
    ES300: ['TC310', 'TC320', 'TC330'],
    ES400: ['TC410', 'TC411', 'TC421', 'TC422', 'TC423', 'TC424'],
    ES500: ['TC510', 'TC520', 'TC530'],
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (docType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device Name"
                name="device_name"
                value={formData.device_name}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Account Code"
                name="default_account_code"
                value={formData.default_account_code}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  required
                >
                  {Object.keys(fuelTechnologyMap).map((fuel) => (
                    <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Technology Type</InputLabel>
                <Select
                  name="technology_type"
                  value={formData.technology_type}
                  onChange={handleInputChange}
                  required
                >
                  {fuelTechnologyMap[formData.fuel_type]?.map((tech) => (
                    <MenuItem key={tech} value={tech}>{tech}</MenuItem>
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
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">MW</InputAdornment>,
                }}
                required
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
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
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
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
          </Grid>
        );

        case 3:
            return (
              <Grid container spacing={3}>
                {DOCUMENT_TYPES.map((doc) => (
                  <Grid item xs={12} key={doc.id}>
                    <Box sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                      <input
                        accept={doc.accept}
                        style={{ display: 'none' }}
                        id={doc.id}
                        type="file"
                        onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                      />
                      <label htmlFor={doc.id}>
                        <Button 
                          variant="outlined" 
                          component="span"
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload {doc.label}
                        </Button>
                      </label>
                      
                      {formData.documents[doc.id] && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon color="primary" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {formData.documents[doc.id].name}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleFileRemove(doc.id)}
                            sx={{ ml: 1 }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                      
                      {!formData.documents[doc.id] && doc.required && (
                        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                          * Required for approval
                        </Typography>
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
                    rows={4}
                  />
                </Grid>
              </Grid>
            );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ p: 3 }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={activeStep === 0 ? onClose : handleBack}
              variant="outlined"
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button
              onClick={activeStep === steps.length - 1 ? onClose : handleNext}
              variant="contained"
              color="primary"
            >
              {activeStep === steps.length - 1 ? 'Submit Device' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceUploadStepper;