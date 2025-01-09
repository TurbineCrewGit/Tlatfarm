package com.tlatfarm.tbcrew_tlatfarm.controller;
import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlatfarm.tbcrew_tlatfarm.service.OnnxPredictionService;

import ai.onnxruntime.OrtException;

@RestController
@RequestMapping("/predict")
public class PredictionController {
	 	private final OnnxPredictionService predictionService;

	    public PredictionController() throws OrtException, IOException {
	        this.predictionService = new OnnxPredictionService();
	    }

	    @PostMapping("/energy")
	    public float[] predictEnergy(@RequestBody float[] inputData) throws Exception {
	        return predictionService.predictEnergy(inputData);
	    }

	    @PostMapping("/agriculture")
	    public float predictAgriculture(@RequestBody float[] inputData) throws Exception {
	        return predictionService.predictAgriculture(inputData);
	    }
	    
	    @GetMapping("/metrics")
	    public Map<String, Object> getModelMetrics() {
	        try {
	            // JSON 파일 읽기
	            ObjectMapper objectMapper = new ObjectMapper();
	            File metricsFile = new File("src/main/resources/model_metrics.json");
	            return objectMapper.readValue(metricsFile, Map.class);
	        } catch (Exception e) {
	            throw new RuntimeException("Failed to load model metrics", e);
	        }
	    }

}
