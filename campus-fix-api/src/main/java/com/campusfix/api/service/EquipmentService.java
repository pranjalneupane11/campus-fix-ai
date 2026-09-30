package com.campusfix.api.service;

import com.campusfix.api.dto.CreateEquipmentRequest;
import com.campusfix.api.exception.DuplicateResourceException;
import com.campusfix.api.exception.ResourceNotFoundException;
import com.campusfix.api.model.Equipment;
import com.campusfix.api.model.EquipmentStatus;
import com.campusfix.api.repository.EquipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<Equipment> getAll() {
        return equipmentRepository.findAll();
    }

    @Transactional
    public Equipment create(CreateEquipmentRequest req) {
        if (equipmentRepository.existsByAssetId(req.getAssetId().trim())) {
            throw new DuplicateResourceException("Asset ID already exists: " + req.getAssetId());
        }
        Equipment equipment = new Equipment();
        equipment.setAssetId(req.getAssetId().trim());
        equipment.setName(req.getName().trim());
        equipment.setType(req.getType());
        equipment.setBuilding(req.getBuilding().trim());
        equipment.setRoom(req.getRoom() == null ? null : req.getRoom().trim());
        equipment.setStatus(EquipmentStatus.OPERATIONAL);
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateStatus(Long id, EquipmentStatus status) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id " + id));
        equipment.setStatus(status);
        return equipmentRepository.save(equipment);
    }
}
