package com.campusfix.api.controller;

import com.campusfix.api.dto.CreateEquipmentRequest;
import com.campusfix.api.dto.UpdateEquipmentStatusRequest;
import com.campusfix.api.model.Equipment;
import com.campusfix.api.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<Equipment>> getAll() {
        return ResponseEntity.ok(equipmentService.getAll());
    }

    @PostMapping
    public ResponseEntity<Equipment> create(@Valid @RequestBody CreateEquipmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipmentService.create(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Equipment> updateStatus(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateEquipmentStatusRequest request) {
        return ResponseEntity.ok(equipmentService.updateStatus(id, request.getStatus()));
    }
}
