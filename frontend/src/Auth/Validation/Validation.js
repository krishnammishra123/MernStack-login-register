
//register
 export const registerValidation = (userDetails) => {
    let errors = {}; 

    if (!userDetails.firstName?.trim()) {
      errors.firstName = "*FirstName is required";
    }

    if (!userDetails.lastName?.trim()) {
      errors.lastName = "*LastName is required";
    }
  
    if (!userDetails.email?.trim()) {
      errors.email = "*Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userDetails.email)) {
      errors.email = "*You have entered an invalid email address!";
    }
  
    if (!userDetails.password?.trim()) {
      errors.password = "*Password is required";  
    } else if (userDetails.password.length < 8) {
      errors.password = "*Password must be at least 8 characters long";  
    }
  
    return errors;
  }


//login
  export const loginValidation = (userDetails) => {
    let errors = {};  
  
    if (!userDetails.email?.trim()) {
      errors.email = "*Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userDetails.email)) {
      errors.email = "*You have entered an invalid email address!";
    }
  
    if (!userDetails.password?.trim()) {
      errors.password = "*Password is required";  
    } else if (userDetails.password.length < 8) {
      errors.password = "*Password must be at least 8 characters long";  
    }
  
    return errors;
  }
  
  //forgot Password
  export const forgotPasswordValidation = (userDetails) => {
    let errors = {};  
  
    if (!userDetails.email?.trim()) {
      errors.email = "*Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userDetails.email)) {
      errors.email = "*You have entered an invalid email address!";
    }
 
    return errors;
  }

  //reset Password
  export const resetPasswordValidation = (userDetails) => {
    let errors = {};  

    if (!userDetails.password?.trim()) {
      errors.password = "*Password is required";  
    } else if (userDetails.password.length < 8) {
      errors.password = "*Password must be at least 8 characters long";  
    }

    if (!userDetails.confirmPassword?.trim()) {
      errors.confirmPassword = "*Confirm Password is required";
    } else if (userDetails.confirmPassword !== userDetails.password) {
      errors.confirmPassword = "*Passwords do not match";
    }
 
 
    return errors;
  }