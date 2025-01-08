package com.tlatfarm.tbcrew_tlatfarm.service;


import com.tlatfarm.tbcrew_tlatfarm.mapper.SmartPoleMapper;
import com.tlatfarm.tbcrew_tlatfarm.model.SmartPole;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SmartPoleService {
    
    private final SmartPoleMapper smartPoleMapper;

    public SmartPoleService(SmartPoleMapper smartPoleMapper) {
        this.smartPoleMapper = smartPoleMapper;
    }

    public List<SmartPole> getAllSmartPoles() {
        return smartPoleMapper.getAllSmartPoles();
    }

    public SmartPole getSmartPoleById(String id) {
        return smartPoleMapper.getSmartPoleById(id);
    }

    public void addSmartPole(SmartPole smartPole) {
        smartPoleMapper.addSmartPole(smartPole);
    }

    public void updateSmartPole(SmartPole smartPole) {
        smartPoleMapper.updateSmartPole(smartPole);
    }

    public void deleteSmartPole(String id) {
        smartPoleMapper.deleteSmartPole(id);
    }
}
