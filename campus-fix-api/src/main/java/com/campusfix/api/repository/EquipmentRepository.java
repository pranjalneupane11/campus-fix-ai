package com.campusfix.api.repository;

import com.campusfix.api.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    boolean existsByAssetId(String assetId);
}
