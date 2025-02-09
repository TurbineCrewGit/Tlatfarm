package com.tlatfarm.tbcrew_tlatfarm.service;

import com.tlatfarm.tbcrew_tlatfarm.mapper.DroneMapper;
import com.tlatfarm.tbcrew_tlatfarm.model.Drone;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DroneService {
    private final DroneMapper droneMapper;

    public DroneService(DroneMapper droneMapper) {
        this.droneMapper = droneMapper;
    }

    public List<Drone> getAllDrones() {
        return droneMapper.getAllDrones();
    }

    public Drone getDroneById(String id) {
        return droneMapper.getDroneById(id);
    }

    public void addDrone(Drone drone) {
        droneMapper.addDrone(drone);
    }

    public void updateDrone(Drone drone) {
        droneMapper.updateDrone(drone);
    }

    public void deleteDrone(String id) {
        droneMapper.deleteDrone(id);
    }

    public List<Map<String, Object>> getAllDronesWithWaypoints() {
        return droneMapper.getAllDronesWithWaypoints();
    }
}
