package com.tlatfarm.tbcrew_tlatfarm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface DroneMapper {
    /*
    @Select("SELECT * FROM SmartDrone")
    List<Drone> getAllDrones();

    @Select("SELECT * FROM SmartDrone WHERE id = #{id}")
    Drone getDroneById(int id);

    @Insert("INSERT INTO SmartDrone (status) VALUES (#{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void addDrone(Drone drone);

    @Update("UPDATE SmartDrone SET status = #{status} WHERE id = #{id}")
    void updateDrone(Drone drone);

    @Delete("DELETE FROM SmartDrone WHERE id = #{id}")
    void deleteDrone(int id);
    */

    @Select("""
        SELECT 
            d.id AS droneId,
            d.status AS droneStatus,
            w.isItme,
            w.order_seq,
            w.action,
            w.latitude,
            w.longitude,
            w.altitude,
            w.is_active
        FROM 
            SmartDrone d
        LEFT JOIN 
            DroneWaypoints w 
        ON 
            d.id = w.id
        WHERE 
            w.isItme = 1
        ORDER BY 
            d.id, w.order_seq
    """)
    List<Map<String, Object>> getAllDronesWithWaypoints();
}
