package com.tlatfarm.tbcrew_tlatfarm.controller;

import com.tlatfarm.tbcrew_tlatfarm.model.SmartPole;
import com.tlatfarm.tbcrew_tlatfarm.service.SmartPoleService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/smartpoles")
public class SmartPoleController {
    
    private final SmartPoleService smartPoleService;

    public SmartPoleController(SmartPoleService smartPoleService) {
        this.smartPoleService = smartPoleService;
    }

    @GetMapping
    public List<SmartPole> getAllSmartPoles() {
        return smartPoleService.getAllSmartPoles();
    }

    @GetMapping("/{id}")
    public SmartPole getSmartPoleById(@PathVariable String id) {
        return smartPoleService.getSmartPoleById(id);
    }

    @PostMapping
    public void addSmartPole(@RequestBody SmartPole smartPole) {
        smartPoleService.addSmartPole(smartPole);
    }

    @PutMapping("/{id}")
    public void updateSmartPole(@PathVariable String id, @RequestBody SmartPole smartPole) {
        smartPole.setId(id);
        smartPoleService.updateSmartPole(smartPole);
    }

    @DeleteMapping("/{id}")
    public void deleteSmartPole(@PathVariable String id) {
        smartPoleService.deleteSmartPole(id);
    }
}