package com.medirec.service;

import com.medirec.dto.LoginRequest;
import com.medirec.dto.LoginResponse;
import com.medirec.dto.SignupRequest;
import com.medirec.dto.SignupResponse;
import com.medirec.entity.User;
import com.medirec.repository.UserRepository;
import com.medirec.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import com.medirec.entity.RegistrationStatus;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    private static final Set<String> ROLES_REQUIRING_APPROVAL = Set.of("ROLE_DOCTOR", "ROLE_PHARMACY", "ROLE_LAB_STAFF");

    @Transactional
    public SignupResponse signup(SignupRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return new SignupResponse(null, "Email already in use");
        }
        User user = new User();
        user.setName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Collections.singleton(req.getRole()));
        user.setMobile(req.getMobile());
        if (req.getDateOfBirth() != null) user.setDateOfBirth(req.getDateOfBirth());
        if (req.getDepartment() != null) user.setDepartment(req.getDepartment());
        if (req.getAffiliation() != null) user.setAffiliation(req.getAffiliation());
        if (req.getGovernmentId() != null) user.setGovernmentId(req.getGovernmentId());
        if (req.getLicenseProofDocument() != null) user.setLicenseProofDocument(req.getLicenseProofDocument());
        if (req.getExperienceSummary() != null) user.setExperienceSummary(req.getExperienceSummary());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getLanguage() != null) user.setLanguage(req.getLanguage());
        user.setTwoFactorEnabled(req.isTwoFactorPreference());
        if ("ROLE_DOCTOR".equals(req.getRole()) || ROLES_REQUIRING_APPROVAL.contains(req.getRole())) {
            if (req.getMedicalCouncilName() != null) user.setMedicalCouncilName(req.getMedicalCouncilName());
            if (req.getEmergencyResponseNumber() != null) user.setEmergencyResponseNumber(req.getEmergencyResponseNumber());
        }
        if ("ROLE_LAB_STAFF".equals(req.getRole())) {
            if (req.getLabType() != null) user.setLabType(req.getLabType());
            if (req.getCertifications() != null) user.setCertifications(req.getCertifications());
        }
        if ("ROLE_ADMIN".equals(req.getRole())) {
            if (req.getOrganizationPosition() != null) user.setOrganizationPosition(req.getOrganizationPosition());
            if (req.getJurisdiction() != null) user.setJurisdiction(req.getJurisdiction());
            if (req.getAccessLevel() != null) user.setAccessLevel(req.getAccessLevel());
        }
        if (!ROLES_REQUIRING_APPROVAL.contains(req.getRole())) {
            user.setRegistrationStatus(RegistrationStatus.APPROVED);
        }
        userRepository.save(user);
        String message;
        if (user.getRegistrationStatus() == RegistrationStatus.PENDING_APPROVAL) {
            message = "Registration successful. Your account is pending admin approval.";
        } else {
            message = "User registered successfully.";
        }
        return new SignupResponse(user.getUuid().toString(), message);
    }

    public LoginResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication - this should not happen"));
        if (user.getRegistrationStatus() == RegistrationStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Account is pending admin approval. Please wait for activation.");
        }
        if (user.getRegistrationStatus() == RegistrationStatus.REJECTED) {
            throw new RuntimeException("Your registration request has been rejected. Please contact support.");
        }
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtils.generateJwtToken(auth);
        String role = auth.getAuthorities().iterator().next().getAuthority();

        return new LoginResponse(token, role, user.getUuid().toString(), user.getName(), user.getEmail());
    }

    @Transactional
    public void updateTwoFactorSecret(String email, String secret) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
    }

    public String getTwoFactorSecret(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getTwoFactorSecret();
    }

    @Transactional
    public void enableTwoFactor(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }
} 