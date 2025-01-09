package com.tlatfarm.tbcrew_tlatfarm.service;

import ai.onnxruntime.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

public class OnnxPredictionService {
	private OrtEnvironment env;
    private OrtSession energySession;
    private OrtSession agricultureSession;

    public OnnxPredictionService() throws OrtException, IOException {
        env = OrtEnvironment.getEnvironment();

        // Spring 클래스패스를 통해 모델 로드
        Path energyModelPath = new ClassPathResource("models/energy_model.onnx").getFile().toPath();
        Path agricultureModelPath = new ClassPathResource("models/agriculture_model.onnx").getFile().toPath();

        energySession = env.createSession(energyModelPath.toString(), new OrtSession.SessionOptions());
        agricultureSession = env.createSession(agricultureModelPath.toString(), new OrtSession.SessionOptions());
    }

    public float[] predictEnergy(float[] inputData) throws OrtException {
        Map<String, OnnxTensor> input = new HashMap<>();
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, new float[][]{inputData});
        input.put(energySession.getInputNames().iterator().next(), inputTensor);

        OrtSession.Result result = energySession.run(input);
        float[][] predictions = (float[][]) result.get(0).getValue(); // 2D 배열로 반환됨
        inputTensor.close();
        result.close();

        return predictions[0]; // 1D 배열로 변환 후 반환
    }


    public float predictAgriculture(float[] inputData) throws OrtException {
        Map<String, OnnxTensor> input = new HashMap<>();
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, new float[][]{inputData});
        input.put(agricultureSession.getInputNames().iterator().next(), inputTensor);

        OrtSession.Result result = agricultureSession.run(input);
        float[][] predictions = (float[][]) result.get(0).getValue(); // 2D 배열로 반환됨
        inputTensor.close();
        result.close();

        return predictions[0][0]; // 단일 값으로 반환
    }


    public void close() throws OrtException {
        energySession.close();
        agricultureSession.close();
        env.close();
    }
}
