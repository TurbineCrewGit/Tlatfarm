package com.tlatfarm.tbcrew_tlatfarm.mapper;

import com.tlatfarm.tbcrew_tlatfarm.model.Drone;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DroneMapper {
	@Select("SELECT * FROM Drones")
    List<Drone> getAllDrones();

    @Select("SELECT * FROM Drones WHERE id = #{id}")
    Drone getDroneById(int id);

    @Insert("INSERT INTO Drones (name, status) VALUES (#{name}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void addDrone(Drone drone);

    @Update("UPDATE Drones SET name = #{name}, status = #{status} WHERE id = #{id}")
    void updateDrone(Drone drone);

    @Delete("DELETE FROM Drones WHERE id = #{id}")
    void deleteDrone(int id);
}
