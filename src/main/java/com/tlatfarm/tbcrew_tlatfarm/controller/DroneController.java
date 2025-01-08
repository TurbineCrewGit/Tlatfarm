package com.tlatfarm.tbcrew_tlatfarm.controller;

import com.tlatfarm.tbcrew_tlatfarm.model.Drone;
import com.tlatfarm.tbcrew_tlatfarm.service.DroneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Drone getDroneById(@PathVariable int id) {
        return droneService.getDroneById(id);
    }

    @PostMapping
    public void addDrone(@RequestBody Drone drone) {
        droneService.addDrone(drone);
    }

    @PutMapping("/{id}")
    public void updateDrone(@PathVariable int id, @RequestBody Drone drone) {
        drone.setId(id);
        droneService.updateDrone(drone);
    }

    @DeleteMapping("/{id}")
    public void deleteDrone(@PathVariable int id) {
        droneService.deleteDrone(id);
    }
}
