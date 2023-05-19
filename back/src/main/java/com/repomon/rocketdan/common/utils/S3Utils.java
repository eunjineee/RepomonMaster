package com.repomon.rocketdan.common.utils;

public class S3Utils {
    private static final String modelPrefix = "https://repomon.s3.ap-northeast-2.amazonaws.com/models/";
    private static final String skillPrefix = "https://repomon.s3.ap-northeast-2.amazonaws.com/skill/";

    public static String modelUrl(String fileName){
        return modelPrefix + fileName;
    }
    public static String skillUrl(String fileName) {return skillPrefix + fileName;}
}
