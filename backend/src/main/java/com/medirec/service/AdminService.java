package com.medirec.service;

import com.medirec.dto.UserDto;
import com.medirec.entity.User;
import com.medirec.repository.UserRepository;
import com.medirec.repository.SignupRequestRepository;
import com.medirec.entity.SignupRequest;
import com.medirec.dto.SignupRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Collections;
import com.medirec.dto.LogEntryDto;
import com.medirec.dto.DoctorPanelDto;
import com.medirec.dto.EmergencyPanelDto;
import com.medirec.dto.LabPanelDto;
import com.medirec.dto.PharmacyPanelDto;
import com.medirec.dto.SettingsDto;
import com.medirec.dto.DashboardSummaryDto;
import com.medirec.dto.UserRoleStatsDto;
import java.util.Arrays;

@Service
@Transactional(readOnly = true)
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SignupRequestRepository signupRequestRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserDto mapEntityToDto(User user) {
        return new UserDto(
            user.getUuid(),
            user.getName(),
            user.getEmail(),
            user.getRoles(),
            null
        );
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public UserDto getUser(UUID uuid) {
        User user = userRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return mapEntityToDto(user);
    }

    @Transactional
    public UserDto createUser(UserDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRoles(dto.getRoles());
        userRepository.save(user);
        return mapEntityToDto(user);
    }

    @Transactional
    public UserDto updateUser(UUID uuid, UserDto dto) {
        User user = userRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getRoles() != null) user.setRoles(dto.getRoles());
        userRepository.save(user);
        return mapEntityToDto(user);
    }

    @Transactional
    public void deleteUser(UUID uuid) {
        userRepository.deleteById(uuid);
    }

    private SignupRequestDto mapToDto(SignupRequest req) {
        return new SignupRequestDto(
            req.getUuid(), req.getFullName(), req.getEmail(), req.getRole(), req.getStatus(), req.getRequestedAt()
        );
    }

    public List<SignupRequestDto> getPendingRequests() {
        return signupRequestRepository.findByStatus("PENDING").stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public String approvePendingRequest(UUID uuid) {
        SignupRequest req = signupRequestRepository.findById(uuid)
            .orElseThrow(() -> new RuntimeException("Signup request not found"));
        User user = new User();
        user.setName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Collections.singleton(req.getRole()));
        userRepository.save(user);
        req.setStatus("APPROVED");
        signupRequestRepository.save(req);
        return "Approved signup for " + req.getFullName();
    }

    public List<LogEntryDto> getLogs() {
        return Collections.emptyList();
    }

    public DoctorPanelDto getDoctorPanel() {
        return new DoctorPanelDto(10, 8, 5);
    }

    public EmergencyPanelDto getEmergencyPanel() {
        return new EmergencyPanelDto(20, 15, Collections.emptyList());
    }

    public LabPanelDto getLabPanel() {
        return new LabPanelDto(50, 45);
    }

    public PharmacyPanelDto getPharmacyPanel() {
        return new PharmacyPanelDto(200, 20);
    }

    public SettingsDto getSettings() {
        return new SettingsDto(false, "support@medirec.com");
    }

    @Transactional
    public SettingsDto updateSettings(SettingsDto dto) {
        return dto;
    }

    public DashboardSummaryDto getDashboardSummaryStats() {
        long pending = signupRequestRepository.findByStatus("PENDING").size();
        return new DashboardSummaryDto(
            78L,
            12L,
            23L,
            pending,
            156L,
            340L
        );
    }

    public UserRoleStatsDto getDashboardUserRoleStats() {
        return new UserRoleStatsDto(
            Arrays.asList("Doctors", "Labs", "Pharmacies", "Patients", "Pending"),
            Arrays.asList(78L, 12L, 23L, 350L, 5L)
        );
    }
} 