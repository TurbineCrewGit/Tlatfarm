// SmartPole.java
package com.tlatfarm.tbcrew_tlatfarm.model;


public class SmartPole {
    private String id;
    private String powerProduction;
    private double latitude;
    private double longitude; // Correct field name

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPowerProduction() {
        return powerProduction;
    }

    public void setPowerProduction(String powerProduction) {
        this.powerProduction = powerProduction;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) { 
        this.longitude = longitude;
    }
}
