import { createAction, props } from "@ngrx/store";
import { UserRegister } from "src/app/modul/user/UserRegister";

export const register = createAction('[Register]', props<{userRegister: UserRegister}>());
export const registerSuccess = createAction('[Register] Success');
export const registerFail = createAction('[Register] Fail', props<{error: any}>())
