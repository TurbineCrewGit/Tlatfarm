package com.tlatfarm.tbcrew_tlatfarm.controller;

import com.tlatfarm.tbcrew_tlatfarm.model.Drone;
import com.tlatfarm.tbcrew_tlatfarm.service.DroneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Map 타입 임포트

@RestController
@RequestMapping("/api/drones")
public class DroneController {
    private final DroneService droneService;

    public DroneController(DroneService droneService) {
        this.droneService = droneService;
    }
   
    
    @GetMapping
    public List<Drone> getAllDrones() {
        return droneService.getAllDrones();
    }

    @GetMapping("/{id}")
    public Drone getDroneById(@PathVariable String id) {
        return droneService.getDroneById(id);
    }

    @PostMapping
    public void addDrone(@RequestBody Drone drone) {
        droneService.addDrone(drone);
    }

    @PutMapping("/{id}")
    public void updateDrone(@PathVariable String id, @RequestBody Drone drone) {
        drone.setId(id);
        droneService.updateDrone(drone);
    }

    @DeleteMapping("/{id}")
    public void deleteDrone(@PathVariable String id) {
        droneService.deleteDrone(id);
    }

    @GetMapping("/with-waypoints")
    public List<Map<String, Object>> getAllDronesWithWaypoints() {
        return droneService.getAllDronesWithWaypoints();
    }
}
