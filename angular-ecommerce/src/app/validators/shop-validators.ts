import {FormControl, ValidationErrors} from "@angular/forms";

export class ShopValidators {

//  Whitespace validators
  static notOnlyWhiteSpace(control: FormControl) : ValidationErrors {

    // if the validation check fails then return validation error(s)
    // if validation check passes return null

    // Check if string only contains whitespace
    if((control.value != null) && (control.value.trim().length === 0)) {

    //  Invalid, return error object
      return {'notOnlyWhitespace' : true};

    } else {
      // Valid return null
      return null;
    }
  }

}
