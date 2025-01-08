package com.tlatfarm.tbcrew_tlatfarm.mapper;

import com.tlatfarm.tbcrew_tlatfarm.model.SmartPole;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SmartPoleMapper {
    @Select("SELECT * FROM SmartPole")
    List<SmartPole> getAllSmartPoles();

    @Select("SELECT * FROM SmartPole WHERE id = #{id}")
    SmartPole getSmartPoleById(String id);

    @Insert("INSERT INTO SmartPole (id, PowerProduction, latitude, longitude) " +
            "VALUES (#{id}, #{powerProduction}, #{latitude}, #{longitude})")
    void addSmartPole(SmartPole smartPole);

    @Update("UPDATE SmartPole SET PowerProduction = #{powerProduction}, " +
            "latitude = #{latitude}, longitude = #{longitude} WHERE id = #{id}")
    void updateSmartPole(SmartPole smartPole);

    @Delete("DELETE FROM SmartPole WHERE id = #{id}")
    void deleteSmartPole(String id);
}