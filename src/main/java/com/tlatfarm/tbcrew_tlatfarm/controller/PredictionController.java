package com.tlatfarm.tbcrew_tlatfarm.controller;
import java.io.IOException;

import org.springframework.web.bind.annotation.*;

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

}
