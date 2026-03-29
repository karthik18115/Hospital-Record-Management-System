package com.medirec.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_registration_status", columnList = "registration_status")
})
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "uuid", updatable = false, nullable = false)
    private UUID uuid;

    @Column(nullable = false)
    private String name; // Will store fullName

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_uuid"))
    @Column(name = "role")
    private Set<String> roles;

    // Essential Information
    private String mobile;
    private LocalDate dateOfBirth;
    private String department;
    private String affiliation;
    private String governmentId;
    @Column(columnDefinition = "TEXT")
    private String licenseProofDocument;
    @Column(columnDefinition = "TEXT")
    private String experienceSummary;
    private String gender; // Optional
    private String language;
    @Column(columnDefinition = "TEXT")
    private String address;

    // New fields for profile completion
    private String avatarUrl; // URL to user's profile picture
    private String bloodGroup;

    @ElementCollection(fetch = FetchType.EAGER) // Eager fetch for simplicity, consider LAZY for larger collections
    @CollectionTable(name = "user_allergies", joinColumns = @JoinColumn(name = "user_uuid"))
    @Column(name = "allergy_name")
    private Set<String> allergies = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_chronic_conditions", joinColumns = @JoinColumn(name = "user_uuid"))
    @Column(name = "condition_name")
    private Set<String> chronicConditions = new HashSet<>();

    private String insuranceProvider;
    private String insurancePolicyId;
    private String insuranceMemberId;
    // End of new fields

    @Column(name = "profile_setup_complete", nullable = false)
    private boolean profileSetupComplete = false;

    @Enumerated(EnumType.STRING) // To store the enum as a string in the DB
    @Column(name = "registration_status")
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING_APPROVAL; // Default for new users

    // Role-specific fields (nullable, as they depend on the role)
    // Doctor
    private String medicalCouncilName;
    private String emergencyResponseNumber;

    // Lab Technician
    private String labType;
    @Column(columnDefinition = "TEXT")
    private String certifications;

    // Admin
    private String organizationPosition;
    private String jurisdiction;
    private String accessLevel;

    // Security
    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    // Audit timestamps
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public User() {
    }

    // Getters and setters

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAffiliation() {
        return affiliation;
    }

    public void setAffiliation(String affiliation) {
        this.affiliation = affiliation;
    }

    public String getGovernmentId() {
        return governmentId;
    }

    public void setGovernmentId(String governmentId) {
        this.governmentId = governmentId;
    }

    public String getLicenseProofDocument() {
        return licenseProofDocument;
    }

    public void setLicenseProofDocument(String licenseProofDocument) {
        this.licenseProofDocument = licenseProofDocument;
    }

    public String getExperienceSummary() {
        return experienceSummary;
    }

    public void setExperienceSummary(String experienceSummary) {
        this.experienceSummary = experienceSummary;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isProfileSetupComplete() {
        return profileSetupComplete;
    }

    public void setProfileSetupComplete(boolean profileSetupComplete) {
        this.profileSetupComplete = profileSetupComplete;
    }

    public String getMedicalCouncilName() {
        return medicalCouncilName;
    }

    public void setMedicalCouncilName(String medicalCouncilName) {
        this.medicalCouncilName = medicalCouncilName;
    }

    public String getEmergencyResponseNumber() {
        return emergencyResponseNumber;
    }

    public void setEmergencyResponseNumber(String emergencyResponseNumber) {
        this.emergencyResponseNumber = emergencyResponseNumber;
    }

    public String getLabType() {
        return labType;
    }

    public void setLabType(String labType) {
        this.labType = labType;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public String getOrganizationPosition() {
        return organizationPosition;
    }

    public void setOrganizationPosition(String organizationPosition) {
        this.organizationPosition = organizationPosition;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public String getTwoFactorSecret() {
        return twoFactorSecret;
    }

    public void setTwoFactorSecret(String twoFactorSecret) {
        this.twoFactorSecret = twoFactorSecret;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Set<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(Set<String> allergies) {
        this.allergies = allergies;
    }

    public Set<String> getChronicConditions() {
        return chronicConditions;
    }

    public void setChronicConditions(Set<String> chronicConditions) {
        this.chronicConditions = chronicConditions;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }

    public String getInsurancePolicyId() {
        return insurancePolicyId;
    }

    public void setInsurancePolicyId(String insurancePolicyId) {
        this.insurancePolicyId = insurancePolicyId;
    }

    public String getInsuranceMemberId() {
        return insuranceMemberId;
    }

    public void setInsuranceMemberId(String insuranceMemberId) {
        this.insuranceMemberId = insuranceMemberId;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 