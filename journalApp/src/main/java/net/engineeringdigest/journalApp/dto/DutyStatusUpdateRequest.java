package net.engineeringdigest.journalApp.dto;

import lombok.Data;
import net.engineeringdigest.journalApp.documents.Driver.DutyStatus;

import javax.validation.constraints.NotNull;

@Data
public class DutyStatusUpdateRequest {

    @NotNull
    private DutyStatus dutyStatus;
}

