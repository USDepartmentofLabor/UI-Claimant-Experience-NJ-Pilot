package nj.lwd.ui.claimantintake.constants;

public enum ClaimEventCategory {
    INITIATED_SAVE, // Claimant has taken an action to save a claim (navigate to the "next" page,
    // clicked "back", clicked "save and exit")
    SAVED, // Claim has been stored in database and S3
    SAVE_FAILED, // The claim was not able to be saved
    WGPM_CACHED, // WGPM response has been saved in s3
    WGPM_CACHE_FAILED, // WGPM response failed to save to s3
    INITIATED_COMPLETE, // Claimant has taken action to complete their claim (clicked complete
    // button on final page of claim form)
    COMPLETED, // Claim has been completed (claimant finished the entire form, and the payload was
    // validated without errors) Completed claims are ready to be submitted
    COMPLETE_FAILED, // The claim could not be completed, likely due to validation errors (something
    // we should return to the user, especially if yup did not catch the errors)
    INITIATED_SUBMIT, // Attempt has been made to submit "downstream" (to RCC)
    SUBMITTED, // Claim has been successfully submitted "downstream" (to RCC)
    SUBMIT_FAILED, // The claim was not able to be submitted
}
