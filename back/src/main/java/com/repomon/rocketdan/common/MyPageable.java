package com.repomon.rocketdan.common;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel
public class MyPageable {
    @ApiModelProperty(value = "페이지 번호( 0 부터시작 )")
    private Long page;
    @ApiModelProperty(value = "페이지 크기", allowableValues = "range[0, 100]")
    private Long size;
}

