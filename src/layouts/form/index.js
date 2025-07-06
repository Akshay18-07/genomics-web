import { useState, useRef } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useDispatch, useSelector } from "react-redux";
import { addFile } from "store/fileUploadSlice";

function Form() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.login);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const closeInfoSB = () => setInfoSB(false);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [form, setForm] = useState({
    sampleId: "",
    patientName: "",
    patientPhenotype: "",
    gender: "",
    dob: "",
    age: "",
    specimenType: "",
    sampleCollectionDate: "",
    sampleReceivingDate: "",
    sequencingPlatform: "",
    variantsToIdentify: [],
    patientLocation: "",
    referredBy: "",
    clinicalHistory: "",
    testInformation: "",
    assembly: "",
    additionalInfo: "",
  });

  const [metaDataFiles, setmetaDataFiles] = useState([]);
  const [geneListFiles, setGeneListFiles] = useState([]);
  const [bedFiles, setBedFiles] = useState([]);
  const [patientDataFiles, setPatientDataFiles] = useState([]);
  const metaDataInputRef = useRef();
  const geneListInputRef = useRef();
  const bedInputRef = useRef();
  const patientDataInputRef = useRef();
  const { user } = useSelector((item) => item.login);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "variantsToIdentify") {
      setForm((prev) => {
        let updated = prev.variantsToIdentify || [];
        if (checked) {
          updated = [...updated, value];
        } else {
          updated = updated.filter((v) => v !== value);
        }
        return { ...prev, variantsToIdentify: updated };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, setFiles) => {
    const files = Array.from(e.target.files);
    setFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "finished",
        progress: 100,
      })),
    ]);
  };

  const handleRemoveFile = (index, setFiles) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [formErrors, setFormErrors] = useState({});

  const validatePatientDataFiles = (files) => {
    const errors = [];
    const fastqR1Pattern = /(_R1\.fastq\.gz$|_1\.fastq\.gz$)/i;
    const fastqR2Pattern = /(_R2\.fastq\.gz$|_2\.fastq\.gz$)/i;
    const vcfPattern = /(\.vcf(\.gz)?|\.cf)$/i;

    let fastqR1 = [];
    let fastqR2 = [];
    let vcfFiles = [];
    let invalidFiles = [];

    files.forEach((fileObj) => {
      const name = fileObj.name;
      if (fastqR1Pattern.test(name)) {
        fastqR1.push(name);
      } else if (fastqR2Pattern.test(name)) {
        fastqR2.push(name);
      } else if (vcfPattern.test(name)) {
        vcfFiles.push(name);
      } else {
        invalidFiles.push(name);
      }
    });

    // Check for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach((f) => errors.push(`Invalid file: ${f}`));
    }

    // VCF: only one allowed
    if (vcfFiles.length > 1) {
      errors.push("Only one VCF file (.vcf, .vcf.gz, .cf) is allowed.");
    }

    // FASTQ: must be paired by basename
    if (fastqR1.length !== fastqR2.length) {
      errors.push("FASTQ files must be uploaded in pairs (matching R1/R2 or 1/2).");
    } else if (fastqR1.length > 0) {
      // Check for matching pairs
      const getBase = (name) =>
        name.replace(/(_R1\.fastq\.gz|_R2\.fastq\.gz|_1\.fastq\.gz|_2\.fastq\.gz)$/i, "");
      const r1Bases = fastqR1.map(getBase);
      const r2Bases = fastqR2.map(getBase);

      // For InheriGene, only one pair allowed
      if (product === "Inherigene") {
        if (fastqR1.length !== 1 || fastqR2.length !== 1) {
          errors.push("For InheriGene, upload exactly one R1 and one R2 FASTQ file.");
        } else if (r1Bases[0] !== r2Bases[0]) {
          errors.push("R1 and R2 FASTQ files must have matching basenames.");
        }
      } else {
        // For Onquer, allow multiple pairs but all must be matched
        r1Bases.forEach((base) => {
          if (!r2Bases.includes(base)) {
            errors.push(`Missing R2 pair for: ${base}`);
          }
        });
        r2Bases.forEach((base) => {
          if (!r1Bases.includes(base)) {
            errors.push(`Missing R1 pair for: ${base}`);
          }
        });
      }
    }

    // At least one valid file required
    if (fastqR1.length === 0 && fastqR2.length === 0 && vcfFiles.length === 0) {
      errors.push("Upload at least one valid FASTQ pair or a VCF (.vcf, .vcf.gz, .cf) file.");
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};
    if (!form.sampleId) errors.sampleId = "Sample ID is required";
    if (!form.patientName) errors.patientName = "Patient Name is required";
    if (!form.patientPhenotype) errors.patientPhenotype = "Patient Phenotype is required";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.dob) errors.dob = "Date of Birth is required";
    if (!form.age) errors.age = "Age is required";
    if (!form.specimenType) errors.specimenType = "Specimen Type is required";
    if (!form.sampleCollectionDate)
      errors.sampleCollectionDate = "Sample Collection Date is required";
    if (!form.sampleReceivingDate) errors.sampleReceivingDate = "Sample Receiving Date is required";
    if (!form.sequencingPlatform) errors.sequencingPlatform = "Sequencing Platform is required";
    if (!form.variantsToIdentify || form.variantsToIdentify.length === 0)
      errors.variantsToIdentify = "Select at least one variant type";
    if (!form.assembly) errors.assembly = "Assembly is required";

    // Patient data file validation
    const patientDataFileErrors = validatePatientDataFiles(patientDataFiles);
    if (patientDataFileErrors.length > 0) {
      errors.patientDataFiles = patientDataFileErrors.join("\n");
    }

    if (product == "Onquer" && bedFiles.length !== 1) {
      errors.bedFiles = "A BED (.bed) file is required.";
    }
    // BED file validation: allow 0 or 1 .bed file only
    if (bedFiles.length > 1) {
      errors.bedFiles = "Only one BED (.bed) file can be uploaded.";
    } else if (bedFiles.length === 1 && !/\.bed$/i.test(bedFiles[0].name)) {
      errors.bedFiles = "Uploaded file must have a .bed extension.";
    }

    // Gene list validation: allow 0 or 1 .txt file only
    if (geneListFiles.length > 1) {
      errors.geneListFiles = "Only one gene list (.txt) file can be uploaded.";
    } else if (geneListFiles.length === 1 && !/\.txt$/i.test(geneListFiles[0].name)) {
      errors.geneListFiles = "Gene list file must have a .txt extension.";
    }
    //
    if (metaDataFiles.length > 1) {
      errors.metaDataFiles = "Only one metadata (.txt) file can be uploaded.";
    } else if (metaDataFiles.length === 1 && !/\.txt$/i.test(metaDataFiles[0].name)) {
      errors.metaDataFiles = "Metadata file must have a .txt extension.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      openErrorSB();
      return;
    }

    // Arrange data as required
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const createdAt = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const TimeAt = `${pad(now.getHours())}:${pad(now.getMinutes())} ${
      now.getHours() >= 12 ? "pm" : "am"
    }`;
    const updatedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:00`;

    let fileObj2 = bedFiles[0] || {};

    // For demo, use dummy links/keys (replace with actual upload logic in live version)
    const dummyLink = "https://drive.google.com/file/d/1M_oY0EJNH_--bXjIHhi7fv6aWzeZNnjK";
    const dummyKey = "1M_oY0EJNH_--bXjIHhi7fv6aWzeZNnjK";
    let ar = [];

    patientDataFiles.map((item) => {
      const objData = {
        id: Date.now(),
        file_name: item.name || "",
        SampleName: item.name.split("_R")[0],
        file_link: dummyLink,
        key: dummyKey,
        dateOfBirth: form.dob ? form.dob.split("-").reverse().join("-") : "",
        project_name: form.sampleId,
        phenotype: form.patientPhenotype,
        gender: form.gender,
        age: form.age,
        sapecimenType: form.specimenType,
        DateOfSequencing: form.sampleCollectionDate,
        SampleSubmissionDate: form.sampleReceivingDate,
        PlatformUsedForSequencing: form.sequencingPlatform,
        VariantsToBeIdentified: (form.variantsToIdentify || []).join(", "),
        PatientLocation: form.patientLocation,
        RefferedBy: form.referredBy,
        ClinicalHistory: form.clinicalHistory,
        TestInformation: form.testInformation,
        AdditionalInfo: form.additionalInfo,
        file_link2: fileObj2.name ? dummyLink : "",
        key2: fileObj2.name ? dummyKey : "",
        user: user.email,
        assembly: form.assembly,
        status: "Pending",
        createdAt,
        TimeAt,
        updatedAt,
      };
      dispatch(addFile(objData));
      ar.push(objData);
    });

    openSuccessSB();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={3}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" fontWeight="medium" mb={2}>
                  Create Patient Report
                </MDTypography>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <MDBox
                        mb={3}
                        p={3}
                        sx={{
                          background: "#fafdff",
                          borderRadius: 4,
                          boxShadow: 2,
                          border: "1px solid #e3e6f0",
                        }}
                      >
                        {/* Main Form Fields */}
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            {product == "Onquer" ? "Product ID*" : "Sample ID*"}
                          </MDTypography>
                          <input
                            type="text"
                            name="sampleId"
                            value={form.sampleId}
                            onChange={handleChange}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                            required
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Patient Name*
                          </MDTypography>
                          <input
                            type="text"
                            name="patientName"
                            value={form.patientName}
                            onChange={handleChange}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                            required
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Patient Phenotype*
                          </MDTypography>
                          <input
                            type="text"
                            name="patientPhenotype"
                            value={form.patientPhenotype}
                            onChange={handleChange}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                            required
                          />
                        </MDBox>
                        <MDBox mb={2} display="flex" gap={2}>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Gender*
                            </MDTypography>
                            <select
                              name="gender"
                              value={form.gender}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Date of Birth*
                            </MDTypography>
                            <input
                              type="date"
                              name="dob"
                              value={form.dob}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Age*
                            </MDTypography>
                            <input
                              type="number"
                              name="age"
                              value={form.age}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                        </MDBox>
                        <MDBox mb={2} display="flex" gap={2}>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Specimen Type*
                            </MDTypography>
                            <input
                              type="text"
                              name="specimenType"
                              value={form.specimenType}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Sample Collection Date*
                            </MDTypography>
                            <input
                              type="date"
                              name="sampleCollectionDate"
                              value={form.sampleCollectionDate}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Sample Receiving Date*
                            </MDTypography>
                            <input
                              type="date"
                              name="sampleReceivingDate"
                              value={form.sampleReceivingDate}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                        </MDBox>
                        <MDBox mb={2} display="flex" gap={2}>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Platform used for sequencing*
                            </MDTypography>
                            <input
                              type="text"
                              name="sequencingPlatform"
                              value={form.sequencingPlatform}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                              required
                            />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Variants to be identified*
                            </MDTypography>
                            {product == "Inherigene" && (
                              <MDBox
                                display="flex"
                                flexDirection="row"
                                justifyContent="space-between"
                                gap={1}
                              >
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="CNVs"
                                    checked={form.variantsToIdentify.includes("CNVs")}
                                    onChange={handleChange}
                                  />
                                  CNVs
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="SNVs"
                                    checked={form.variantsToIdentify.includes("SNVs")}
                                    onChange={handleChange}
                                  />
                                  SNVs
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="InDels"
                                    checked={form.variantsToIdentify.includes("InDels")}
                                    onChange={handleChange}
                                  />
                                  InDels
                                </label>
                              </MDBox>
                            )}
                            {product == "Onquer" && (
                              <MDBox
                                display="flex"
                                flexDirection="row"
                                flexWrap="wrap"
                                justifyContent="space-between"
                                gap={1}
                              >
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="CNVs"
                                    checked={form.variantsToIdentify.includes("CNVs")}
                                    onChange={handleChange}
                                  />
                                  CNVs
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="SNVs"
                                    checked={form.variantsToIdentify.includes("SNVs")}
                                    onChange={handleChange}
                                  />
                                  SNVs
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="InDels"
                                    checked={form.variantsToIdentify.includes("InDels")}
                                    onChange={handleChange}
                                  />
                                  InDels
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="Fusions"
                                    checked={form.variantsToIdentify.includes("Fusions")}
                                    onChange={handleChange}
                                  />
                                  Fusions
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="HRD"
                                    checked={form.variantsToIdentify.includes("HRD")}
                                    onChange={handleChange}
                                  />
                                  HRD
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="MSI"
                                    checked={form.variantsToIdentify.includes("MSI")}
                                    onChange={handleChange}
                                  />
                                  MSI
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <input
                                    type="checkbox"
                                    name="variantsToIdentify"
                                    value="TMB"
                                    checked={form.variantsToIdentify.includes("TMB")}
                                    onChange={handleChange}
                                  />
                                  TMB
                                </label>
                              </MDBox>
                            )}
                            {formErrors.variantsToIdentify && (
                              <MDTypography variant="caption" color="error">
                                {formErrors.variantsToIdentify}
                              </MDTypography>
                            )}
                          </MDBox>
                        </MDBox>
                        <MDBox mb={2} display="flex" gap={2}>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Patient Location
                            </MDTypography>
                            <input
                              type="text"
                              name="patientLocation"
                              value={form.patientLocation}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                            />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="body2" fontWeight="bold">
                              Referred By
                            </MDTypography>
                            <input
                              type="text"
                              name="referredBy"
                              value={form.referredBy}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1.5px solid #b2bec3",
                                background: "#fff",
                                fontSize: 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "border-color 0.2s",
                              }}
                            />
                          </MDBox>
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Clinical History
                          </MDTypography>
                          <textarea
                            name="clinicalHistory"
                            value={form.clinicalHistory}
                            onChange={handleChange}
                            rows={2}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Test Information
                          </MDTypography>
                          <textarea
                            name="testInformation"
                            value={form.testInformation}
                            onChange={handleChange}
                            rows={2}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Assembly*
                          </MDTypography>
                          <input
                            type="text"
                            name="assembly"
                            value={form.assembly}
                            onChange={handleChange}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                            required
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" fontWeight="bold">
                            Additional Information (If Any)
                          </MDTypography>
                          <textarea
                            name="additionalInfo"
                            value={form.additionalInfo}
                            onChange={handleChange}
                            rows={2}
                            style={{
                              width: "100%",
                              padding: 12,
                              borderRadius: 8,
                              border: "1.5px solid #b2bec3",
                              background: "#fff",
                              fontSize: 16,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              transition: "border-color 0.2s",
                            }}
                          />
                        </MDBox>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {/* File Upload Section 1: Gene list to be analysed */}
                      <MDBox
                        mb={2}
                        p={2}
                        sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
                      >
                        <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
                          Gene list to be analysed
                        </MDTypography>
                        {/* Uploaded Files List */}
                        <MDBox mb={2}>
                          {geneListFiles.length > 0 &&
                            geneListFiles.map((fileObj, idx) => (
                              <MDBox
                                key={idx}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                mb={1}
                                sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                              >
                                <MDBox display="flex" alignItems="center" gap={1}>
                                  <span style={{ fontSize: 28, marginRight: 8 }}>
                                    {fileObj.name.endsWith(".pdf") && "📄"}
                                    {fileObj.name.endsWith(".png") && "🖼️"}
                                    {fileObj.name.endsWith(".zip") && "🗜️"}
                                    {fileObj.name.endsWith(".bed") && "📄"}
                                    {fileObj.name.endsWith(".csv") && "📄"}
                                    {fileObj.name.endsWith(".txt") && "📄"}
                                    {!fileObj.name.match(/\.(pdf|png|zip|bed|csv|txt)$/) && "📁"}
                                  </span>
                                  <MDTypography variant="body2" fontWeight="medium">
                                    {fileObj.name}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text" ml={1}>
                                    {fileObj.status === "finished" ? "Finished" : "Uploading"}{" "}
                                    {Math.round(fileObj.size / 1024)}Kb
                                  </MDTypography>
                                </MDBox>
                                <MDBox>
                                  <MDButton
                                    size="small"
                                    color="error"
                                    variant="text"
                                    onClick={() => handleRemoveFile(idx, setGeneListFiles)}
                                  >
                                    Cancel
                                  </MDButton>
                                </MDBox>
                              </MDBox>
                            ))}
                        </MDBox>
                        {/* Drag and Drop Area */}
                        <MDBox
                          onClick={() => geneListInputRef.current.click()}
                          sx={{
                            border: "2px dashed #b2bec3",
                            borderRadius: 3,
                            background: "#fafdff",
                            textAlign: "center",
                            py: 4,
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                            "&:hover": { borderColor: "#1a73e8" },
                          }}
                        >
                          <input
                            ref={geneListInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, setGeneListFiles)}
                          />
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                            <MDTypography variant="body2" fontWeight="medium" color="text" mt={1}>
                              DRAG AND DROP
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              or Browse
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      {/* File Upload Section 2: Upload Additional BED File */}
                      <MDBox
                        mb={2}
                        p={2}
                        sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
                      >
                        <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
                          Upload Additional BED File {product == "Onquer" && "*"}
                        </MDTypography>
                        <MDBox mb={2}>
                          {bedFiles.length > 0 &&
                            bedFiles.map((fileObj, idx) => (
                              <MDBox
                                key={idx}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                mb={1}
                                sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                              >
                                <MDBox display="flex" alignItems="center" gap={1}>
                                  <span style={{ fontSize: 28, marginRight: 8 }}>
                                    {fileObj.name.endsWith(".bed") && "📄"}
                                    {!fileObj.name.match(/\.(bed)$/) && "📁"}
                                  </span>
                                  <MDTypography variant="body2" fontWeight="medium">
                                    {fileObj.name}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text" ml={1}>
                                    {fileObj.status === "finished" ? "Finished" : "Uploading"}{" "}
                                    {Math.round(fileObj.size / 1024)}Kb
                                  </MDTypography>
                                </MDBox>
                                <MDBox>
                                  <MDButton
                                    size="small"
                                    color="error"
                                    variant="text"
                                    onClick={() => handleRemoveFile(idx, setBedFiles)}
                                  >
                                    Cancel
                                  </MDButton>
                                </MDBox>
                              </MDBox>
                            ))}
                        </MDBox>
                        <MDBox
                          onClick={() => bedInputRef.current.click()}
                          sx={{
                            border: "2px dashed #b2bec3",
                            borderRadius: 3,
                            background: "#fafdff",
                            textAlign: "center",
                            py: 4,
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                            "&:hover": { borderColor: "#1a73e8" },
                          }}
                        >
                          <input
                            ref={bedInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, setBedFiles)}
                          />
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                            <MDTypography variant="body2" fontWeight="medium" color="text" mt={1}>
                              DRAG AND DROP
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              or Browse
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      {/* File Upload Section 3: Patient data* */}
                      <MDBox
                        mb={2}
                        p={2}
                        sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
                      >
                        <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
                          Patient data*
                        </MDTypography>
                        <MDBox mb={2}>
                          {patientDataFiles.length > 0 &&
                            patientDataFiles.map((fileObj, idx) => (
                              <MDBox
                                key={idx}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                mb={1}
                                sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                              >
                                <MDBox display="flex" alignItems="center" gap={1}>
                                  <span style={{ fontSize: 28, marginRight: 8 }}>
                                    {fileObj.name.endsWith(".pdf") && "📄"}
                                    {fileObj.name.endsWith(".png") && "🖼️"}
                                    {fileObj.name.endsWith(".zip") && "🗜️"}
                                    {fileObj.name.endsWith(".bed") && "📄"}
                                    {fileObj.name.endsWith(".csv") && "📄"}
                                    {fileObj.name.endsWith(".txt") && "📄"}
                                    {!fileObj.name.match(/\.(pdf|png|zip|bed|csv|txt)$/) && "📁"}
                                  </span>
                                  <MDTypography variant="body2" fontWeight="medium">
                                    {fileObj.name}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text" ml={1}>
                                    {fileObj.status === "finished" ? "Finished" : "Uploading"}{" "}
                                    {Math.round(fileObj.size / 1024)}Kb
                                  </MDTypography>
                                </MDBox>
                                <MDBox>
                                  <MDButton
                                    size="small"
                                    color="error"
                                    variant="text"
                                    onClick={() => handleRemoveFile(idx, setPatientDataFiles)}
                                  >
                                    Cancel
                                  </MDButton>
                                </MDBox>
                              </MDBox>
                            ))}
                        </MDBox>
                        <MDBox
                          onClick={() => patientDataInputRef.current.click()}
                          sx={{
                            border: "2px dashed #b2bec3",
                            borderRadius: 3,
                            background: "#fafdff",
                            textAlign: "center",
                            py: 4,
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                            "&:hover": { borderColor: "#1a73e8" },
                          }}
                        >
                          <input
                            ref={patientDataInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, setPatientDataFiles)}
                          />
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                            <MDTypography variant="body2" fontWeight="medium" color="text" mt={1}>
                              DRAG AND DROP
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              or Browse
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      {/* File Upload Section 4: Meta data* */}
                      {product == "Onquer" && (
                        <MDBox
                          mb={2}
                          p={2}
                          sx={{ background: "#f5f7fa", borderRadius: 4, boxShadow: 1 }}
                        >
                          <MDTypography variant="h6" fontWeight="bold" mb={2} align="center">
                            Meta data
                          </MDTypography>
                          <MDBox mb={2}>
                            {metaDataFiles.length > 0 &&
                              metaDataFiles.map((fileObj, idx) => (
                                <MDBox
                                  key={idx}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  p={1}
                                  mb={1}
                                  sx={{ background: "#fff", borderRadius: 2, boxShadow: 0.5 }}
                                >
                                  <MDBox display="flex" alignItems="center" gap={1}>
                                    <span style={{ fontSize: 28, marginRight: 8 }}>
                                      {fileObj.name.endsWith(".pdf") && "📄"}
                                      {fileObj.name.endsWith(".png") && "🖼️"}
                                      {fileObj.name.endsWith(".zip") && "🗜️"}
                                      {fileObj.name.endsWith(".bed") && "📄"}
                                      {fileObj.name.endsWith(".csv") && "📄"}
                                      {fileObj.name.endsWith(".txt") && "📄"}
                                      {!fileObj.name.match(/\.(pdf|png|zip|bed|csv|txt)$/) && "📁"}
                                    </span>
                                    <MDTypography variant="body2" fontWeight="medium">
                                      {fileObj.name}
                                    </MDTypography>
                                    <MDTypography variant="caption" color="text" ml={1}>
                                      {fileObj.status === "finished" ? "Finished" : "Uploading"}{" "}
                                      {Math.round(fileObj.size / 1024)}Kb
                                    </MDTypography>
                                  </MDBox>
                                  <MDBox>
                                    <MDButton
                                      size="small"
                                      color="error"
                                      variant="text"
                                      onClick={() => handleRemoveFile(idx, setmetaDataFiles)}
                                    >
                                      Cancel
                                    </MDButton>
                                  </MDBox>
                                </MDBox>
                              ))}
                          </MDBox>
                          <MDBox
                            onClick={() => metaDataInputRef.current.click()}
                            sx={{
                              border: "2px dashed #b2bec3",
                              borderRadius: 3,
                              background: "#fafdff",
                              textAlign: "center",
                              py: 4,
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                              "&:hover": { borderColor: "#1a73e8" },
                            }}
                          >
                            <input
                              ref={metaDataInputRef}
                              type="file"
                              multiple
                              style={{ display: "none" }}
                              onChange={(e) => handleFileChange(e, setmetaDataFiles)}
                            />
                            <MDBox
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <span style={{ fontSize: 36, color: "#b2bec3" }}>☁️</span>
                              <MDTypography variant="body2" fontWeight="medium" color="text" mt={1}>
                                DRAG AND DROP
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                or Browse
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      )}
                    </Grid>
                  </Grid>
                  <MDBox mt={3} display="flex" justifyContent="flex-end">
                    <MDButton type="submit" color="info" variant="gradient">
                      Create Report
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <MDSnackbar
          color="success"
          icon="check"
          title="Success"
          content="Patient report created successfully!"
          open={successSB}
          onClose={closeSuccessSB}
          close={closeSuccessSB}
        />
        <MDSnackbar
          color="info"
          icon="info"
          title="Info"
          content="This is an info message!"
          open={infoSB}
          onClose={closeInfoSB}
          close={closeInfoSB}
        />
        <MDSnackbar
          color="warning"
          icon="warning"
          title="Warning"
          content="This is a warning message!"
          open={warningSB}
          onClose={closeWarningSB}
          close={closeWarningSB}
        />
        <MDSnackbar
          color="error"
          icon="error"
          title="Error"
          content={formErrors[Object.keys(formErrors)[0]] ?? "this is an error message"}
          open={errorSB}
          onClose={closeErrorSB}
          close={closeErrorSB}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Form;
