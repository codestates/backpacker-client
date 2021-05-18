import { GET_LOGIN_TOKEN, LOGIN_FAIL } from "action/LoginAction";

let loginState: {
  email?: string;
  password?: string;
  accesstoken?: string;
  success: boolean;
} = {
  success: false,
};
interface loginAct {
  email?: string;
  password?: string;
  type: string;
  payload?: string;
}

const loginReducer = (state = loginState, action: loginAct) => {
  switch (action.type) {
    case GET_LOGIN_TOKEN:
      return {
        ...state,
        email: action.email,
        password: action.password,
        accesstoken: action.payload,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        email: action.email,
        password: action.password,
        success: false,
      };

    default:
      return state;
  }
};

export default loginReducer;