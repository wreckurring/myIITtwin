package com.myiittwin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LogResponse {
    private int week;
    private String text;
    private String aryanReply;
    private String date;
}
